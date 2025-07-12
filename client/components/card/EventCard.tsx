"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CalendarIcon } from 'lucide-react';
import { Event } from '@/types/QuizTypes';
const EventCard = ({events}:{
    events:Event[]
}) => {
    const route = useRouter();

    const handleCardClick = (eventId: string) => {
        // Logic to navigate to organization details
        route.push(`/events/${eventId}`);
    };

    return (
        <>
            {/* Organization Cards */}
            <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-2 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
                {events.map((event) => (
                    <Card className="w-full max-w-sm shadow-md border rounded-2xl cursor-pointer duration-300"
                          key={event.id} onClick={() => {
                            handleCardClick(event.id);
                        }}>
                        <CardHeader className="space-y-1">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-xl font-bold">{event.title}</CardTitle>
                                <Badge variant="secondary">{event.tag}</Badge>
                            </div>
                            <CardDescription className="text-muted-foreground">
                                ID: <span className="text-xs">{event.id}</span>
                            </CardDescription>
                        </CardHeader>

                        <CardFooter className="flex flex-col gap-3 text-sm text-muted-foreground items-start pt-2">
                            <div className="flex items-center gap-2">
                                <Avatar className="h-7 w-7">
                                    <AvatarFallback>{event.user.username.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="text-foreground font-medium">{event.user.name}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <CalendarIcon className="w-4 h-4" />
                                <span>{event.quizCount} Events</span>
                            </div>

                            {/* <div className="flex items-center gap-2">
                                <CalendarIcon className="w-4 h-4" />
                                <span>{new Date(org.createdAt).toLocaleDateString()}</span>
                            </div> */}
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </>
    );
}

export default EventCard;