import { ImageResponse } from "next/og"

export const runtime = "edge"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const title = searchParams.get("title") ?? "Davide Imola"
  const subtitle =
    searchParams.get("subtitle") ?? "Software Engineer & Tech Speaker"

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0A0A0A 0%, #141414 100%)",
          color: "#E5E7EB",
          padding: "64px 80px",
          position: "relative",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial, \"Apple Color Emoji\", \"Segoe UI Emoji\"",
        }}
      >
        {/* Accent background elements */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(800px 400px at -10% -10%, rgba(201,31,55,0.25), transparent), radial-gradient(800px 400px at 110% 110%, rgba(211,56,28,0.2), transparent)",
          }}
        />

        {/* Top badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 12px",
            borderRadius: 9999,
            background: "rgba(201,31,55,0.12)",
            color: "#FCA5A5",
            fontSize: 24,
            lineHeight: 1,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              height: 10,
              width: 10,
              borderRadius: 9999,
              background: "#C91F37",
              boxShadow: "0 0 16px rgba(201,31,55,0.6)",
            }}
          />
          davideimola.dev
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 78,
            fontWeight: 800,
            letterSpacing: -1,
            color: "#F3F4F6",
            textShadow: "0 1px 0 rgba(0,0,0,0.2)",
          }}
        >
          {title}
        </div>

        {/* Subtitle */}
        <div
          style={{
            marginTop: 16,
            fontSize: 36,
            color: "#9CA3AF",
            maxWidth: 900,
          }}
        >
          {subtitle}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            position: "absolute",
            bottom: 40,
            left: 80,
            color: "#D1D5DB",
            fontSize: 28,
          }}
        >
          <div
            style={{
              height: 24,
              width: 24,
              borderRadius: 6,
              background: "#C91F37",
              boxShadow: "0 0 24px rgba(201,31,55,0.6)",
            }}
          />
          Davide Imola
          <div style={{ opacity: 0.3 }}>|</div>
          Software • Kubernetes • Go • GitOps
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}



