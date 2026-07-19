import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { Role } from "@prisma/client";

export const runtime = "nodejs";

function contentTypeForPath(filePath: string) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    case ".jpg":
    case ".jpeg":
    default:
      return "image/jpeg";
  }
}

function mediaPathFromUrl(raw: string, requestOrigin: string): string | null {
  if (raw.startsWith("/media/")) return raw;

  try {
    const parsed = new URL(raw);
    if (parsed.origin === requestOrigin && parsed.pathname.startsWith("/media/")) {
      return parsed.pathname;
    }
  } catch {
    return null;
  }
  return null;
}

async function readLocalMedia(mediaPath: string) {
  const relative = mediaPath.replace(/^\/+/, "");
  if (!relative.startsWith("media/") || relative.includes("..")) {
    throw new Error("Invalid media path");
  }
  const filePath = path.join(process.cwd(), "public", relative);
  const bytes = await readFile(filePath);
  return {
    bytes,
    contentType: contentTypeForPath(filePath),
  };
}

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== Role.ADMIN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const raw = new URL(request.url).searchParams.get("url")?.trim();
  if (!raw) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  const requestOrigin = new URL(request.url).origin;

  try {
    const localMediaPath = mediaPathFromUrl(raw, requestOrigin);
    if (localMediaPath) {
      try {
        const local = await readLocalMedia(localMediaPath);
        return new NextResponse(local.bytes, {
          status: 200,
          headers: {
            "Content-Type": local.contentType,
            "Cache-Control": "private, no-store",
          },
        });
      } catch {
        // Fall through to network fetch (e.g. media only on R2 in prod).
      }
    }

    let target: string;
    if (raw.startsWith("/")) {
      target = new URL(raw, requestOrigin).toString();
    } else {
      const parsed = new URL(raw);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        return NextResponse.json({ error: "Image URL is not allowed" }, { status: 400 });
      }
      target = parsed.toString();
    }

    const upstream = await fetch(target, {
      headers: { Accept: "image/*,*/*" },
      cache: "no-store",
    });
    if (!upstream.ok) {
      return NextResponse.json(
        { error: `Could not fetch image (${upstream.status})` },
        { status: 502 },
      );
    }

    const contentType = upstream.headers.get("content-type") || "application/octet-stream";
    if (!contentType.startsWith("image/") && !contentType.includes("octet-stream")) {
      return NextResponse.json({ error: "URL did not return an image" }, { status: 400 });
    }

    const bytes = await upstream.arrayBuffer();
    return new NextResponse(bytes, {
      status: 200,
      headers: {
        "Content-Type": contentType.startsWith("image/") ? contentType : "image/jpeg",
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Proxy failed";
    console.error("[admin/image-proxy]", message);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
