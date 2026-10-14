import { ImageResponse } from "next/og";
import { loadOgFonts } from "../../../lib/og";
import { ProfileCover } from "../../../lib/og-cover";

export const runtime = "nodejs";

// 1500×500, ratio 3:1, the Bluesky banner.
export async function GET() {
  return new ImageResponse(<ProfileCover width={1500} height={500} />, {
    width: 1500,
    height: 500,
    fonts: await loadOgFonts(),
  });
}
