"use client";

import { useEffect } from "react";
import { Check, Copy } from "lucide-react";

export function CodeBlockToolbar() {
  useEffect(() => {
    const enhanceCodeBlocks = () => {
      const codeBlocks = document.querySelectorAll(
        ".blog-content pre[class*='language-']",
      );

      codeBlocks.forEach((pre) => {
        // Skip if already enhanced
        if (pre.querySelector(".code-block-header")) return;

        // Get language from class
        const languageClass = Array.from(pre.classList).find((cls) =>
          cls.startsWith("language-"),
        );
        const language = languageClass
          ? languageClass.replace("language-", "").toUpperCase()
          : "CODE";

        // Create header container
        const header = document.createElement("div");
        header.className =
          "code-block-header absolute top-0 left-0 right-0 flex items-center justify-between px-3 py-2 z-10 sm:px-4";

        // Create language badge
        const languageBadge = document.createElement("span");
        languageBadge.className =
          "text-[10px] sm:text-xs font-mono font-semibold text-[#726d68] uppercase tracking-wider";
        languageBadge.textContent = language;

        // Create copy button
        const copyButton = document.createElement("button");
        copyButton.className =
          "copy-button flex items-center justify-center h-7 w-7 sm:h-6 sm:w-6 rounded bg-[#2A2725]/60 text-[#a39e98] opacity-0 transition-all hover:bg-[#3e3b38] hover:text-gray-100 group-hover:opacity-100 backdrop-blur-sm touch-manipulation";
        copyButton.setAttribute("aria-label", "Copy code");
        copyButton.setAttribute("type", "button");
        copyButton.innerHTML = `
          <svg class="copy-icon h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
          </svg>
          <svg class="check-icon hidden h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path>
          </svg>
        `;

        // Add click handler for copy
        copyButton.addEventListener("click", async () => {
          const codeElement = pre.querySelector("code");
          const code = codeElement?.textContent ?? "";

          try {
            await navigator.clipboard.writeText(code);

            // Show check icon
            const copyIcon = copyButton.querySelector(".copy-icon");
            const checkIcon = copyButton.querySelector(".check-icon");

            if (copyIcon && checkIcon) {
              copyIcon.classList.add("hidden");
              checkIcon.classList.remove("hidden");
              copyButton.classList.add("text-green-400");

              // Reset after 2 seconds
              setTimeout(() => {
                copyIcon.classList.remove("hidden");
                checkIcon.classList.add("hidden");
                copyButton.classList.remove("text-green-400");
              }, 2000);
            }
          } catch (err) {
            console.error("Failed to copy code:", err);
          }
        });

        // Assemble header
        header.appendChild(languageBadge);
        header.appendChild(copyButton);

        // Add group class to pre for hover effect
        pre.classList.add("relative", "group");

        // Insert header
        pre.appendChild(header);
      });
    };

    // Initial delay to ensure content is loaded
    const timeoutId = setTimeout(() => {
      enhanceCodeBlocks();
    }, 300);

    // Also observe for dynamic content changes
    const observer = new MutationObserver(() => {
      enhanceCodeBlocks();
    });

    const blogContent = document.querySelector(".blog-content");
    if (blogContent) {
      observer.observe(blogContent, {
        childList: true,
        subtree: true,
      });
    }

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

  return null;
}
