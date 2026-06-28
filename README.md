# ローカルメモアプリ

Next.js (App Router) + JSON ファイル永続化で作る、シンプルなローカルメモアプリです。
タイトル・本文・タグ付きのメモを投稿でき、データは `data/memos.json` に保存されるため、
ブラウザのリロードやサーバー再起動後もメモが残ります。

Claude Code ハンズオン「Plan モードでローカルメモアプリを設計・実装する」の成果物です。

## 主な機能

- メモの投稿（タイトル / 本文 / タグ）
- メモ一覧の表示（作成日時・タグ付き）
- `fs/promises` による JSON ファイルへの永続化

## 技術スタック

- Next.js 16 (App Router) / React 19 / TypeScript
- 永続化: ローカル JSON ファイル（`data/memos.json`）

## ディレクトリ構成

```
app/
  page.tsx            # メモ投稿フォーム + 一覧（Client Component）
  layout.tsx          # ルートレイアウト / メタ情報
  globals.css         # 全体スタイル
  api/memos/route.ts  # GET(一覧) / POST(追加) の Route Handler
lib/memos.ts          # JSON 読み書きユーティリティ（readMemos / addMemo）
types/memo.ts         # Memo 型定義
data/memos.json       # 永続化ファイル（初期値 [])
```

## セットアップと起動

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動（http://localhost:3000）
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開くとメモアプリが表示されます。

## API

| メソッド | パス | 説明 |
|----------|------|------|
| `GET`  | `/api/memos` | メモを全件取得 |
| `POST` | `/api/memos` | メモを 1 件追加（`{ title, body, tags }`） |

### 動作確認（curl）

```bash
# メモを追加
curl -X POST http://localhost:3000/api/memos \
  -H "Content-Type: application/json" \
  -d '{"title":"買い物","body":"牛乳を買う","tags":["私用"]}'

# 一覧取得
curl http://localhost:3000/api/memos
```

## ビルド

```bash
npm run build
npm run start
```
