"use client";

import { Skeleton } from "./skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      {/* Header skeleton */}
      <div className="sticky top-0 z-50 border-b border-[#2A2725] bg-[#0D0D0D]/95 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Skeleton className="h-8 w-32" />
            <div className="hidden space-x-8 md:flex">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-18" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>
      </div>

      {/* Hero section skeleton */}
      <section className="px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-8 text-center">
          <div className="mx-auto">
            <Skeleton className="h-32 w-32 rounded-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="mx-auto h-12 w-96" />
            <Skeleton className="mx-auto h-6 w-80" />
            <Skeleton className="mx-auto h-6 w-72" />
          </div>
          <div className="flex justify-center space-x-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </section>

      {/* Content sections skeleton */}
      <section className="bg-[#1A1816]/30 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <Skeleton className="mx-auto mb-4 h-8 w-48" />
            <Skeleton className="mx-auto h-4 w-96" />
          </div>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </section>

      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <Skeleton className="mx-auto mb-4 h-8 w-40" />
            <Skeleton className="mx-auto h-4 w-80" />
          </div>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <Skeleton className="h-80 w-full" />
            <Skeleton className="h-80 w-full" />
            <Skeleton className="h-80 w-full" />
          </div>
        </div>
      </section>
    </div>
  );
}
