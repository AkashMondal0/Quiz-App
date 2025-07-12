"use client";
import QuizCard from "@/components/card/QuizCard";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import { Quiz,Event } from "@/types/QuizTypes";
import {useRouter} from "next/navigation";

const quizzes: Quiz[] = [
    {
        id: "686e4c7fd746542b4c9935c8",
        eventId: "686d7888fd1025fad0d46f1a",
        title: "Java Basics Quiz",
        description: "Test your Java knowledge",
        durationLimitSeconds: 900,
        questions: new Array(10).fill({}).map((_, i) => ({ text: `Question ${i}` })), // 10 qs
        createdAt: "2025-07-09T11:03:27.790Z",
        endedAt: "2025-07-09T11:18:27.790Z",
        startedAt: "2025-07-09T11:03:27.790Z",
        attemptCount: 0,
        isDurationEnabled: true,
        sendEmailFeatureEnabled: true,
        isPublic: true,
        allowUsers: [
            {
                username: "jane_doe",
                email: "",
                image: "https://example.com/avatar2.jpg",
                name: "Jane Doe"
            },
            {
                username: "alice_smith",
                email: "",
                image: "https://example.com/avatar3.jpg",
                name: "Alice Smith"
            }
        ],
        participants: [
            {
                username: "john_doe",
                email: "",
                image: "https://example.com/avatar.jpg",
                name: "John Doe"
            }
        ],
        participantsCount: 0,
        participantLimitEnabled: true,
        attempts: [],
        participantLimit: 100,
        user: {
            username: "john_doe",
            email: "",
            image: "https://example.com/avatar.jpg",
            name: "John Doe"
        }
    },
]

const event:Event = {
    id: "686d7888fd1025fad0d46f1a",
    tag: "java-basics",
    organizationId: "686d7888fd1025fad0d46f1a",
    title: "Code Academy",
    description: "A beginner-friendly event to learn Java programming.",
    startDate: "2025-07-09T11:00:00.000Z",
    endDate: "2025-07-09T12:00:00.000Z",
    createdAt: "2025-07-01T11:03:27.790Z",
    updatedAt: "2025-07-01T11:03:27.790Z",
    user: {
        username: "john_doe",
        email: "",
        image: "https://example.com/avatar.jpg",
        name: "John Doe"
    },
}

export default function Page() {
    const router = useRouter();

    return (
        <>
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                        <div className="flex flex-col gap-8 px-4 lg:px-6">
                            <div className="flex flex-col gap-2 px-2">
                                <h1 className="text-2xl font-semibold">{event.title} - Quizzes</h1>
                                <p className="text-muted-foreground">
                                    Create and manage quizzes for your event.
                                </p>
                            </div>
                            <div className="px-2 flex flex-wrap sm:flex-nowrap items-center gap-3">
                                <Button className="cursor-pointer w-auto shrink-0 sm:w-fit" onClick={()=>{
                                    router.push(`/events/${event.id}/quiz/create`);
                                }}>
                                    Create Quiz
                                </Button>
                                <Input placeholder="Search quiz" className="w-full sm:w-56 md:w-64 lg:w-80"/>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {quizzes.map((quiz) => (
                                    <QuizCard key={quiz.id} quiz={quiz} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}