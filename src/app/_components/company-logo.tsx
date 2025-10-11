import { useState } from "react";

interface CompanyLogoProps {
  company: string;
  logo?: string;
  size?: "sm" | "md" | "lg";
}

export function CompanyLogo({ company, logo, size = "md" }: CompanyLogoProps) {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: "h-10 w-10 text-sm",
    md: "h-12 w-12 text-base",
    lg: "h-16 w-16 text-lg",
  };

  // Extract initials from company name
  const getInitials = (name: string) => {
    const words = name
      .split(" ")
      .filter(
        (word) => word.length > 0 && !/^(S\.r\.l\.|Ltd|Inc|LLC)$/i.test(word),
      );

    if (words.length === 0) {
      return name.substring(0, 2).toUpperCase();
    }

    if (words.length === 1) {
      const firstWord = words[0];
      return firstWord
        ? firstWord.substring(0, 2).toUpperCase()
        : name.substring(0, 2).toUpperCase();
    }

    return words
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const initials = getInitials(company);

  // Generate a consistent color based on company name
  const getColorFromString = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = [
      "from-blue-500 to-blue-600",
      "from-purple-500 to-purple-600",
      "from-green-500 to-green-600",
      "from-orange-500 to-orange-600",
      "from-pink-500 to-pink-600",
      "from-cyan-500 to-cyan-600",
      "from-indigo-500 to-indigo-600",
      "from-teal-500 to-teal-600",
    ];
    return colors[Math.abs(hash) % colors.length];
  };

  if (logo && !imageError) {
    return (
      <div
        className={`${sizeClasses[size]} flex-shrink-0 overflow-hidden rounded-lg bg-white ring-1 ring-gray-800`}
      >
        <img
          src={logo}
          alt={`${company} logo`}
          className="h-full w-full object-contain p-1"
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  // Fallback to initials
  return (
    <div
      className={`${sizeClasses[size]} flex flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${getColorFromString(company)} font-bold text-white ring-1 ring-gray-800`}
    >
      {initials}
    </div>
  );
}
