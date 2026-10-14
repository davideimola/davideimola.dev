import { ImageResponse } from "next/og";
import { loadOgFonts } from "../../../lib/og";
import { ProfileCover } from "../../../lib/og-cover";

export const runtime = "nodejs";

// 1500×375, ratio 4:1, accepted by the LinkedIn upload.
export async function GET() {
  return new ImageResponse(<ProfileCover width={1500} height={375} />, {
    width: 1500,
    height: 375,
    fonts: await loadOgFonts(),
  });
}
