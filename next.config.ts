import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 親ディレクトリの package-lock.json をワークスペースルートと誤検出する警告を防ぐため、
  // このプロジェクトのディレクトリをルートとして明示する。
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
