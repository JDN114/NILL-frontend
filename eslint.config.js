import js from '@eslint/js';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import securityPlugin from 'eslint-plugin-security';
import globals from 'globals';

export default [
  // Base JS rules
  js.configs.recommended,

  // React rules
  {
    files: ['src/**/*.{js,jsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      security: securityPlugin,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      // React core
      ...reactPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',      // not needed with React 17+ JSX transform
      'react/prop-types': 'off',               // not using prop-types
      'react/display-name': 'warn',

      // Hooks
      ...reactHooksPlugin.configs.recommended.rules,

      // Security — catch common vulnerabilities
      'security/detect-object-injection': 'warn',
      'security/detect-non-literal-regexp': 'warn',
      'security/detect-unsafe-regex': 'error',
      'security/detect-buffer-noassert': 'error',
      'security/detect-child-process': 'error',
      'security/detect-disable-mustache-escape': 'error',
      'security/detect-eval-with-expression': 'error',
      'security/detect-new-buffer': 'error',
      'security/detect-no-csrf-before-method-override': 'error',
      'security/detect-possible-timing-attacks': 'warn',
      'security/detect-pseudoRandomBytes': 'error',
      'security/detect-non-literal-fs-filename': 'warn',

      // Code quality
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-undef': 'error',
      'prefer-const': 'warn',
      'no-var': 'error',
      // Enforce strict equality everywhere EXCEPT `== null` / `!= null`, which is
      // the intentional nullish dual-check idiom (matches both null and undefined)
      // used throughout this codebase. Switching those to `===`/`!==` would change
      // runtime behavior, so they are allowed; all other comparisons stay strict.
      'eqeqeq': ['error', 'always', { null: 'ignore' }],
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
    },
  },

  // react-three-fiber primitives use lowercase intrinsic props (position, args,
  // intensity, attach, ...) that react/no-unknown-property cannot recognize.
  // These are valid R3F props, so disable the rule narrowly for R3F scenes.
  {
    files: ['src/sections/iss/**/*.{js,jsx}'],
    rules: {
      'react/no-unknown-property': 'off',
    },
  },

  // Service-worker files need service-worker + browser globals.
  {
    files: ['public/sw.js', 'public/registerSW.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.serviceworker,
      },
    },
  },

  // Test files — relax some rules
  {
    files: ['src/**/*.{test,spec}.{js,jsx}', 'tests/**/*.{js,jsx,mjs}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
        vi: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
      },
    },
    rules: {
      'no-console': 'off',
      'security/detect-object-injection': 'off',
    },
  },

  // Root config + node tooling files (run under Node).
  {
    files: ['*.config.{js,mjs}', 'playwright.config.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  // Ignore build output, minified vendor, and config files
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
      '.lighthouseci/**',
      'public/**/*.min.js',  // minified vendor (e.g. three.min.js) — not app code
      // Orphaned TypeScript files mislabeled .jsx — not imported anywhere, cannot
      // parse as JS/JSX (use `interface` + type annotations). Excluded so the JS
      // parser does not choke; they are dead and never bundled by Vite.
      'src/components/Feature.jsx',
      'src/components/Features-Grid.jsx',
      'src/components/FloatingMenu.jsx',
      'src/components/GmailInbox.jsx',
      'vite.config.js',  // uses require-like patterns for manualChunks
    ],
  },
];
