"use client";
import EventCard from "@/components/card/EventCard";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Event, Organizations} from "@/types/QuizTypes";
import {useRouter} from "next/navigation";

const organizationData:Organizations = {
    id: "686d6e12ba6a2d7fbc34dc6d",
    name: "Code Academy",
    tag: "Education",
    eventsCounts: 12,
    createdAt: "2023-10-01T12:00:00Z",
    updatedAt: "2023-10-01T12:00:00Z",
    user: {
        name: "Akash",
        email: "test@gmail>com",
        image: "https://example.com/avatar.jpg",
        username: "akash123"
    }
}

const events:Event[] = [{
    id: "686d6e12ba6a2d7fbc34dc6d",
    title: "Code Academy",
    tag: "Education",
    createdAt: "2023-10-01T12:00:00Z",
    description: "Learn coding with us",
    startDate: "2023-10-01T12:00:00Z",
    endDate: "2023-10-31T12:00:00Z",
    user: {
        name: "Akash",
        email: "test@gmail>com",
        image: "https://example.com/avatar.jpg",
        username: "akash123"
    },
    organizationId: "686d6e12ba6a2d7fbc34dc6d",
    updatedAt: "2023-10-01T12:00:00Z",
    quizCount: 5,
    quiz: []
}]

export default function Page() {
    const router = useRouter();

    return (
        <>
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                        <div className="flex flex-col gap-8 px-4 lg:px-6">
                            <div className="flex flex-col gap-2 px-2">
                                <h1 className="text-2xl font-semibold">
                                    {organizationData.name} - Events
                                </h1>
                                <p className="text-muted-foreground">
                                    {organizationData.eventsCounts} events created by {organizationData.user.name} on
                                    {/*{formatDate(data.createdAt, { dateStyle: "medium" })}.*/}
                                </p>
                            </div>
                            <div className="px-2 flex flex-wrap sm:flex-nowrap items-center gap-3">
                                <Button className="cursor-pointer w-auto shrink-0 sm:w-fit" onClick={()=>{
                                    router.push("/events/create");
                                }}>
                                    Create Event
                                </Button>
                                <Input placeholder="Search events" className="w-full sm:w-56 md:w-64 lg:w-80"/>
                            </div>
                            <EventCard events={events}/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}