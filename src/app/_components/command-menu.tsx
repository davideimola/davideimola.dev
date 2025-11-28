"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import {
  FileText,
  Github,
  Home,
  Linkedin,
  Mic,
  Monitor,
  Twitter,
  User,
  Mail,
  Newspaper,
  Search,
} from "lucide-react";
import { blogPosts } from "~/content/blog-posts";
import { projects } from "~/content/projects";
import { speakingEvents } from "~/content/speaking-events";

export function CommandMenu() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    const openMenu = () => setOpen(true);

    document.addEventListener("keydown", down);
    document.addEventListener("openCommandMenu", openMenu);
    return () => {
      document.removeEventListener("keydown", down);
      document.removeEventListener("openCommandMenu", openMenu);
    };
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  if (!open) return null;

  return (
    <div
      className="animate-in fade-in fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm transition-all duration-200"
      onClick={() => setOpen(false)}
    >
      <div
        className="animate-in zoom-in-95 w-full max-w-[640px] overflow-hidden rounded-xl border border-[#2A2725] bg-[#0D0D0D]/95 shadow-2xl duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <Command className="h-full w-full">
          <div className="flex items-center border-b border-[#2A2725] px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Command.Input
              placeholder="Type a command or search..."
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-[#726d68] disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <Command.List className="max-h-[300px] overflow-x-hidden overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-sm text-[#726d68]">
              No results found.
            </Command.Empty>

            <Command.Group
              heading="Pages"
              className="mb-2 px-2 text-xs font-medium text-[#726d68]"
            >
              <Command.Item
                onSelect={() => runCommand(() => router.push("/"))}
                className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-[#e6e4e0] transition-colors aria-selected:bg-[#2A2725] aria-selected:text-[#C91F37]"
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push("/about"))}
                className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-[#e6e4e0] transition-colors aria-selected:bg-[#2A2725] aria-selected:text-[#C91F37]"
              >
                <User className="h-4 w-4" />
                <span>About</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push("/blog"))}
                className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-[#e6e4e0] transition-colors aria-selected:bg-[#2A2725] aria-selected:text-[#C91F37]"
              >
                <FileText className="h-4 w-4" />
                <span>Blog</span>
              </Command.Item>
              <Command.Item
                onSelect={() =>
                  runCommand(() => router.push("/newsletter/archive"))
                }
                className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-[#e6e4e0] transition-colors aria-selected:bg-[#2A2725] aria-selected:text-[#C91F37]"
              >
                <Newspaper className="h-4 w-4" />
                <span>Newsletter</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push("/projects"))}
                className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-[#e6e4e0] transition-colors aria-selected:bg-[#2A2725] aria-selected:text-[#C91F37]"
              >
                <Monitor className="h-4 w-4" />
                <span>Projects</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push("/speaking"))}
                className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-[#e6e4e0] transition-colors aria-selected:bg-[#2A2725] aria-selected:text-[#C91F37]"
              >
                <Mic className="h-4 w-4" />
                <span>Speaking</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push("/contact"))}
                className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-[#e6e4e0] transition-colors aria-selected:bg-[#2A2725] aria-selected:text-[#C91F37]"
              >
                <Mail className="h-4 w-4" />
                <span>Contact</span>
              </Command.Item>
            </Command.Group>

            <Command.Group
              heading="Blog"
              className="mb-2 px-2 text-xs font-medium text-[#726d68]"
            >
              {blogPosts.map((post) => (
                <Command.Item
                  key={post.slug}
                  onSelect={() =>
                    runCommand(() => router.push(`/blog/${post.slug}`))
                  }
                  className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-[#e6e4e0] transition-colors aria-selected:bg-[#2A2725] aria-selected:text-[#C91F37]"
                >
                  <FileText className="h-4 w-4" />
                  <span>{post.title}</span>
                </Command.Item>
              ))}
            </Command.Group>

            <Command.Group
              heading="Projects"
              className="mb-2 px-2 text-xs font-medium text-[#726d68]"
            >
              {projects.map((project) => (
                <Command.Item
                  key={project.id}
                  onSelect={() => {
                    if (project.links.website) {
                      runCommand(() =>
                        window.open(project.links.website, "_blank"),
                      );
                    } else if (project.links.github) {
                      runCommand(() =>
                        window.open(project.links.github, "_blank"),
                      );
                    } else {
                      runCommand(() => router.push("/projects"));
                    }
                  }}
                  className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-[#e6e4e0] transition-colors aria-selected:bg-[#2A2725] aria-selected:text-[#C91F37]"
                >
                  <Monitor className="h-4 w-4" />
                  <span>{project.title}</span>
                </Command.Item>
              ))}
            </Command.Group>

            <Command.Group
              heading="Speaking"
              className="mb-2 px-2 text-xs font-medium text-[#726d68]"
            >
              {speakingEvents.slice(0, 5).map((event) => (
                <Command.Item
                  key={event.id}
                  onSelect={() => runCommand(() => router.push("/speaking"))}
                  className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-[#e6e4e0] transition-colors aria-selected:bg-[#2A2725] aria-selected:text-[#C91F37]"
                >
                  <Mic className="h-4 w-4" />
                  <span>
                    {event.talkTitle} @ {event.title}
                  </span>
                </Command.Item>
              ))}
            </Command.Group>

            <Command.Group
              heading="Social"
              className="mt-4 mb-2 px-2 text-xs font-medium text-[#726d68]"
            >
              <Command.Item
                onSelect={() =>
                  runCommand(() =>
                    window.open("https://github.com/davideimola", "_blank"),
                  )
                }
                className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-[#e6e4e0] transition-colors aria-selected:bg-[#2A2725] aria-selected:text-[#C91F37]"
              >
                <Github className="h-4 w-4" />
                <span>GitHub</span>
              </Command.Item>
              <Command.Item
                onSelect={() =>
                  runCommand(() =>
                    window.open(
                      "https://linkedin.com/in/davideimola",
                      "_blank",
                    ),
                  )
                }
                className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-[#e6e4e0] transition-colors aria-selected:bg-[#2A2725] aria-selected:text-[#C91F37]"
              >
                <Linkedin className="h-4 w-4" />
                <span>LinkedIn</span>
              </Command.Item>
              <Command.Item
                onSelect={() =>
                  runCommand(() =>
                    window.open("https://twitter.com/davideimola", "_blank"),
                  )
                }
                className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-[#e6e4e0] transition-colors aria-selected:bg-[#2A2725] aria-selected:text-[#C91F37]"
              >
                <Twitter className="h-4 w-4" />
                <span>Twitter / X</span>
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
