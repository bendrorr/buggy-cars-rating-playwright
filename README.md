# Buggy Cars Rating - Playwright Automation

This project is an end-to-end and API automation framework for the [Buggy Cars Rating](https://buggy.justtestit.org/)
website, built using **Playwright** with **TypeScript**.

## Features

- ✅ UI Tests using Playwright with Page Object Model
- ✅ API Tests using Playwright's APIRequestContext
- ✅ Hybrid Tests combining API and UI flows
- ✅ Follows Clean Code & SOLID principles
- ✅ Modular structure: Pages, Components, API Clients, Utilities

## Tech Stack

- **Playwright** (TypeScript)
- **Node.js**
- **Jest-like test runner** (built into Playwright)

## Scripts

```bash
# Run all tests
npx playwright test

# Run specific file
npx playwright test tests/ui/LoginTests.spec.ts

# Show HTML report
npx playwright show-report

├── pages/               # UI Page Objects
├── api/                 # API Clients
├── tests/               # UI, API, and Hybrid tests
├── util/                # Helpers (e.g., isOnPage, readVisibleText)
├── data/                # Test data (users, inputs)
