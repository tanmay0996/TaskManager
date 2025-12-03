# Frontend Tests

This frontend uses **Vitest** with **React Testing Library**.

- Test environment: `jsdom` (configured in `vitest.config.js`).
- Global setup: `src/setupTests.js` imports `@testing-library/jest-dom`.

## Running tests

From the `frontend` folder:

```bash
npm test
# or with coverage
npm run test:coverage
```

To run a single test file:

```bash
npx vitest run src/pages/Login.test.jsx
```
