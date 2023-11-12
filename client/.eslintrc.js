module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/essential',
    'eslint:recommended',
    '@vue/typescript/recommended',
  ],
  plugins: ['eslint-plugin-prettier'],
  rules: {
    'no-console': 'off',
    'no-async-promise-executor': 'off',
    'prettier/prettier': 'warn',
    '@typescript-eslint/no-var-requires': 'off',
    'prefer-spread': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/no-v-text-v-html-on-component': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    'vue/no-v-for-template-key': 'off',
    'vue/no-multiple-template-root': 'off',
    'vue/no-v-model-argument': 'off',
    '@typescript-eslint/ban-types': [
      'error',
      {
        extendDefaults: true,
        types: {
          '{}': false,
        },
      },
    ],
  },
};
