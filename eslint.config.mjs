import { FlatCompat } from '@eslint/eslintrc';
import interprizConfig from '@interpriz/eslint-config';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      'dev-only/**',
      '.next',
      '.turbo',
      'dist',
      'build',
      'coverage',
      'next-env.d.ts',
    ],
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  ...interprizConfig,
  // Project-specific tweaks to match TS + React 19 usage
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      // TS handles undefined vars; prevent false positives for type-only refs like React.ReactNode
      'no-undef': 'off',
      // Allow non-null assertions on optional chains as warnings for now
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'warn',
      // Allow require in config files when using TS
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    files: [
      'next.config.*',
      'postcss.config.*',
      'tailwind.config.*',
      'eslint.config.*',
    ],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
];

export default eslintConfig;
