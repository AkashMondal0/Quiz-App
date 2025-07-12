"use client";
import OrganizationCards from "@/components/card/OrganizationCard";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Organizations} from "@/types/QuizTypes";

const organizations:Organizations[] = [
  {
    id: "686d6e12ba6a2d7fbc34dc6d",
    name: "Code Academy",
    eventsCounts: 12,
    createdAt: "2023-10-01T12:00:00Z",
    updatedAt: "2023-10-01T12:00:00Z",
    tag: "Education",
    user:{
        name: "Akash",
        email: "akash@gmail.com",
        image: "https://example.com/avatar.jpg",
        username: "akash123"
    },
  }
];


export default function Page() {
  return (
      <>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="flex flex-col gap-8 px-4 lg:px-6">
                <div className="flex flex-col gap-2 px-2">
                  <h1 className="text-2xl font-semibold">Organizations</h1>
                  <p className="text-muted-foreground">
                    Create and manage organizations for your events.
                  </p>
                </div>
                <div className="px-2 flex flex-wrap sm:flex-nowrap items-center gap-3">
                  <Button className="cursor-pointer w-auto shrink-0 sm:w-fit">
                    Create Organization
                  </Button>
                  <Input placeholder="Search organizations" className="w-full sm:w-56 md:w-64 lg:w-80"/>
                </div>
                <OrganizationCards organizations={organizations} />
              </div>
            </div>
          </div>
        </div>
      </>
  )
}