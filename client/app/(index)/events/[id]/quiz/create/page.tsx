"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2Icon, PlusIcon } from "lucide-react"
import { Quiz, Question } from "@/types/QuizTypes"
import { exampleQuiz } from "./data"
import EditableQuestionCard from "@/components/card/EditableQuestionCard"

function QuizList() {
    const [quiz, setQuiz] = useState<Quiz | null>(exampleQuiz)
    const [editingIndex, setEditingIndex] = useState<number | null>(null)

    const updateQuestion = (index: number, updatedQuestion: Question) => {
        if (!quiz) return
        const updatedQuestions = [...quiz.questions]
        updatedQuestions[index] = updatedQuestion
        setQuiz({ ...quiz, questions: updatedQuestions })
    }

    const deleteQuestion = (index: number) => {
        if (!quiz) return
        const updatedQuestions = [...quiz.questions]
        updatedQuestions.splice(index, 1)
        setQuiz({ ...quiz, questions: updatedQuestions })
    }

    const addQuestion = () => {
        if (!quiz) return
        const newQuestion: Question = {
            text: "New question?",
            options: ["Option 1", "Option 2"],
            correctIndex: 0,
        }
        setQuiz({
            ...quiz,
            questions: [...quiz.questions, newQuestion],
        })
        setEditingIndex(quiz.questions.length)
    }

    return (
        <div className="flex min-h-svh flex-col items-center p-6 md:p-10 gap-10">
            {quiz?.questions && (
                <div className="w-full max-w-3xl space-y-6">
                    {quiz.questions.map((question, idx) => (
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

                    <Button variant="secondary" onClick={addQuestion} className="w-full">
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Add New Question
                    </Button>
                </div>
            )}
        </div>
    )
}
