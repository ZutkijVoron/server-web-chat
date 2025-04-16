const globals = require('globals');
const js = require('@eslint/js');

/** @type {import('eslint').Linter.Config[]} */
module.exports = [
    js.configs.recommended,
    {
        files: ['**/*.{js,mjs,jsx}'],
        languageOptions: {
            sourceType: 'commonjs',
            globals: {
                ...globals.node,
                ...globals.browser,
                ...globals.es2025
            },
        },
        plugins: {
        },
    },
    {
        ignores: ['node_modules', 'dist']
    },
    {
        rules: {
            'no-unused-vars': 'error',
            'no-dupe-args': 'error',
            'no-dupe-class-members': 'error',
            'no-unreachable': 'error',
            'no-eval': 'error',
            'semi': ['error', 'always'],
            'quotes': ['error', 'single'],
            'indent': ['error', 4],
        }
    },
];

