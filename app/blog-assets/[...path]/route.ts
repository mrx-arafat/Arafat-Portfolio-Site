import fs from "node:fs";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { CONTENT_ROOT } from "@/lib/blog";

const MIME: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
};

/** Serve colocated post images from content/blog/... */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
): Promise<NextResponse> {
  const { path: segments } = await params;
  const filePath = path.join(CONTENT_ROOT, "blog", ...segments);

  // Prevent path traversal out of the content dir
  const resolved = path.resolve(filePath);
  if (!resolved.startsWith(path.resolve(CONTENT_ROOT))) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const mime = MIME[path.extname(resolved).toLowerCase()];
  if (!mime || !fs.existsSync(resolved)) {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(new Uint8Array(fs.readFileSync(resolved)), {
    headers: {
      "Content-Type": mime,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
