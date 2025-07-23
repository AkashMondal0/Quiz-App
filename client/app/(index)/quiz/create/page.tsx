"use client"

import React, { useEffect, useState } from "react"
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
import {
    eventSchema,
    EventFormSchema,
    quizSchema,
    QuizFormSchema,
} from "@/types/schemas/quizSchema"
import { Minus, Plus } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { PlusIcon } from "lucide-react"
import { Quiz, Question } from "@/types/QuizTypes"
import EditableQuestionCard from "@/components/card/EditableQuestionCard"
import api from "@/lib/axios"


export default function CreateQuizPage() {
    const [questionsData, setQuestionsData] = useState<Question[]>([])
    const [loading, setLoading] = useState(false)

    const generateQuizHandler = async (data: QuizFormSchema) => {
        try {
            setLoading(true)
            const response = await api.post("/quiz/generate", {
                topic: data.topic,
                numberOfQuestions: data.numberOfQuestions,
                difficulty: data.difficulty,
            })
            if (!response.data || !Array.isArray(response.data)) {
                toast.error("Invalid quiz data received")
                return
            }
            setQuestionsData(response.data)
            toast.success("Quiz generated successfully!")
        } catch (error) {
            console.error("Error generating quiz:", error)
            toast.error("Failed to generate quiz")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold text-center mb-6">Create Quiz</h1>
            <div className="flex w-full max-w-2xl flex-col gap-6 mx-auto">
                <Tabs defaultValue="quiz">
                    <TabsList className="grid grid-cols-2 mx-auto">
                        <TabsTrigger value="quiz">Quiz</TabsTrigger>
                        <TabsTrigger value="event">Settings</TabsTrigger>
                    </TabsList>
                    <TabsContent value="quiz" className="p-6">
                        <div className="min-h-screen">
                            <QuizSettingsForm generateQuizHandler={generateQuizHandler} />
                            {loading && <p className="text-center text-gray-500">Generating quiz...</p>}
                            {!loading && questionsData.length === 0 && (
                                <p className="text-center text-gray-500">No questions generated yet.</p>
                            )}
                            <QuizList questionsData={questionsData} />
                        </div>
                    </TabsContent>
                    <TabsContent value="event" className="p-6">
                        <EventFormCard />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

function QuizSettingsForm({ generateQuizHandler }: {
    generateQuizHandler?: (data: QuizFormSchema) => void
}) {
    const [numberOfQuestions, setNumberOfQuestions] = useState(10)
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<QuizFormSchema>({
        resolver: zodResolver(quizSchema),
        defaultValues: {
            topic: "",
            numberOfQuestions: numberOfQuestions,
            difficulty: "easy",
        },
    })

    const onSubmit = (data: QuizFormSchema) => {
        if (generateQuizHandler) {
            generateQuizHandler(data)
        } else {
            toast.error("No handler provided for quiz generation")
        }
    }

    return (
        <Card className="max-w-xl mx-auto my-8 w-full">
            <CardHeader>
                <CardTitle className="text-center text-xl">
                    AI Quiz Generator
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground text-center">
                    Enter a topic or paste some text to generate a quiz. The AI will create questions based on the provided information.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-1">
                        <label className="block text-sm font-medium">Topic</label>
                        <Textarea {...register("topic")} placeholder="Enter a topic or paste text here" rows={3} />
                        {errors.topic && <p className="text-sm text-red-500">{errors.topic.message}</p>}
                    </div>

                    <div className="space-y-1">
                        <Counter
                            label="Number of Questions"
                            min={1}
                            max={50}
                            step={1}
                            decrement={() => {
                                if (numberOfQuestions <= 5) {
                                    toast.error("Minimum 5 questions required")
                                    return
                                }
                                setNumberOfQuestions((prev) => Math.max(prev - 1, 1))
                                setValue("numberOfQuestions", numberOfQuestions - 1)
                            }}
                            increment={() => {
                                if (numberOfQuestions >= 50) {
                                    toast.error("Maximum 50 questions allowed")
                                    return
                                }
                                setNumberOfQuestions((prev) => Math.min(prev + 1, 50))
                                setValue("numberOfQuestions", numberOfQuestions + 1)
                            }}
                            value={numberOfQuestions} />
                        {errors.numberOfQuestions && (
                            <p className="text-sm text-red-500">
                                {errors.numberOfQuestions.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium">Difficulty</label>
                        <Select
                            defaultValue="easy"
                            onValueChange={(value) =>
                                setValue("difficulty", value as QuizFormSchema["difficulty"])
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="easy">Easy</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="hard">Hard</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.difficulty && (
                            <p className="text-sm text-red-500">{errors.difficulty.message}</p>
                        )}
                    </div>

                    <Button type="submit" disabled={isSubmitting} className="w-full">
                        Generate Quiz
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}

function EventFormCard() {
    const [participantLimit, setParticipantLimit] = useState(100)
    const [durationLimitSeconds, setDurationLimitSeconds] = useState(900)

    const {
        register,
        control,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors },
    } = useForm<EventFormSchema>({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            eventId: "687d08f3f1fd8757fa974810",
            title: "Java Basics Quiz",
            description: "A quiz on Java fundamentals",
            isDurationEnabled: true,
            durationLimitSeconds: 900,
            sendEmailFeatureEnabled: false,
            participantLimitEnabled: true,
            participantLimit: 100,
            isPublic: true,
            creatorId: "6870c9034a0cd194698675bc",
        },
    })

    const onSubmit = (data: EventFormSchema) => {
        toast.success("Event settings saved!", {
            description: JSON.stringify({
                ...data,
                durationLimitSeconds: getValues("durationLimitSeconds"),
                participantLimit: getValues("participantLimit"),
            }),
        })
    }

    return (
        <Card className="max-w-xl mx-auto my-8 w-full">
            <CardHeader>
                <CardTitle className="text-center text-xl">Event Settings</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-1">
                        <label className="block text-sm font-medium">Event ID</label>
                        <Input
                            {...register("eventId")}
                            placeholder="Event ID"
                            disabled
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium">Event Title</label>
                        <Input {...register("title")} placeholder="Event Title" />
                        {errors.title && (
                            <p className="text-sm text-red-500">{errors.title.message}</p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium">Event Description</label>
                        <Textarea
                            {...register("description")}
                            placeholder="Event Description"
                            rows={3}
                        />
                        {errors.description && (
                            <p className="text-sm text-red-500">{errors.description.message}</p>
                        )}
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Enable Duration Limit</span>
                        <Controller
                            name="isDurationEnabled"
                            control={control}
                            render={({ field }) => (
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                            )}
                        />
                    </div>

                    <Counter
                        label="Duration (seconds)"
                        field="durationLimitSeconds"
                        min={60}
                        max={7200}
                        step={60}
                        decrement={() => {
                            setDurationLimitSeconds((prev) => Math.max(prev - 60, 60))
                            setValue("durationLimitSeconds", durationLimitSeconds - 60)
                        }}
                        increment={() => {
                            setDurationLimitSeconds((prev) => Math.min(prev + 60, 7200))
                            setValue("durationLimitSeconds", durationLimitSeconds + 60)
                        }}
                        value={durationLimitSeconds}
                    />

                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Enable Email Feature</span>
                        <Controller
                            name="sendEmailFeatureEnabled"
                            control={control}
                            render={({ field }) => (
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                            )}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Enable Participant Limit</span>
                        <Controller
                            name="participantLimitEnabled"
                            control={control}
                            render={({ field }) => (
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                            )}
                        />
                    </div>

                    <Counter
                        decrement={() => {
                            setParticipantLimit((prev) => Math.max(prev - 10, 1))
                            setValue("participantLimit", participantLimit - 10)
                        }}
                        increment={() => {
                            setParticipantLimit((prev) => Math.min(prev + 10, 1000))
                            setValue("participantLimit", participantLimit + 10)
                        }}
                        value={participantLimit}
                        label="Participant Limit"
                        field="participantLimit"
                        min={1}
                        max={1000}
                        step={10}
                    />

                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Public Event</span>
                        <Controller
                            name="isPublic"
                            control={control}
                            render={({ field }) => (
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                            )}
                        />
                    </div>

                    <Button type="submit" className="w-full">
                        Save Event
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}

const Counter = ({
    label,
    decrement,
    increment,
    value,
}: {
    label: string
    field?: keyof EventFormSchema
    min: number
    max: number
    step?: number
    decrement: () => void
    increment: () => void
    value: number
}) => {

    return (
        <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{label}</span>
            <div className="flex items-center gap-3 p-2">
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={decrement}
                    className="text-center rounded-full text-xl font-bold"
                >
                    <Minus className="rotate-180" />
                </Button>
                <span className="w-12 text-center text-lg font-bold">{value}</span>
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={increment}
                    className="text-center rounded-full text-xl font-bold"
                >
                    <Plus className="rotate-180" />
                </Button>
            </div>
        </div>

    )
}

const QuizList = ({ questionsData = [] }: { questionsData?: Question[] }) => {
    const [quiz, setQuiz] = useState<Quiz | null>(null)
    const [questions, setQuestions] = useState<Question[]>(questionsData)
    const [editingIndex, setEditingIndex] = useState<number | null>(null)

    const updateQuestion = (index: number, updatedQuestion: Question) => {
        if (!quiz) return
        const updatedQuestions = [...questions]
        updatedQuestions[index] = updatedQuestion
        setQuiz({ ...quiz, questions: updatedQuestions })
        setEditingIndex(null)
    }

    const deleteQuestion = (index: number) => {
        if (!quiz) return
        const updatedQuestions = questions.filter((_, idx) => idx !== index)
        setQuiz({ ...quiz, questions: updatedQuestions })
        setEditingIndex(null)
        toast.success("Question deleted successfully")
    }

    const addQuestion = () => {
        const newQuestion: Question = {
            text: "New question?",
            options: ["Option 1", "Option 2"],
            correctIndex: 0,
        }
        setQuestions([...questions, newQuestion])
        setEditingIndex(questions.length)
    }

    useEffect(() => {
        if (questionsData.length > 0) {
            setQuestions(questionsData)
        }
    }, [questionsData])

    return (
        <div className="max-w-xl mx-auto my-8">
            {questions.map((question, idx) => (
                <EditableQuestionCard
                    key={idx}
                    index={idx}
                    question={question}
                    editingIndex={editingIndex}
                    setEditingIndex={setEditingIndex}
                    onSave={(q) => updateQuestion(idx, q)}
                    onDelete={() => deleteQuestion(idx)}
                />
            ))}

            <Button variant="secondary" onClick={addQuestion}
                className="max-w-xl mx-auto w-full">
                <PlusIcon className="w-4 h-4 mr-2" />
                Add New Question
            </Button>
        </div>
    )
}