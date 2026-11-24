import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

// GitHub Pages serves a project site from /<repo-name>.
// The deploy workflow passes that path in PAGES_BASE_PATH, so the
// same code works on any repo name and on localhost.
const basePath = process.env.PAGES_BASE_PATH || '';

/** @type {import('next').NextConfig} */
const config = {
  output: 'export',
  reactStrictMode: true,
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    // The site origin, for absolute URLs in social preview metadata.
    NEXT_PUBLIC_SITE_ORIGIN: process.env.PAGES_ORIGIN || 'http://localhost:3000',
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ['@primer/react', '@primer/octicons-react'],
  },
};

export default withMDX(config);
