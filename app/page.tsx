"use client";

import { useEffect, useState } from "react";
import type { Memo } from "@/types/memo";

export default function Home() {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadMemos() {
    try {
      const res = await fetch("/api/memos");
      if (!res.ok) {
        throw new Error("メモの取得に失敗しました");
      }
      const data: Memo[] = await res.json();
      setMemos(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "メモの取得に失敗しました");
    }
  }

  useEffect(() => {
    loadMemos();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const tagList = tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    try {
      const res = await fetch("/api/memos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body, tags: tagList }),
      });

      if (res.status !== 201) {
        let message = "メモの作成に失敗しました";
        try {
          const errData: unknown = await res.json();
          if (
            typeof errData === "object" &&
            errData !== null &&
            "error" in errData &&
            typeof (errData as { error: unknown }).error === "string"
          ) {
            message = (errData as { error: string }).error;
          }
        } catch {
          // ignore JSON parse errors, keep default message
        }
        throw new Error(message);
      }

      setTitle("");
      setBody("");
      setTags("");
      await loadMemos();
    } catch (e) {
      setError(e instanceof Error ? e.message : "メモの作成に失敗しました");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <h1>ローカルメモアプリ</h1>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
      >
        <label style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <span>タイトル</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="タイトルを入力"
            style={{ padding: "0.5rem", fontSize: "1rem" }}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <span>本文</span>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="本文を入力"
            rows={4}
            style={{ padding: "0.5rem", fontSize: "1rem", resize: "vertical" }}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <span>タグ（カンマ区切り）</span>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="例: 仕事, アイデア"
            style={{ padding: "0.5rem", fontSize: "1rem" }}
          />
        </label>

        <button
          type="submit"
          disabled={submitting}
          style={{
            padding: "0.6rem 1rem",
            fontSize: "1rem",
            cursor: submitting ? "not-allowed" : "pointer",
            alignSelf: "flex-start",
          }}
        >
          {submitting ? "保存中..." : "メモを追加"}
        </button>

        {error && (
          <p style={{ color: "#e00", margin: 0 }} role="alert">
            {error}
          </p>
        )}
      </form>

      <section style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <h2>メモ一覧</h2>
        {memos.length === 0 ? (
          <p>メモがまだありません。</p>
        ) : (
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "1rem" }}>
            {memos.map((memo) => (
              <li
                key={memo.id}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "1rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <h3 style={{ margin: 0 }}>{memo.title}</h3>
                <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{memo.body}</p>
                {memo.tags.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                    {memo.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontSize: "0.8rem",
                          padding: "0.15rem 0.5rem",
                          borderRadius: "999px",
                          border: "1px solid #888",
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                <time
                  dateTime={memo.createdAt}
                  style={{ fontSize: "0.8rem", color: "#888" }}
                >
                  {new Date(memo.createdAt).toLocaleString()}
                </time>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
