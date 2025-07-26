"use client"

import React, { use } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"
import { Clock, User, BarChart } from "lucide-react"
import { useAxios } from "@/hooks/useAxios"
import clsx from "clsx"

interface AttemptData {
  id: string
  userId: string
  quizId: string
  selectedAnswers: number[]
  correctAnswers: number[]
  attemptedAt: string | any
  score: number
  user: {
    id: string
  }
}

export default function Page({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { data: attemptData, loading, error } = useAxios<AttemptData>({
    url: `/quiz/result/${id}`,
    method: "GET"
  })

  return (
    <div className="flex flex-col items-center p-6 md:p-10 min-h-screen bg-muted/50">
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}

      {attemptData && (
        <Card className="w-full max-w-3xl shadow-md">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <BarChart className="h-5 w-5 text-primary" />
              Quiz Result
            </CardTitle>
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <User className="h-4 w-4" />
              User ID: {attemptData.user.id}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex justify-between text-sm">
              <Badge variant="outline">Score: {attemptData.score}/{attemptData.correctAnswers.length}</Badge>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock size={16} />
                {format(new Date(attemptData.attemptedAt), "dd MMM yyyy HH:mm")}
              </div>
            </div>

            <Separator />

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Question</TableHead>
                  <TableHead>Your Answer</TableHead>
                  <TableHead>Correct Answer</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attemptData.selectedAnswers.map((answer, index) => {
                  const correct = attemptData.correctAnswers[index]
                  const isCorrect = answer === correct
                  return (
                    <TableRow key={index}>
                      <TableCell className="font-medium">Q{index + 1}</TableCell>
                      <TableCell className={clsx("font-semibold", isCorrect ? "text-green-600" : "text-red-500")}>
                        Option {answer + 1}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        Option {correct + 1}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
