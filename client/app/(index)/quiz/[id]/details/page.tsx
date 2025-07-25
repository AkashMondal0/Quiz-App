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
    CardDescription,
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
} from "recharts"
import { eventSchema, EventFormSchema } from "@/types/schemas/quizSchema"
import Counter from "@/components/quiz/Counter"
import { useDebounce } from "@/hooks/useDebounce"
import { useAxios } from "@/hooks/useAxios"
import { Quiz } from "@/types/QuizTypes"

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
    const dummyStats = data?.questions.map((q) => ({
        question: q.text,
        options: q?.options?.map((opt, i) => ({
            name: opt,
            count: Math.floor(Math.random() * 5),
            isCorrect: i === q.correctIndex,
        })),
    }))
    const eventForm = useForm<EventFormSchema>({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            eventId: id,
            title: "",
            description: "",
            isDurationEnabled: true,
            durationLimitSeconds,
            sendEmailFeatureEnabled: false,
            participantLimitEnabled: true,
            participantLimit,
            isPublic: true,
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

                    <TabsContent value="questions">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-center text-xl">Quiz Questions & Stats</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-8">
                                {dummyStats?.map((questionStat, index) => (
                                    <div key={index} className="space-y-4">
                                        <h2 className="text-lg font-semibold">
                                            Q{index + 1}: {questionStat.question}
                                        </h2>

                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart
                                                layout="vertical"
                                                data={questionStat.options}
                                                margin={{ top: 10, right: 30, left: 100, bottom: 5 }}
                                            >
                                                <XAxis type="number" allowDecimals={false} />
                                                <YAxis
                                                    type="category"
                                                    dataKey="name"
                                                    width={200}
                                                    tick={{ fontSize: 14 }}
                                                />
                                                <Tooltip
                                                    formatter={(value: any) => [`${value} participants`, "Selected by"]}
                                                />
                                                <Bar
                                                    dataKey="count"
                                                    label={{ position: "right", fontSize: 12 }}
                                                    isAnimationActive={false}
                                                >
                                                    {questionStat.options.map((entry, i) => (
                                                        <Cell
                                                            key={`cell-${i}`}
                                                            fill={entry.isCorrect ? "#4ade80" : "#60a5fa"} // green if correct, blue otherwise
                                                        />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>

                                        <ul className="text-sm text-muted-foreground pl-2">
                                            {questionStat.options.map((opt, i) => (
                                                <li key={i}>
                                                    {opt.name} –{" "}
                                                    <span className={opt.isCorrect ? "text-green-600 font-semibold" : ""}>
                                                        {opt.isCorrect ? "Correct Answer" : "Wrong"}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </TabsContent>


                    <TabsContent value="participants">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-center text-xl">Participants</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {data?.participants.map((p, i) => (
                                    <div key={i} className="border-b pb-2">
                                        <p><strong>{p.name}</strong> ({p.email})</p>
                                        <p className="text-sm text-muted-foreground">{p.url}</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="leaderboard">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-center text-xl">Leaderboard</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {data?.attempts.map((a, i) => (
                                    <div key={i} className="border-b pb-2">
                                        <p><strong>User ID:</strong> {a.userId}</p>
                                        <p><strong>Score:</strong> {a.score}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Submitted At: {new Date(a.submittedAt).toLocaleString()}
                                        </p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="settings">
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
                                        decrement={() => updateCounter(setDurationLimitSeconds, durationLimitSeconds, -60, 60, 7200, "durationLimitSeconds")}
                                    />

                                    <FormSwitch label="Enable Email Feature" name="sendEmailFeatureEnabled" control={control} />
                                    <FormSwitch label="Enable Participant Limit" name="participantLimitEnabled" control={control} />

                                    <Counter
                                        label="Participant Limit"
                                        value={participantLimit}
                                        min={1}
                                        max={1000}
                                        step={10}
                                        increment={() => updateCounter(setParticipantLimit, participantLimit, 10, 1, 1000, "participantLimit")}
                                        decrement={() => updateCounter(setParticipantLimit, participantLimit, -10, 1, 1000, "participantLimit")}
                                    />

                                    <FormSwitch label="Public Event" name="isPublic" control={control} />
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
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
