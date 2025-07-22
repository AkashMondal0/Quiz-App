"use client"

import React, { memo, use, useEffect, useRef, useState } from "react"
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
import { useAxios } from "@/hooks/useAxios"
import { Loader } from "lucide-react"

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
const QuizPage = ({
    quizData,
}: { quizData: QuizData }) => {

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

export default function Page({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = use(params);

    const { data, loading, error } = useAxios<QuizData>({
        url: `/quiz/${id}`,
        method: 'GET',
    });

    console.log("Quiz data:", data, "Loading:", loading, "Error:", error);

    return <>
        <>{loading}</>
        {
            data ? <QuizPage quizData={data} /> : (
                <div className="flex items-center justify-center h-full">
                    <Loader className="animate-spin h-6 w-6" />
                    <span className="ml-2">Loading quiz...</span>
                </div>
            )
        }
    </>
}