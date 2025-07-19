export interface User {
    username: string
    email: string
    image: string
    name: string
    roles: string[]
}

export type loadingType = "normal" | "pending" | "error" | "idle";

export interface Event {
    id: string
    tag: string
    organizationId: string
    title: string
    description: string
    startDate: string
    endDate: string
    createdAt: string
    updatedAt: string
    user: User
    quizCount?: number
    quiz?: Quiz[]
    sendEmailFeatureEnabled?: boolean
    adminUsers?: User[]
    allowUsers?:User[]
    isPublic?: boolean
    participants?: User[]
    participantsCount?: number
}

export interface Quiz {
    id: string
    eventId: string
    title: string
    createdAt: string
    description: string
    questions: Question[]
    user: User
    // settings
    isDurationEnabled: boolean
    durationLimitSeconds: number
    endedAt: string
    startedAt?: string
    sendEmailFeatureEnabled?: boolean
    participantLimitEnabled: boolean
    participantLimit?: number
    isPublic?: boolean
    // who attempted the quiz
    allowUsers?: User[]
    // all users who can attempt the quiz
    participants?: User[]
    participantsCount?: number
    // all users who attempted the quiz
    attempts?: Attempt[]
    attemptCount: number
}

export interface Question {
    text: string
    options?: string[]
    correctIndex?: number | null | -1
}

export interface Attempt {
    id: string
    quizId: string
    userId: string
    user: User
    answers: Answer[]
    score: number
    createdAt: string
    updatedAt: string
}

export interface Answer {
    questionId: string
    selectedOptionIndex?: number
    text?: string // for open-ended questions
}