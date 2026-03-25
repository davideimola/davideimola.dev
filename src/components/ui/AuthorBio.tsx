import Image from "next/image";

export function AuthorBio() {
  return (
    <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-start sm:items-center gap-5">
      <div className="relative w-14 h-14 rounded-sm overflow-hidden border border-border shrink-0">
        <Image
          src="/images/davide-speaking-profile.webp"
          alt="Davide Imola"
          fill
          className="object-cover grayscale"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-mono text-[13px] text-text-1 font-semibold mb-0.5">Davide Imola</p>
        <p className="font-mono text-[11px] text-text-3 mb-2">
          Tech Lead · Speaker · Open Source
        </p>
        <p className="font-sans text-[13px] text-text-2 leading-relaxed">
          Engineering leader at RedCarbon, co-founder of Schrodinger Hat. I write about Go,
          platform engineering, open source, and the human side of tech.
        </p>
        <div className="flex items-center gap-4 mt-3">
          <a
            href="https://bsky.app/profile/davideimola.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[11px] text-text-3 hover:text-accent transition-colors duration-150"
          >
            BlueSky
          </a>
          <a
            href="https://www.linkedin.com/in/davideimola/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[11px] text-text-3 hover:text-accent transition-colors duration-150"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/davideimola"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[11px] text-text-3 hover:text-accent transition-colors duration-150"
          >
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
