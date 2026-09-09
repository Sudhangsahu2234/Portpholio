import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // There is an unrelated package-lock.json in C:\Users\hp, which makes
  // Turbopack infer the home directory as the workspace root. Pin it here.
  turbopack: {
    root: path.resolve(process.cwd()),
  },
};

export default nextConfig;
