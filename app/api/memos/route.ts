import { NextResponse } from "next/server";
import { readMemos, addMemo } from "@/lib/memos";
import type { Memo } from "@/types/memo";

export async function GET() {
  try {
    const memos: Memo[] = await readMemos();
    return NextResponse.json(memos);
  } catch {
    return NextResponse.json(
      { error: "Failed to read memos" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (typeof body !== "object" || body === null) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const data = body as Record<string, unknown>;

    const title = data.title;
    if (typeof title !== "string" || title.trim() === "") {
      return NextResponse.json(
        { error: "title is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    const bodyText = data.body;
    if (typeof bodyText !== "string") {
      return NextResponse.json(
        { error: "body must be a string" },
        { status: 400 }
      );
    }

    // tags is optional; fall back to [] when it is not a string array.
    const tags =
      Array.isArray(data.tags) &&
      data.tags.every((t): t is string => typeof t === "string")
        ? data.tags
        : [];

    const memo: Memo = await addMemo({ title, body: bodyText, tags });
    return NextResponse.json(memo, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create memo" },
      { status: 500 }
    );
  }
}
