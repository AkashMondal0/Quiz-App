"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import "./shine.css" // Make sure to create this CSS file

export default function QuestionCardSkeleton({ size = 6 }: { size?: number }) {
    return (
        <div className="min-h-screen bg-background px-4 py-12">
            <QuizGenerationLoader className="mb-10" />

            <div className="flex flex-col items-center">
                {[...Array(size)].map((_, idx) => (
                    <motion.div
                        key={idx}
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: (i: number) => ({
                                opacity: 1,
                                y: 0,
                                transition: {
                                    delay: i * 0.15,
                                    duration: 0.5,
                                    ease: "easeOut"
                                }
                            })
                        }}
                        initial="hidden"
                        animate="visible"
                        custom={idx}
                        className="w-full max-w-xl"
                    >
                        <Card className="my-6 w-full">
                            <CardContent className="space-y-4 py-6">
                                <div className="flex items-center space-x-4">
                                    <Skeleton className="h-6 w-1/3" />
                                </div>
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-8 w-1/2" />
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

export function QuizGenerationLoader({ className }: { className?: string }) {
    return (
        <div className={cn("flex flex-col items-center justify-center py-6", className)}>
            <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="flex items-center gap-2"
            >
                <Sparkles className="h-6 w-6 text-stone-400 animate-pulse" />
                <p className="text-lg font-semibold tracking-wide relative overflow-hidden text-transparent bg-clip-text bg-gradient-to-r from-stone-400 via-white to-stone-400 animate-shine">
                    Generating Your Quiz...
                </p>
            </motion.div>

            <motion.div
                className="flex gap-1 mt-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                {[...Array(3)].map((_, i) => (
                    <motion.span
                        key={i}
                        className="h-2.5 w-2.5 rounded-full bg-stone-400"
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            delay: i * 0.2,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </motion.div>
        </div>
    )
}
