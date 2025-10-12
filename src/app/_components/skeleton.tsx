"use client";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={`animate-pulse rounded-md bg-gray-800 ${className}`} />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
      <div className="space-y-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-32 w-full" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
    </div>
  );
}

export function BlogCardSkeleton() {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
      <Skeleton className="aspect-[16/9] w-full" />
      <div className="space-y-4 p-6">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-1" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-6 w-3/4" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
    </article>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto">
        <Skeleton className="h-32 w-32 rounded-full" />
      </div>
      <div className="space-y-3">
        <Skeleton className="mx-auto h-8 w-64" />
        <Skeleton className="mx-auto h-4 w-96" />
        <Skeleton className="mx-auto h-4 w-80" />
      </div>
      <div className="flex justify-center space-x-4">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
}
