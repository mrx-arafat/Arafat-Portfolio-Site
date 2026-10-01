import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { clampDescription } from "@/lib/seo";

export const runtime = "edge";

/**
 * The card is a pure function of its query string, so shared caches may keep
 * it for a year (Vercel purges its CDN on every deploy, which is the only
 * time the rendering changes). Browsers revalidate daily so a redesign still
 * reaches returning visitors. ImageResponse alone ships `max-age=0`.
 */
const CACHE_CONTROL = "public, max-age=86400, s-maxage=31536000";

/** A query param as display text: blank falls back, overlong is cut with an ellipsis. */
function textParam(
  params: URLSearchParams,
  name: string,
  fallback: string,
  max: number,
): string {
  return clampDescription(params.get(name)?.trim() || fallback, max);
}

/** Terminal-styled social card; also the cover for posts without an uploaded one. */
export async function GET(req: NextRequest): Promise<ImageResponse> {
  const { searchParams } = new URL(req.url);
  const title = textParam(searchParams, "title", "Untitled", 120);
  const category = textParam(searchParams, "category", "blog", 24);
  const meta = textParam(searchParams, "meta", "arafatops.com", 48);
  const path = textParam(searchParams, "path", `blogs/${category}`, 48);
  const prompt = textParam(searchParams, "prompt", "cat post.md", 48);
  // "card" = portrait for article-carousel thumbnails; default = 1200x630 social OG
  const isCard = searchParams.get("size") === "card";
  const width = isCard ? 800 : 1200;
  const height = isCard ? 1000 : 630;
  const titleSize = isCard
    ? title.length > 70
      ? 40
      : 48
    : title.length > 70
      ? 44
      : 54;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#0a0a0a",
          padding: 56,
          fontFamily: "monospace",
          position: "relative",
        }}
      >
        {/* Corner brackets */}
        <div style={{ position: "absolute", top: 24, left: 24, width: 28, height: 28, borderTop: "3px solid #2ed573", borderLeft: "3px solid #2ed573", display: "flex" }} />
        <div style={{ position: "absolute", top: 24, right: 24, width: 28, height: 28, borderTop: "3px solid #2ed573", borderRight: "3px solid #2ed573", display: "flex" }} />
        <div style={{ position: "absolute", bottom: 24, left: 24, width: 28, height: 28, borderBottom: "3px solid #2ed573", borderLeft: "3px solid #2ed573", display: "flex" }} />
        <div style={{ position: "absolute", bottom: 24, right: 24, width: 28, height: 28, borderBottom: "3px solid #2ed573", borderRight: "3px solid #2ed573", display: "flex" }} />

        {/* Terminal header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 40 }}>
          <div style={{ width: 16, height: 16, borderRadius: 8, background: "#ff5f57", display: "flex" }} />
          <div style={{ width: 16, height: 16, borderRadius: 8, background: "#ffbd2e", display: "flex" }} />
          <div style={{ width: 16, height: 16, borderRadius: 8, background: "#28ca41", display: "flex" }} />
          <div style={{ color: "rgba(46,213,115,0.7)", fontSize: 24, marginLeft: 14, display: "flex" }}>
            ~/{path}
          </div>
        </div>

        {/* Prompt + title */}
        <div style={{ color: "rgba(46,213,115,0.55)", fontSize: 26, display: "flex", marginBottom: 18 }}>
          $ {prompt}
        </div>
        <div
          style={{
            color: "#2ed573",
            fontSize: titleSize,
            fontWeight: 700,
            lineHeight: 1.25,
            display: "flex",
            maxWidth: width - 120,
          }}
        >
          {title}
        </div>

        {/* Decorative deterministic binary rain filling the empty middle */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            justifyContent: "center",
            gap: 14,
            marginTop: 30,
            marginBottom: 60,
          }}
        >
          {Array.from({ length: isCard ? 7 : 4 }).map((_, row) => (
            <div
              key={row}
              style={{
                display: "flex",
                fontSize: 22,
                letterSpacing: 6,
                color: `rgba(46,213,115,${Math.max(0.05, 0.22 - row * 0.025)})`,
              }}
            >
              {Array.from({ length: isCard ? 24 : 40 })
                .map((_, col) =>
                  (title.charCodeAt((row * 7 + col) % title.length) + row + col) %
                  2
                    ? "1"
                    : "0"
                )
                .join("")}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            position: "absolute",
            bottom: 52,
            left: 56,
            right: 56,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ color: "rgba(46,213,115,0.5)", fontSize: 24, display: "flex" }}>{meta}</div>
          <div
            style={{
              color: "#0f0f0f",
              background: "#2ed573",
              fontSize: 22,
              fontWeight: 700,
              padding: "6px 16px",
              borderRadius: 6,
              display: "flex",
              textTransform: "uppercase",
            }}
          >
            {category}
          </div>
        </div>
      </div>
    ),
    { width, height, headers: { "Cache-Control": CACHE_CONTROL } }
  );
}
