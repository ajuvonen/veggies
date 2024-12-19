# Eat Your Veggies

This project was inspired by the results of The American Gut Project, which concluded that people who consistently eat thirty or more different plant-based ingredients as part of their diet, enjoy multiple health benefits as opposed to less versatile eaters. While the creator of this project is not a nutritionist, it's easy to recommend everyone to include more variety in their diet.

Use Eat Your Veggies for free, there are no ads and no accounts - the data remains in your device's local storage. Of course that also means that if you empty your browser cache, you also effectively reset Eat Your Veggies.

## Project information

The project is a Vue-frontend created with TypeScript and bundled with Vite. It can be installed as a progressive web app (PWA) in browsers that support the technology. Other libraries included in the project include Pinia, TailwindCSS, and HeadlessUI.

## Requirements

Node 20+

PWA functionalities require a PWA-compatible browser.

## Running e2e tests

```sh
# Install browsers for the first run
npx playwright install

# When testing e2e, build the project first
npm run build

# Runs the end-to-end tests
npm run test:e2e
# Runs the tests only on Chromium
npm run test:e2e -- --project=chromium
# Runs the tests of a specific file
npm run test:e2e -- e2e/example.spec.ts
# Runs the tests in debug mode
npm run test:e2e -- --debug
```

## Running unit tests

```sh
npm install
npm test:unit
```
