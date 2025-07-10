module.exports = {
  extends: [
    'next/core-web-vitals',
    'prettier' // disables conflicting ESLint rules
  ],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
  },
};
