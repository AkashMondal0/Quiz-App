"use client"

import React, { useState } from "react"
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
import { Question } from "@/types/QuizTypes"
import api from "@/lib/axios"

import QuizList from "@/components/quiz/QuizList"
import Counter from "@/components/quiz/Counter"
import QuestionCardSkeleton from "@/components/quiz/QuestionCardSkeleton"

export default function CreateQuizPage() {
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
      eventId: "687d08f3f1fd8757fa974810",
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
            <QuizForm
              form={quizForm}
              questionsData={questionsData}
              loading={loading}
              numberOfQuestions={numberOfQuestions}
              updateNumberOfQuestions={updateNumberOfQuestions}
              onSubmit={generateQuizHandler}
            />
          </TabsContent>

          <TabsContent value="event" className="p-6">
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

function QuizForm({ form, questionsData, loading, numberOfQuestions, updateNumberOfQuestions, onSubmit }: any) {
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = form

  if (loading) {
    return <QuestionCardSkeleton size={numberOfQuestions} />
  }

  if (questionsData.length > 0) {
    return (
      <>
        <QuizList questionList={questionsData} />
        <Button className="my-4 w-full">Create Quiz</Button>
      </>
    )
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
          <Textarea {...register("topic")} placeholder="Enter topic or text..." rows={3} disabled={isSubmitting} />
          {errors.topic && <p className="text-sm text-red-500">{errors.topic.message}</p>}

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

function EventForm({ form, participantLimit, setParticipantLimit, durationLimitSeconds, setDurationLimitSeconds, onSubmit }: any) {
  const { register, control, handleSubmit, setValue, formState: { errors } } = form

  const updateCounter = (setter: Function, state: number, step: number, min: number, max: number, field: keyof EventFormSchema) => {
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input {...register("eventId")} disabled />

          <Input {...register("title")} placeholder="Event Title" />
          {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}

          <Textarea {...register("description")} rows={3} placeholder="Event Description" />
          {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}

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

          <Button type="submit" className="w-full">Save Settings</Button>
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
