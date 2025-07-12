"use client"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2Icon } from "lucide-react"
import { toast } from "sonner"
import {Quiz} from "@/types/QuizTypes";

export default function AiQuizPage() {
    const [topic, setTopic] = useState("")
    const [context, setContext] = useState("")
    const [loading, setLoading] = useState(false)
    const [quiz, setQuiz] = useState<Quiz | null>(null)

    const generateQuiz = async () => {
        if (!topic.trim() && !context.trim()) {
            toast.error("Enter a topic or paste some text first");
            return;
        }
        try {
            setLoading(true)
            setQuiz(null)
            const res = await fetch("/api/generate-quiz", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topic, context }),
            })
            if (!res.ok) throw new Error(await res.text())
            const data: Quiz = await res.json()
            setQuiz(data)
        } catch (err: any) {
            toast.error(err.message || "Failed to generate quiz")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-svh flex-col items-center p-6 md:p-10 gap-10">
            <Card className="w-full max-w-3xl bg-background border-0">
                <CardHeader className="space-y-3">
                    <CardTitle>AI Quiz Generator</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Enter a topic or paste some text to generate a quiz. The AI will create questions based on the provided information.
                    </p>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Textarea
                        placeholder="Enter a topic or paste text here..."
                        value={context}
                        onChange={e => setContext(e.target.value)}
                        className="min-h-[80px]"
                    />
                    <Button onClick={generateQuiz} disabled={loading} className="w-full">
                        {loading && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
                        Generate Quiz
                    </Button>
                </CardContent>
            </Card>

            {/*{quiz && <QuizCore quizData={quiz} />}*/}
        </div>
    )
}

