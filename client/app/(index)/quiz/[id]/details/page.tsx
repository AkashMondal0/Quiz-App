"use client"

import React, { use, useEffect, useRef, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
    Legend,
} from "recharts"
import { eventSchema, EventFormSchema } from "@/types/schemas/quizSchema"
import Counter from "@/components/quiz/Counter"
import { useDebounce } from "@/hooks/useDebounce"
import { useAxios } from "@/hooks/useAxios"
import { Quiz } from "@/types/QuizTypes"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

function deepEqual(a: any, b: any) {
    return JSON.stringify(a) === JSON.stringify(b)
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const { data, loading } = useAxios<Quiz>({
        url: `/quiz/${id}/details`,
        method: "GET",
    })

    const [participantLimit, setParticipantLimit] = useState(100)
    const [durationLimitSeconds, setDurationLimitSeconds] = useState(900)

    const eventForm = useForm<EventFormSchema>({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            eventId: id,
            title: data?.title || "",
            description: data?.description || "",
            isDurationEnabled: data?.isDurationEnabled || false,
            sendEmailFeatureEnabled: data?.sendEmailFeatureEnabled || false,
            participantLimitEnabled: data?.participantLimitEnabled || false,
            participantLimit: data?.participantLimit || participantLimit,
        },
    })

    const saveEventHandler = (formData: EventFormSchema) => {
        toast.success("Event settings saved!", {
            description: JSON.stringify({
                ...formData,
                participantLimit,
                durationLimitSeconds,
            }),
        })
    }

    const {
        register,
        control,
        watch,
        setValue,
        formState: { errors },
    } = eventForm

    const watchedValues = watch()
    const debouncedTitle = useDebounce(watchedValues.title, 500)
    const debouncedDescription = useDebounce(watchedValues.description, 500)

    const formSnapshot = {
        ...watchedValues,
        title: debouncedTitle,
        description: debouncedDescription,
        participantLimit,
        durationLimitSeconds,
    }

    const hasMounted = useRef(false)
    const lastSaved = useRef(formSnapshot)

    const attemptStats = data?.questions.map((question, qIdx) => {
        const counts = question?.options?.map((_, optIdx) =>
            data?.attempts?.reduce((acc, attempt) => {
                if(!attempt?.selectedAnswers) return acc
                return acc + (attempt?.selectedAnswers[qIdx] === optIdx ? 1 : 0)
            }, 0)
        )
        return {
            question: question.text,
            options: question?.options?.map((opt, i) => ({
                name: opt,
                count: counts ? counts[i] : 0,
                isCorrect: i === question.correctIndex,
            })),
        }
    })

    useEffect(() => {
        if (!hasMounted.current) {
            hasMounted.current = true
            return
        }
        const changed = !deepEqual(formSnapshot, lastSaved.current)
        if (changed) {
            lastSaved.current = formSnapshot
            saveEventHandler(formSnapshot)
        }
    }, [formSnapshot])

    const updateCounter = (
        setter: Function,
        state: number,
        step: number,
        min: number,
        max: number,
        field: keyof typeof watchedValues
    ) => {
        const newValue = Math.min(Math.max(state + step, min), max)
        setter(newValue)
        setValue(field, newValue)
    }

    if (loading) return <div className="p-4">Loading...</div>

    const highestAttempts = data?.attempts && data?.attempts.reduce((acc, attempt) => {
        if (!acc[attempt.userId] || attempt.score > acc[attempt.userId].score) {
            acc[attempt.userId] = attempt
        }
        return acc
    }, {} as Record<string, typeof data.attempts[number]>)

    const sortedAttempts = highestAttempts
        ? Object.values(highestAttempts).sort((a, b) => b.score - a.score)
        : []

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold text-center mb-6">Quiz Details</h1>
            <div className="flex w-full max-w-4xl flex-col gap-6 mx-auto">
                <Tabs defaultValue="questions">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="questions">Questions</TabsTrigger>
                        <TabsTrigger value="participants">Participants</TabsTrigger>
                        <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>

                    {questions()}

                    {Participants()}

                    {Leaderboard()}

                    {Settings()}
                </Tabs>
            </div>
        </div>
    )

    function questions() {
        return <TabsContent value="questions">
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl text-center">Answer Distribution</CardTitle>
                </CardHeader>
                <CardContent className="space-y-10">
                    {attemptStats?.map((questionStat, index) => (
                        <div key={index} className="space-y-4">
                            <h2 className="font-semibold text-md">Q{index + 1}: {questionStat.question}</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart
                                    layout="vertical"
                                    data={questionStat.options}
                                    margin={{ top: 10, right: 30, left: 120, bottom: 5 }}
                                >
                                    <XAxis type="number" allowDecimals={false} />
                                    <YAxis
                                        dataKey="name"
                                        type="category"
                                        width={250}
                                        tick={{ fontSize: 14 }}
                                    />
                                    <Tooltip formatter={(value: any) => [`${value} selections`, "Selected"]} />
                                    <Legend />
                                    <Bar dataKey="count">
                                        {questionStat?.options?.map((entry, i) => (
                                            <Cell
                                                key={`cell-${i}`}
                                                fill={entry.isCorrect ? "#22c55e" : "#3b82f6"}
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                            <ul className="text-sm text-muted-foreground pl-2">
                                {questionStat?.options?.map((opt, i) => (
                                    <li key={i}>
                                        {opt.name} – {opt.count} selected – {opt.isCorrect ? (
                                            <span className="text-green-600 font-semibold">Correct</span>
                                        ) : (
                                            <span className="text-red-500">Wrong</span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </TabsContent>
    }

    function Participants() {
        return <TabsContent value="participants">
            <Card>
                <CardHeader>
                    <CardTitle className="text-center text-xl">Participants</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {data?.participants?.map((p, i) => (
                        <div key={i} className="border-b pb-2">
                            <p><strong>{p.name}</strong> ({p.email})</p>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </TabsContent>
    }

    function Leaderboard() {
        return <TabsContent value="leaderboard">
            <Card>
                <CardHeader>
                    <CardTitle className="text-center text-xl">Leaderboard</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {sortedAttempts.map((a, i) => {
                        const user = data?.participants?.find(p => p.id === a.userId)
                        return (
                            <div key={i} className="flex items-center border-b pb-2 space-x-4">
                                <Avatar className="w-10 h-10">
                                    <AvatarFallback>
                                        {(user?.name?.slice(0, 2).toUpperCase()) || "??"}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <p className="font-semibold text-left">{user?.name || "Unknown User"} ({user?.username || "No Username"})</p>
                                    <p className="text-sm text-muted-foreground text-left">{user?.email || "No Email"}</p>
                                    <p className="text-sm text-muted-foreground text-left">
                                        Score: {a.score} / {data?.questions.length}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </CardContent>
            </Card>
        </TabsContent>
    }

    function Settings() {
        return <TabsContent value="settings">
            <Card>
                <CardHeader>
                    <CardTitle className="text-center text-xl">Event Settings</CardTitle>
                </CardHeader>
                <CardContent>
                    <form className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium">Event ID</label>
                            <Input {...register("eventId")} disabled />
                            {errors.eventId && <p className="text-sm text-red-500">{errors.eventId.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium">Event Title</label>
                            <Input {...register("title")} />
                            {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium">Event Description</label>
                            <Textarea {...register("description")} rows={3} />
                            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
                        </div>

                        <FormSwitch label="Enable Duration Limit" name="isDurationEnabled" control={control} />

                        <Counter
                            label="Duration (seconds)"
                            value={durationLimitSeconds}
                            min={60}
                            max={7200}
                            step={60}
                            increment={() => updateCounter(setDurationLimitSeconds, durationLimitSeconds, 60, 60, 7200, "durationLimitSeconds")}
                            decrement={() => updateCounter(setDurationLimitSeconds, durationLimitSeconds, -60, 60, 7200, "durationLimitSeconds")} />

                        <FormSwitch label="Enable Email Feature" name="sendEmailFeatureEnabled" control={control} />
                        <FormSwitch label="Enable Participant Limit" name="participantLimitEnabled" control={control} />

                        <Counter
                            label="Participant Limit"
                            value={participantLimit}
                            min={1}
                            max={1000}
                            step={10}
                            increment={() => updateCounter(setParticipantLimit, participantLimit, 10, 1, 1000, "participantLimit")}
                            decrement={() => updateCounter(setParticipantLimit, participantLimit, -10, 1, 1000, "participantLimit")} />

                        <FormSwitch label="Public Event" name="isPublic" control={control} />
                    </form>
                </CardContent>
            </Card>
        </TabsContent>
    }
}

function FormSwitch({ label, name, control }: { label: string, name: keyof EventFormSchema, control: any }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{label}</span>
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                )}
            />
        </div>
    )
}
