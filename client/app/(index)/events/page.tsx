"use client";
import EventCard from "@/components/card/EventCard";
import EventCardSkeletonList from "@/components/skeleton/EventCardSkeletonList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAxios } from "@/hooks/useAxios";
import { Event } from "@/types/QuizTypes";
import { useRouter } from "next/navigation";

export default function Page() {
    const router = useRouter();
    const { data: events, loading, error } = useAxios<Event[]>({
        url: '/event/list',
        method: 'GET',
    });

    return (
        <>
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                        <div className="flex flex-col gap-8 px-4 lg:px-6">
                            <div className="flex flex-col gap-2 px-2">
                                <h1 className="text-2xl font-semibold">
                                    Events
                                </h1>
                                <p className="text-muted-foreground">
                                    {/* {organizationData.eventsCounts} events created by {organizationData.user.name} on */}
                                    {/*{formatDate(data.createdAt, { dateStyle: "medium" })}.*/}
                                </p>
                            </div>
                            <div className="px-2 flex flex-wrap sm:flex-nowrap items-center gap-3">
                                <Button className="cursor-pointer w-auto shrink-0 sm:w-fit" onClick={() => {
                                    router.push("/events/create");
                                }}>
                                    Create Event
                                </Button>
                                <Input placeholder="Search events" className="w-full sm:w-56 md:w-64 lg:w-80" />
                            </div>
                            {loading ? (
                                <EventCardSkeletonList count={20} />
                            ) : error ? (
                                <div className="text-red-500">
                                    Error loading events
                                </div>
                            ) : !events ? <EventCardSkeletonList count={20} /> :
                                <EventCard events={events} />}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}