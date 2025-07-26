"use client"
import React, { useEffect, useRef, useState } from "react"
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
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

import { eventSchema, quizSchema, EventFormSchema, QuizFormSchema } from "@/types/schemas/quizSchema"
import { Question, Quiz } from "@/types/QuizTypes"
import api from "@/lib/axios"

import QuizList from "@/components/quiz/QuizList"
import Counter from "@/components/quiz/Counter"
import QuestionCardSkeleton from "@/components/quiz/QuestionCardSkeleton"
import { useDebounce } from "@/hooks/useDebounce"
import { useRouter } from "next/navigation"

function deepEqual(a: any, b: any) {
    return JSON.stringify(a) === JSON.stringify(b)
}

export default function GenerateQuizPage({ eventId = "EID" }: { eventId?: string }) {
    const router = useRouter()
    const [questionsData, setQuestionsData] = useState<Question[]>([])

    const [participantLimit, setParticipantLimit] = useState(100)
    const [durationLimitSeconds, setDurationLimitSeconds] = useState(900)
    const [loading, setLoading] = useState(false)
    const [numberOfQuestions, setNumberOfQuestions] = useState(10)

    const quizForm = useForm<QuizFormSchema>({
        resolver: zodResolver(quizSchema),
        defaultValues: {
            topic: "",
            numberOfQuestions,
            difficulty: "easy",
        },
    })

    const eventForm = useForm<EventFormSchema>({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            eventId: eventId,
            title: "My Quiz Event",
            description: "This is a description",
            isDurationEnabled: true,
            durationLimitSeconds,
            sendEmailFeatureEnabled: false,
            participantLimitEnabled: true,
            participantLimit,
            isPublic: true,
        },
    })

    const generateQuizHandler = async (data: QuizFormSchema) => {
        try {
            eventForm.setValue("title", data.topic)
            setLoading(true)
            const res = await api.post("/quiz/generate", data)
            if (!res.data || !Array.isArray(res.data)) throw new Error("Invalid response")
            setQuestionsData(res.data)
            toast.success("Quiz generated successfully!")
        } catch (err) {
            console.error("Error generating quiz:", err)
            toast.error("Failed to generate quiz")
        } finally {
            setLoading(false)
        }
    }

    const saveEventHandler = (data: EventFormSchema) => {
        toast.success("Event settings saved!", {
            description: JSON.stringify({
                ...data,
                participantLimit,
                durationLimitSeconds,
            }),
        })
    }

    const updateNumberOfQuestions = (val: number) => {
        if (val < 5 || val > 50) {
            toast.error("Questions must be between 5 and 50")
            return
        }
        setNumberOfQuestions(val)
        quizForm.setValue("numberOfQuestions", val)
    }

    const createQuiz = async () => {
        try {
            const data: Quiz = {
                eventId: eventForm.getValues("eventId"),
                title: eventForm.getValues("title"),
                description: eventForm.getValues("description"),
                participantLimit,
                durationLimitSeconds,
                isPublic: eventForm.getValues("isPublic"),
                isDurationEnabled: eventForm.getValues("isDurationEnabled"),
                sendEmailFeatureEnabled: eventForm.getValues("sendEmailFeatureEnabled"),
                participantLimitEnabled: eventForm.getValues("participantLimitEnabled"),
                questions: questionsData
            };
            const response = await api.post("/quiz", data)
            if (response.data) {
                toast.success("Quiz created successfully!")
                router.replace(`/quiz/${response.data.id}/details`)
            } else {
                toast.error("Failed to create quiz")
            }
        } catch (error) {
            toast.error("Failed to create quiz")
        }
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold text-center mb-6">Create Quiz</h1>
            <div className="flex w-full max-w-2xl flex-col gap-6 mx-auto">
                <Tabs defaultValue="quiz">
                    <TabsList className="grid grid-cols-2 mx-auto">
                        <TabsTrigger value="quiz" className="cursor-pointer" disabled={loading}>Quiz</TabsTrigger>
                        <TabsTrigger value="event" className="cursor-pointer" disabled={loading}>Settings</TabsTrigger>
                    </TabsList>

                    <TabsContent value="quiz">
                        <QuizForm
                            form={quizForm}
                            questionsData={questionsData}
                            loading={loading}
                            numberOfQuestions={numberOfQuestions}
                            updateNumberOfQuestions={updateNumberOfQuestions}
                            onSubmit={generateQuizHandler}
                            createQuiz={createQuiz}
                        />
                    </TabsContent>

                    <TabsContent value="event">
                        <EventForm
                            form={eventForm}
                            participantLimit={participantLimit}
                            setParticipantLimit={setParticipantLimit}
                            durationLimitSeconds={durationLimitSeconds}
                            setDurationLimitSeconds={setDurationLimitSeconds}
                            onSubmit={saveEventHandler}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

function QuizForm({ form, questionsData, loading, numberOfQuestions, updateNumberOfQuestions, onSubmit, createQuiz }: any) {
    const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = form

    if (loading) {
        return <QuestionCardSkeleton size={numberOfQuestions} />
    }

    if (questionsData.length > 0) {
        return (<QuizList questionList={questionsData} createQuiz={createQuiz} />)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-center text-xl">AI Quiz Generator</CardTitle>
                <CardDescription className="text-sm text-center text-muted-foreground">
                    Enter a topic or paste text. The AI will generate questions.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">Topic</label>
                        <Textarea {...register("topic")} placeholder="Enter topic or text..." rows={3} disabled={isSubmitting} />
                        {errors.topic && <p className="text-sm text-red-500">{errors.topic.message}</p>}
                    </div>

                    <Counter
                        label="Number of Questions"
                        value={numberOfQuestions}
                        min={5}
                        max={50}
                        step={1}
                        increment={() => updateNumberOfQuestions(numberOfQuestions + 1)}
                        decrement={() => updateNumberOfQuestions(numberOfQuestions - 1)}
                    />

                    <Select defaultValue="easy" onValueChange={(val) => setValue("difficulty", val)}>
                        <SelectTrigger><SelectValue placeholder="Select difficulty" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button type="submit" disabled={isSubmitting} className="w-full">
                        Generate Quiz
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}

function EventForm({
    form,
    participantLimit,
    setParticipantLimit,
    durationLimitSeconds,
    setDurationLimitSeconds,
    onSubmit,
}: any) {
    const {
        register,
        control,
        watch,
        setValue,
        formState: { errors },
    } = form

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
            onSubmit(formSnapshot)
        }
    }, [formSnapshot, onSubmit])

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

    return (
        <Card className="w-full">
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
                        increment={() =>
                            updateCounter(setDurationLimitSeconds, durationLimitSeconds, 60, 60, 7200, "durationLimitSeconds")
                        }
                        decrement={() =>
                            updateCounter(setDurationLimitSeconds, durationLimitSeconds, -60, 60, 7200, "durationLimitSeconds")
                        }
                    />

                    <FormSwitch label="Enable Email Feature" name="sendEmailFeatureEnabled" control={control} />
                    <FormSwitch label="Enable Participant Limit" name="participantLimitEnabled" control={control} />

                    <Counter
                        label="Participant Limit"
                        value={participantLimit}
                        min={1}
                        max={1000}
                        step={10}
                        increment={() =>
                            updateCounter(setParticipantLimit, participantLimit, 10, 1, 1000, "participantLimit")
                        }
                        decrement={() =>
                            updateCounter(setParticipantLimit, participantLimit, -10, 1, 1000, "participantLimit")
                        }
                    />

                    <FormSwitch label="Public Event" name="isPublic" control={control} />
                </form>
            </CardContent>
        </Card>
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