"use client"

import React, { memo, useEffect, useRef, useState } from "react"
import {
    useForm,
    FormProvider,
    useFormContext,
    useController,
} from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"

/* ---------------- TYPES ----------------- */
export interface QuizData {
    eventId: string
    title: string
    description: string
    durationLimitSeconds: number
    questions: Question[]
}
interface Question {
    text: string
    options: string[]
    correctIndex: number
}

/* --------------- VALIDATION ------------- */
const buildSchema = (qCount: number) =>
    z.object({
        answers: z.array(z.number().int().gte(0)).length(qCount),
    })
type FormValues = z.infer<ReturnType<typeof buildSchema>>

/* ------------ TIMER (no extra re‑renders) ----------- */
const Timer: React.FC<{ secondsTotal: number; onExpire: () => void }> = ({
                                                                             secondsTotal,
                                                                             onExpire,
                                                                         }) => {
    const [secondsLeft, setSecondsLeft] = useState(secondsTotal)
    const idRef = useRef<number>(0)

    useEffect(() => {
        idRef.current = window.setInterval(() => {
            setSecondsLeft(s => {
                if (s <= 1) {
                    clearInterval(idRef.current)
                    onExpire()
                    return 0
                }
                return s - 1
            })
        }, 1000)

        return () => clearInterval(idRef.current)
    }, [onExpire])

    const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0")
    const ss = String(secondsLeft % 60).padStart(2, "0")

    return (
        <>
            <Progress value={(secondsLeft / secondsTotal) * 100} className="h-2" />
            <p className="text-xs text-right">
                {mm}:{ss}
            </p>
        </>
    )
}

/* --------- SINGLE QUESTION (isolated control) ----------- */
interface QuestionProps {
    q: Question
    qIdx: number
    showResults: boolean
}
const QuestionItem = memo(function Item({
                                            q,
                                            qIdx,
                                            showResults,
                                        }: QuestionProps) {
    const { control } = useFormContext<FormValues>()
    const {
        field: { value, onChange },
    } = useController({
        name: `answers.${qIdx}` as const,
        control,
        defaultValue: -1,
    })

    const answered = value as number

    return (
        <fieldset className="space-y-4">
            <legend className="font-medium">
                {qIdx + 1}. {q.text}
            </legend>

            <RadioGroup
                value={answered.toString()}
                onValueChange={val => onChange(Number(val))}
                className="grid gap-2"
            >
                {q.options.map((opt, optIdx) => (
                    <label
                        key={optIdx}
                        className="flex items-center gap-2 rounded-md border p-3 hover:bg-muted"
                    >
                        <RadioGroupItem value={optIdx.toString()} />
                        {opt}
                    </label>
                ))}
            </RadioGroup>

            {showResults && (
                <p
                    className={
                        answered === q.correctIndex ? "text-green-600" : "text-red-500"
                    }
                >
                    {answered === q.correctIndex
                        ? "Correct"
                        : `Wrong — correct answer: ${q.options[q.correctIndex]}`}
                </p>
            )}
        </fieldset>
    )
})

/* -------------- PAGE ------------------- */
export default function QuizPage({}: { quizData?: QuizData }) {
    const quizData = demoQuiz // fetch or prop‑inject in real app
    const [showResults, setShowResults] = useState(false)

    const methods = useForm<FormValues>({
        resolver: zodResolver(buildSchema(quizData.questions.length)),
        mode: "onChange",
        defaultValues: { answers: Array(quizData.questions.length).fill(-1) },
    })

    const grade = (data: FormValues) =>
        data.answers.reduce(
            (acc, ans, i) => acc + Number(ans === quizData.questions[i].correctIndex),
            0
        )

    const submit = (data: FormValues) => {
        toast.success(`You scored ${grade(data)}/${quizData.questions.length}`)
        setShowResults(true)
    }

    const autoSubmit = () => {
        if (!showResults && methods.formState.isValid) {
            submit(methods.getValues())
        }
    }

    return (
        <div className="flex min-h-svh flex-col items-center gap-8 p-6 md:p-10">
            <Card className="w-full max-w-2xl">
                <CardHeader className="space-y-2">
                    <CardTitle>{quizData.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        {quizData.description}
                    </p>

                    <Timer
                        secondsTotal={quizData.durationLimitSeconds}
                        onExpire={autoSubmit}
                    />
                </CardHeader>

                <CardContent>
                    <FormProvider {...methods}>
                        <form
                            onSubmit={methods.handleSubmit(submit)}
                            className="space-y-8 [&_label]:cursor-pointer"
                        >
                            {quizData.questions.map((q, idx) => (
                                <QuestionItem
                                    key={idx}
                                    q={q}
                                    qIdx={idx}
                                    showResults={showResults}
                                />
                            ))}

                            {!showResults && (
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={!methods.formState.isValid}
                                >
                                    Submit
                                </Button>
                            )}
                        </form>
                    </FormProvider>
                </CardContent>
            </Card>
        </div>
    )
}

/* ------------- DEMO DATA ------------- */
const demoQuiz: QuizData = {
    eventId: "686d7888fd1025fad0d46f1a",
    title: "Java Basics Quiz",
    description: "Test your Java knowledge",
    durationLimitSeconds: 900,
    questions: [
        {
            text: "Which keyword is used to implement inheritance in Java?",
            options: ["implement", "extends", "inherits", "uses"],
            correctIndex: 1,
        },
        {
            text: "What is the default value of an uninitialized int variable in Java?",
            options: ["0", "null", "undefined", "NaN"],
            correctIndex: 0,
        },
        {
            text: "Which method is the entry point of a Java application?",
            options: ["start()", "init()", "main()", "run()"],
            correctIndex: 2,
        },
        {
            text: "Which of the following is not a Java access modifier?",
            options: ["public", "private", "protected", "package"],
            correctIndex: 3,
        },
        {
            text: "Which keyword is used to prevent method overriding?",
            options: ["final", "static", "abstract", "const"],
            correctIndex: 0,
        },
        {
            text: "Which collection class allows duplicate elements?",
            options: ["Set", "Map", "List", "EnumSet"],
            correctIndex: 2,
        },
        {
            text: "What is the size of an int in Java?",
            options: ["16 bits", "32 bits", "64 bits", "8 bits"],
            correctIndex: 1,
        },
        {
            text: "Which exception is thrown when dividing by zero?",
            options: [
                "NullPointerException",
                "ArithmeticException",
                "NumberFormatException",
                "IllegalArgumentException",
            ],
            correctIndex: 1,
        },
        {
            text: "What does JVM stand for?",
            options: [
                "Java Variable Machine",
                "Java Virtual Machine",
                "Java Visual Model",
                "Joint Virtual Module",
            ],
            correctIndex: 1,
        },
        {
            text: "Which interface is used to sort a collection?",
            options: ["Serializable", "Comparator", "Cloneable", "Readable"],
            correctIndex: 1,
        },
    ],
}
