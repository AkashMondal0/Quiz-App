"use client"

import React, { memo, useCallback } from "react"
import Link from "next/link"
import {
    HelpCircleIcon,
    TimerIcon,
    CalendarIcon,
    PlayCircleIcon,
    StopCircleIcon,
    Share2Icon,
    InfoIcon,
} from "lucide-react"
import { Quiz } from "@/types/QuizTypes"
import { toast } from "sonner"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils";

const formatDate = (d?: string) =>
    d
        ? new Date(d).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        })
        : "N/A"

/* ---------- REUSABLE BADGE ------------- */
const MetaBadge = ({
    icon: Icon,
    label,
}: {
    icon: React.ElementType
    label: string
}) => (
    <Badge
        variant="secondary"
        className="flex items-center gap-1 whitespace-nowrap group-hover:bg-primary/10"
    >
        <Icon size={14} />
        {label}
    </Badge>
)

/* ---------- MAIN CARD ------------------ */
function QuizCardBase({ quiz }: { quiz: Quiz }) {
    const quizUrl = `/qz/${quiz.id}`
    const detailsUrl = `/quiz/${quiz.id}/details`

    const handleShare = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(`${window.location.origin}${quizUrl}`)
            toast.success("Quiz link copied!")
        } catch {
            toast.error("Couldn’t copy link.")
        }
    }, [quizUrl])

    return (
        <Card className="@container/card group relative flex flex-col justify-between overflow-hidden transition-shadow hover:shadow-xl">
            {/* share */}
            <button
                onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleShare()
                }}
                title="Copy link"
                className="absolute cursor-pointer right-3 top-3 z-20 rounded-full bg-muted p-1.5 text-muted-foreground transition hover:text-primary"
            >
                <Share2Icon size={16} />
            </button>

            {/* header */}
            <CardHeader className="space-y-1.5">
                <h3 className="line-clamp-1 text-lg font-semibold tracking-tight transition-colors group-hover:text-primary">
                    {quiz.title}
                </h3>
                <p className="line-clamp-2 text-sm text-muted-foreground">{quiz.description}</p>
            </CardHeader>

            {/* meta */}
            <CardContent className="space-y-3 text-sm">
                {/* Quiz Info Row */}
                <div className="flex flex-wrap items-center gap-2">
                    <MetaBadge icon={HelpCircleIcon} label={`${quiz.questions?.length} Questions`} />
                    <MetaBadge icon={TimerIcon} label={`${Math.round(quiz?.durationLimitSeconds ? quiz.durationLimitSeconds / 60 : 0)} min`} />
                </div>

                {/* Event Dates Row */}
                {(quiz.startedAt || quiz.endedAt) && (
                    <div className="flex flex-wrap items-center gap-2">
                        {quiz.startedAt && (
                            <MetaBadge
                                icon={PlayCircleIcon}
                                label={`Starts: ${formatDate(quiz.startedAt)}`}
                            />
                        )}
                        {quiz.endedAt && (
                            <MetaBadge
                                icon={StopCircleIcon}
                                label={`Ends: ${formatDate(quiz.endedAt)}`}
                            />
                        )}
                    </div>
                )}

                {/* Created At */}
                <div className="flex items-center gap-1 text-muted-foreground">
                    <CalendarIcon size={14} />
                    Created: {formatDate(quiz.createdAt)}
                </div>
            </CardContent>


            {/* footer */}
            <CardFooter className="flex items-center justify-between gap-3 pt-0">
                <Button asChild size="sm" className="flex-1" title="Take quiz">
                    <Link href={quizUrl}>Take quiz</Link>
                </Button>

                <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    className={cn(
                        "hover:text-muted-foreground transition hover:bg-muted/90 bg-muted text-primary",
                        "w-9 h-9"
                    )}
                    title="Details"
                >
                    <Link href={detailsUrl}>
                        <InfoIcon size={16} />
                    </Link>
                </Button>
            </CardFooter>

            {/* hover accent */}
            <div
                aria-hidden
                className="pointer-events-none absolute -inset-px rounded-lg bg-gradient-to-r from-primary/15 to-transparent transition-opacity opacity-100"
            />
        </Card>
    )
}

/* export memoized to avoid needless re-renders */
export const QuizCard = memo(QuizCardBase)
export default QuizCard
