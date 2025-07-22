import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardFooter, CardHeader } from "@/components/ui/card"

export default function EventCardSkeletonList({ count = 4 }: {
    count?: number
}) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-2 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <Card
          className="w-full max-w-sm shadow-md border rounded-2xl cursor-pointer duration-300"
          key={index}
        >
          <CardHeader className="space-y-3">
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-3/5 rounded-md" />
              <Skeleton className="h-5 w-12 rounded-md" />
            </div>
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>

          <CardFooter className="flex flex-col gap-3 text-sm items-start pt-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-7 w-7 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>

            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-sm" />
              <Skeleton className="h-4 w-20" />
            </div>

            {/* Uncomment if needed for createdAt date */}
            {/* <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-sm" />
              <Skeleton className="h-4 w-24" />
            </div> */}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
