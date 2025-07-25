"use client";
import QuizCard from "@/components/card/QuizCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAxios } from "@/hooks/useAxios";
import { Quiz, Event } from "@/types/QuizTypes";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { use } from 'react'

export default function Page({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = use(params);
    const router = useRouter();
    const { data: event } = useAxios<Event>({
        url: `/event/${id}`,
        method: 'GET',
    });
    const { data: quizzes } = useAxios<Quiz[]>({
        url: `/quiz/${id}/list`,
        method: 'GET',
    });

    if (!event) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader className="animate-spin h-6 w-6" />
                <span className="ml-2">Loading event...</span>
            </div>
        );
    }

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
                                <Button className="cursor-pointer w-auto shrink-0 sm:w-fit" onClick={() => {
                                    router.push(`/events/${event.id}/quiz/create`);
                                }}>
                                    Create Quiz
                                </Button>
                                <Input placeholder="Search quiz" className="w-full sm:w-56 md:w-64 lg:w-80" />
                            </div>
                            <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-0 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-0 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
                                {Array.isArray(quizzes) && quizzes.map((quiz) => (
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