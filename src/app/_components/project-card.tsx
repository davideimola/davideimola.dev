"use client";

import Image from "next/image";
import Link from "next/link";
import { type Project } from "~/content/projects";

interface ProjectCardProps {
  readonly project: Project;
  readonly variant?: "featured" | "compact";
  readonly showHighlights?: boolean;
}

export function ProjectCard({
  project,
  variant = "compact",
  showHighlights = false,
}: ProjectCardProps) {
  const isFeatured = variant === "featured";

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 transition-all duration-300 hover:border-[#C91F37]/50 ${
        isFeatured ? "hover:shadow-lg hover:shadow-[#C91F37]/10" : ""
      }`}
    >
      {/* Featured badge */}
      {isFeatured && (
        <div className="absolute top-4 left-4 z-10">
          <span className="inline-flex items-center rounded-full bg-[#C91F37] px-3 py-1 text-xs font-medium text-white">
            Featured
          </span>
        </div>
      )}

      {/* Project Image with Fallback */}
      <div className="relative aspect-[16/9]">
        {project.featuredImage ? (
          <>
            <Image
              src={project.featuredImage}
              alt={project.featuredImageAlt ?? project.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                const fallback =
                  target.parentElement?.querySelector(".fallback-content");
                if (fallback) {
                  (fallback as HTMLElement).style.display = "flex";
                }
              }}
            />
            {/* Fallback content - hidden by default */}
            <div className="fallback-content absolute inset-0 hidden items-center justify-center bg-gradient-to-br from-[#C91F37]/5 to-gray-900">
              <div className="p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-[#C91F37]/10 ring-1 ring-[#C91F37]/20">
                  <svg
                    className="h-8 w-8 text-[#C91F37]"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-100 transition-colors group-hover:text-[#C91F37]">
                  {project.title}
                </h3>
              </div>
            </div>
          </>
        ) : (
          // Default fallback when no featured image
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#C91F37]/5 to-gray-900">
            <div className="p-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-[#C91F37]/10 ring-1 ring-[#C91F37]/20">
                <svg
                  className="h-8 w-8 text-[#C91F37]"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-100 transition-colors group-hover:text-[#C91F37]">
                {project.title}
              </h3>
            </div>
          </div>
        )}
      </div>

      <div className="p-6">
        {/* Category and Year */}
        <div className={`mb-3 flex items-center justify-between`}>
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
              isFeatured
                ? "bg-[#C91F37]/10 text-[#C91F37]"
                : "bg-gray-800 text-gray-400"
            }`}
          >
            {project.category}
          </span>
          <span
            className={`text-xs ${isFeatured ? "text-gray-500" : "text-gray-600"}`}
          >
            {project.year}
          </span>
        </div>

        {/* Title */}
        <h3
          className={`mb-3 font-semibold text-gray-100 transition-colors group-hover:text-[#C91F37] ${
            isFeatured ? "text-xl" : "line-clamp-2 text-lg"
          }`}
        >
          {project.title}
        </h3>

        {/* Description */}
        <p className="mb-4 line-clamp-3 text-sm text-gray-400">
          {project.description}
        </p>

        {/* Highlights - only for featured variant */}
        {isFeatured && showHighlights && project.highlights && (
          <ul className="mb-4 space-y-1">
            {project.highlights.map((highlight) => (
              <li
                key={highlight}
                className="flex items-start text-xs text-gray-500"
              >
                <span className="mr-2 text-[#C91F37]">•</span>
                {highlight}
              </li>
            ))}
          </ul>
        )}

        {/* Technologies */}
        <div className={`mb-4 flex flex-wrap gap-1`}>
          {project.technologies.slice(0, isFeatured ? 3 : 2).map((tech) => (
            <span
              key={tech}
              className="inline-block rounded bg-gray-800 px-2 py-1 text-xs text-gray-400"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > (isFeatured ? 3 : 2) && (
            <span className="text-xs text-gray-500">
              +{project.technologies.length - (isFeatured ? 3 : 2)} more
            </span>
          )}
        </div>

        {/* Links */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-3">
            {project.links.website && (
              <Link
                href={project.links.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-[#C91F37] transition-colors hover:text-[#D3381C]"
              >
                {isFeatured ? "Visit →" : "View →"}
              </Link>
            )}
            {project.links.github && (
              <Link
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors hover:text-gray-300"
              >
                <span className="sr-only">GitHub</span>
                <svg
                  className={`${isFeatured ? "h-5 w-5" : "h-4 w-4"}`}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            )}
          </div>

          {/* Status badge - only for featured variant */}
          {isFeatured && (
            <span
              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                project.status === "Active"
                  ? "bg-green-500/10 text-green-400 ring-1 ring-green-500/20"
                  : "bg-gray-800 text-gray-400"
              }`}
            >
              {project.status}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
