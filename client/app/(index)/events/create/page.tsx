"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { type DateRange } from "react-day-picker";
import { Combobox } from "@/components/ui/combobox";
import { type Event } from "@/types/QuizTypes";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
const tagOptions = ["SPRING_HACK 2", "WINTER_CODEFEST", "SUMMER_BOOTCAMP"];

const CreateEventPage = () => {
  const router = useRouter();
  const [tag, setTag] = useState("SPRING_HACK 2");
  const [organizationId, setOrganizationId] = useState("ORG001");
  const [title, setTitle] = useState("Spring Boot Hackathon");
  const [description, setDescription] = useState("24‑hour coding sprint");
  const [sendEmail, setSendEmail] = useState(true);
  const [users, setUsers] = useState<string[]>([]);
  const [newUser, setNewUser] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // default to next day
  });

  const handleAddUser = () => {
    if (newUser && !users.includes(newUser)) {
      setUsers([...users, newUser]);
      setNewUser("");
    }
  };

  const handleRemoveUser = (user: string) => {
    setUsers(users.filter((u) => u !== user));
  };

  const handleSubmit = async () => {
    try {
      const eventData: Event = {
        tag,
        organizationId,
        title,
        description,
        startDate: dateRange?.from?.toISOString(),
        endDate: dateRange?.to?.toISOString(),
        sendEmailFeatureEnabled: sendEmail,
        isPublic: isPublic,
      };
      const res = await api.post("/event", eventData);
      router.replace(`/events/${res.data.id}`);
    } catch (error) {
      console.error("Failed to create event:", error);
    }
  };

  return (
    <main className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Card className="border border-muted shadow-sm rounded-2xl">
          <CardContent className="p-6 md:p-10 space-y-10">
            <div className="space-y-2">
              <h1 className="text-4xl font-extrabold leading-tight">Create a New Event</h1>
              <p className="text-muted-foreground text-base">Fill in the details below to create a new event.</p>
            </div>

            <Separator />

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
              <div className="space-y-6">

                <Label htmlFor="organization">Organization</Label>
                <Combobox
                  options={[
                    "ORG001 - Tech Innovators",
                    "ORG002 - Code Masters",
                    "ORG003 - Dev Wizards",
                    "ORG004 - Creative Coders",
                    "ORG005 - Future Builders",
                    "ORG006 - Digital Pioneers",
                    "ORG007 - Code Crafters",
                  ]}
                  value={organizationId}
                  onChange={setOrganizationId}
                  placeholder="Select a Organization"
                />

                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Spring Hackathon"
                />

                <Label htmlFor="description" className="mt-4">Description</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="A 24-hour coding sprint"
                />

                <Label htmlFor="tag">Tag</Label>
                <Combobox
                  options={tagOptions}
                  value={tag}
                  onChange={setTag}
                  placeholder="Select a tag"
                />

                <div className="flex flex-wrap items-center gap-4 my-6">
                  <Switch id="send-email" checked={sendEmail} onCheckedChange={setSendEmail} />
                  <Label htmlFor="send-email">Enable Email Notifications</Label>
                </div>

                <div className="flex flex-wrap items-center gap-4 my-6">
                  <Switch id="is-public" checked={isPublic} onCheckedChange={setIsPublic} />
                  <Label htmlFor="is-public">Make Event Public</Label>
                </div>

              </div>

              <div className="space-y-4">
                <Label>Event Date Range</Label>
                <div className="rounded-lg border shadow-sm w-full max-w-md mx-auto xl:mx-0">
                  <Calendar
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Allowed Users</Label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    value={newUser}
                    onChange={(e) => setNewUser(e.target.value)}
                    placeholder="user@example.com"
                    className="flex-1"
                  />
                  <Button type="button" onClick={handleAddUser}>Add User</Button>
                </div>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {users.map((user) => (
                  <li
                    key={user}
                    className="flex justify-between items-center bg-muted px-4 py-3 rounded-lg shadow-sm"
                  >
                    <span className="text-sm font-medium break-words w-4/5">{user}</span>
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveUser(user)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6 flex justify-end">
              <Button className="px-6 py-3 text-base font-semibold" onClick={handleSubmit}>
                Create Event
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default CreateEventPage;
