"use client"

// Quiz Settings & Participant Management Page
// -------------------------------------------
// Extends the previous settings screen with user management:
// • View & remove allowed users
// • Add users by username (stubbed search)
// -------------------------------------------

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2Icon, SaveIcon, TrashIcon, PlusIcon } from "lucide-react"
import Image from "next/image"

// ---------- Types & Schema ------------
export interface User {
    username: string
    email?: string
    image?: string
    name?: string
}
export interface QuizSettings {
    id: string
    eventId: string
    title: string
    description: string
    durationLimitSeconds: number
    isDurationEnabled: boolean
    participantLimitEnabled: boolean
    participantLimit: number
    sendEmailFeatureEnabled: boolean
    isPublic: boolean
    allowUsers: User[]
    participants: User[]
}

const schema = z.object({
    title: z.string().min(3, "Title too short"),
    description: z.string().optional(),
    isDurationEnabled: z.boolean(),
    durationLimitSeconds: z
        .number()
        .int()
        .min(30, "Minimum 30 seconds")
        .max(7200, "Max 2 hours"),
    participantLimitEnabled: z.boolean(),
    participantLimit: z.number().int().min(1).max(10000),
    sendEmailFeatureEnabled: z.boolean(),
    isPublic: z.boolean(),
})

type FormValues = z.infer<typeof schema>

// ---------- Demo Initial Data ----------
const demoData: QuizSettings = {
    id: "686e4c7fd746542b4c9935c8",
    eventId: "686d7888fd1025fad0d46f1a",
    title: "Java Basics Quiz",
    description: "Test your Java knowledge",
    durationLimitSeconds: 900,
    isDurationEnabled: true,
    participantLimitEnabled: true,
    participantLimit: 100,
    sendEmailFeatureEnabled: true,
    isPublic: true,
    allowUsers: [
        {
            username: "jane_doe",
            image: "https://example.com/avatar2.jpg",
            name: "Jane Doe",
        },
        {
            username: "alice_smith",
            image: "https://example.com/avatar3.jpg",
            name: "Alice Smith",
        },
    ],
    participants: [
        {
            username: "john_doe",
            image: "https://example.com/avatar.jpg",
            name: "John Doe",
        },
    ],
}

export default function QuizSettingsPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [allowed, setAllowed] = useState<User[]>(demoData.allowUsers)
    const [search, setSearch] = useState("")

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        mode: "onChange",
        defaultValues: {
            title: demoData.title,
            description: demoData.description,
            isDurationEnabled: demoData.isDurationEnabled,
            durationLimitSeconds: demoData.durationLimitSeconds,
            participantLimitEnabled: demoData.participantLimitEnabled,
            participantLimit: demoData.participantLimit,
            sendEmailFeatureEnabled: demoData.sendEmailFeatureEnabled,
            isPublic: demoData.isPublic,
        },
    })

    /* ---------------- Handlers ---------------- */
    const save = async (values: FormValues) => {
        try {
            setLoading(true)
            // TODO: PUT /api/quizzes/[id] with { ...values, allowUsers: allowed }
            await new Promise(res => setTimeout(res, 1000))
            toast.success("Quiz settings saved")
            router.refresh()
        } catch (e: any) {
            toast.error(e.message || "Failed to save")
        } finally {
            setLoading(false)
        }
    }

    const removeUser = (u: User) =>
        setAllowed(prev => prev.filter(x => x.username !== u.username))

    const addUser = () => {
        const uname = search.trim()
        if (!uname) return
        if (allowed.find(u => u.username === uname)) {
            toast.error("User already added")
            return
        }
        // In real app, validate username via API.
        setAllowed(prev => [...prev, { username: uname, name: uname }])
        setSearch("")
    }

    return (
        <div className="flex justify-center p-6 md:p-10">
            <Card className="w-full max-w-3xl">
                <CardHeader>
                    <CardTitle>Quiz Settings</CardTitle>
                </CardHeader>

                <form onSubmit={form.handleSubmit(save)}>
                    <CardContent className="space-y-6">
                        {/* Core settings */}
                        <div className="space-y-6">
                            {/* Title */}
                            <div className="space-y-1">
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" {...form.register("title")} />
                                {form.formState.errors.title && (
                                    <p className="text-sm text-red-500">
                                        {form.formState.errors.title.message}
                                    </p>
                                )}
                            </div>
                            {/* Description */}
                            <div className="space-y-1">
                                <Label htmlFor="desc">Description</Label>
                                <Textarea id="desc" {...form.register("description")} />
                            </div>
                            {/* Duration */}
                            <div className="flex items-center gap-4">
                                <Switch
                                    checked={form.watch("isDurationEnabled")}
                                    onCheckedChange={val => form.setValue("isDurationEnabled", val)}
                                />
                                <Label className="flex-1">Enable time limit</Label>
                                <Input
                                    type="number"
                                    disabled={!form.watch("isDurationEnabled")}
                                    className="w-32"
                                    {...form.register("durationLimitSeconds", { valueAsNumber: true })}
                                />
                                <span>seconds</span>
                            </div>
                            {/* Participant limit */}
                            <div className="flex items-center gap-4">
                                <Switch
                                    checked={form.watch("participantLimitEnabled")}
                                    onCheckedChange={val => form.setValue("participantLimitEnabled", val)}
                                />
                                <Label className="flex-1">Limit participants</Label>
                                <Input
                                    type="number"
                                    disabled={!form.watch("participantLimitEnabled")}
                                    className="w-32"
                                    {...form.register("participantLimit", { valueAsNumber: true })}
                                />
                                <span>people</span>
                            </div>
                            {/* Toggles */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-4">
                                    <Switch
                                        checked={form.watch("sendEmailFeatureEnabled")}
                                        onCheckedChange={val => form.setValue("sendEmailFeatureEnabled", val)}
                                    />
                                    <Label>Send results email</Label>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Switch
                                        checked={form.watch("isPublic")}
                                        onCheckedChange={val => form.setValue("isPublic", val)}
                                    />
                                    <Label>Publicly visible</Label>
                                </div>
                            </div>
                        </div>

                        {/* Allowed Users Management */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Allowed Users</h3>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Add username"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="flex-1"
                                />
                                <Button type="button" onClick={addUser} variant="secondary">
                                    <PlusIcon className="h-4 w-4" />
                                </Button>
                            </div>
                            {allowed.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No users added yet.</p>
                            ) : (
                                <ul className="space-y-2">
                                    {allowed.map(u => (
                                        <li key={u.username} className="flex items-center gap-3 rounded-md border p-2">
                                            {u.image && <Image src={u.image} alt={u.username} width={32} height={32} className="rounded-full" />}
                                            <span className="flex-1">{u.name || u.username}</span>
                                            <Button type="button" size="icon" variant="ghost" onClick={() => removeUser(u)}>
                                                <TrashIcon className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </CardContent>

                    <CardFooter>
                        <Button type="submit" disabled={loading || !form.formState.isDirty} className="ml-auto my-4">
                            {loading ? (
                                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <SaveIcon className="mr-2 h-4 w-4" />
                            )}
                            Save Changes
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
