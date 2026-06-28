import fs from "fs/promises";
import path from "path";
import type { Memo } from "@/types/memo";

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "memos.json");

export async function readMemos(): Promise<Memo[]> {
  try {
    const raw = await fs.readFile(dataFile, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Memo[]) : [];
  } catch {
    // ENOENT (file not found) or JSON parse error -> fall back to empty list
    return [];
  }
}

export async function addMemo(input: {
  title: string;
  body: string;
  tags: string[];
}): Promise<Memo> {
  const memos = await readMemos();

  const memo: Memo = {
    id: crypto.randomUUID(),
    title: input.title,
    body: input.body,
    tags: input.tags,
    createdAt: new Date().toISOString(),
  };

  memos.push(memo);

  // Ensure the data directory exists before writing.
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(dataFile, JSON.stringify(memos, null, 2), "utf-8");

  return memo;
}
