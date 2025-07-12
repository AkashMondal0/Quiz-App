"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { CalendarIcon } from 'lucide-react';
import {Organizations} from "@/types/QuizTypes";

const OrganizationCards = ({organizations}:{
    organizations:Organizations[]
}) => {
    const route = useRouter();

    const handleCardClick = (orgId: string) => {
        // Logic to navigate to organization details
        route.push(`/organizations/${orgId}`);
    };

    return (
        <>
            {/* Organization Cards */}
            <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
                {organizations.map((org) => (
                    <Card className="w-full max-w-sm shadow-md border rounded-2xl p-4 cursor-pointer duration-300"
                        key={org.id} onClick={() => {
                            handleCardClick(org.id);
                        }}>
                        <CardHeader className="space-y-1 px-0">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-xl font-bold">{org.name}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardFooter className="flex flex-col gap-3 text-sm text-muted-foreground items-start p-0">
                            <div className="flex items-center gap-2">
                                <CalendarIcon className="w-4 h-4" />
                                <span>{org.eventsCounts} Events</span>
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </>
    );
}

export default OrganizationCards;