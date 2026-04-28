# Copilot Instructions for Eat Your Veggies

## Project Architecture

**Eat Your Veggies** is a Vue 3 PWA for tracking weekly vegetable consumption. Built with TypeScript, Vite, and deployed as both web app and Android TWA.

### Core Stack

- **Vue 3** with Composition API (`<script setup>`)
- **Pinia** stores for state management (`activityStore`, `appStateStore`)
- **Vue Router** with lazy-loaded views
- **TailwindCSS** with custom utility classes
- **Vite** bundler with PWA plugin
- **i18n** with dynamic locale loading
- **Temporal.PlainDate** for week-based Date operations
- **Remeda** for functional data transformations
- **Vitest** for unit testing
- **Playwright** for e2e testing
- **unplugin-vue-components** for auto-importing components

### Key Directories

- `src/stores/` - Pinia stores with localStorage persistence
- `src/hooks/` - Composition API hooks (equivalents to custom hooks)
- `src/components/` - Reusable components
- `src/components/ui/` - UI components
- `src/components/charts/` - Chart.js wrapper components
- `src/views/` - Route-level components
- `src/utils/` - Pure functions and constants

## Critical Development Patterns

### State Management

Use `storeToRefs()` for reactive store properties:

```typescript
const {allVeggies, uniqueVeggies} = storeToRefs(useActivityStore());
```

**Data Flow**: `activityStore` manages veggie tracking, weeks, challenges, achievements. `appStateStore` handles UI state, settings, toast messages. Both persist to localStorage via `useStorage`.

### Component Testing

The correct script for unit tests is `npm run test:unit testFileNameHere`.

Test composables with `withSetup` pattern:

```typescript
const {weeklyCompletion} = withSetup(useAchievementCompletion, veggies, challenge);
```

### Suppressing Errors

Do not suppress errors with `@ts-expect-error`, unless you are overriding a Pinia store computed getter. Do not use computed for simple store properties in tests.

### VueUse Mocking

Mock VueUse composables in tests using `vi.hoisted()`:

```typescript
const mocks = vi.hoisted(() => ({
  usePreferredReducedMotion: vi.fn(() => computed(() => 'no-preference')),
}));
vi.mock('@vueuse/core', async () => ({
  ...(await vi.importActual('@vueuse/core')),
  usePreferredReducedMotion: mocks.usePreferredReducedMotion,
}));
```

### Path Aliases

Use `@/` for src imports. Works in tests and all source files with proper TypeScript configuration.

### Data Serialization

Use custom serializers for PlainDate/localStorage integration:

```typescript
// In stores - automatic PlainDate parsing/stringification
const weeks = useLocalStorage<Week[]>('veggies-weeks', [], {
  mergeDefaults: true,
  eventFilter: debounceFilter(2000),
  serializer: {
    read: (v) => (v ? JSON.parse(v, dateParser) : null),
    write: (v) => JSON.stringify(v),
  },
});
```

## Essential Commands

### Development

- `npm run dev` - Start dev server
- `npm run build` - Build for staging (GitHub Pages)
- `npm run build:production` - Build for production (domain root)

### Testing

- `npm run test:unit` - Run Vitest unit tests
- `npm run test:coverage` - Generate coverage report
- `npm run test:e2e` - Run Playwright e2e tests
- `npm run test:e2e -- --project=chromium` - Single browser
- `npm run test:e2e -- --debug` - Debug mode

### Quality

- `npm run type-check` - TypeScript checking
- `npm run lint` - ESLint
- `npm run format` - Prettier

## Component Conventions

### Reka UI Integration

The project uses [Reka UI](https://reka-ui.com) for accessible primitives (Select, Dialog, Tabs, Switch, Collapsible, RadioGroup, Combobox). Use project `ButtonComponent` where appropriate using the `asChild` prop with the component as child:

```vue
<SelectTrigger asChild>
  <ButtonComponent class="justify-between">...</ButtonComponent>
</SelectTrigger>
```

### Chart Components

Charts use these hooks: `useChartContainer`, `useChartAnimations`, `useChartOptions`.
Include `ChartScreenReaderTable` for a11y.

### Icon System

Use `IconComponent` with predefined `IconString` types from `@mdi/js` and `simple-icons`.

### Testing Attributes

Add `data-test-id` for reliable test selectors:

```vue
<button data-test-id="reset-button"></button>
```

### Styling

- Use camelCase instead of hyphenated props in components, unless defining an HTML attribute such as aria-label.
- Use the following order in props
  1. Vue directives such as v-if, v-for, and v-show etc.
  1. :key
  1. ref
  1. id or :id
  1. any dynamic props given with :propName syntax, but
  1. :data-test-id as the last one
  1. any normal props or HTML attributes, but
  1. data-test-id as the last one
- Use `template strings with ${variable}` instead of concatenated strings.

### Test Organization

- All test files are located in `/__tests__/` subfolders
- Use descriptive test file names that match the component/hook/utility being tested
- Test helper components (like `ScreenTestComponent.vue`) are located in the `src/test-utils` directory
- Avoid nested subdirectories in `/__tests__/` to prevent path resolution issues

## Storage & Persistence

### LocalStorage Keys

- `veggies-weeks` - Weekly vegetable data and challenges
- `veggies-settings` - App preferences

### Store Patterns

Use `useStorage` for persistence:

```typescript
const settings = useStorage('veggies-settings', DEFAULT_SETTINGS, localStorage, {
  mergeDefaults: true,
});
```

## PWA Specifics

### Service Worker

Auto-updates every 60 seconds in production. Build process creates Workbox SW.

### Build Modes

- `staging` - GitHub Pages deployment (`/veggies` base)
- `production` - Domain root deployment
- `ci` - CI environment builds

### TWA Integration

Android app via Trusted Web Activity. Configuration in `twa-manifest.json`.

## Date Handling

Use the `getWeekStart()` helper (Temporal-based) for week-based operations.

## Domain Logic

Seven veggie categories via `Category` enum: Fruit, Vegetable, Leafy, Root, Bean, Grain, Mushroom. Use `getCategoryForVeggie()` helper. Complex achievement system with threshold-based calculations.

## Performance Notes

- Route components and localizations are lazy-loaded
- `useMemoize` for expensive computed values (e.g., `getCategoryForVeggie`)
- Functional Programming: Leverage Remeda for data transformations (`countBy`, `difference`, `pipe`)
- Debounced Storage: Use `debounceFilter(2000)` for localStorage writes
- Virtualized lists not used (small datasets)

When implementing new features, follow the established patterns for state management, testing, and component composition. Check existing similar components for reference implementations.

## Migrations

There is a migration system in place for updating localStorage data structures. Migrations are run in `main.ts` on app startup. The migrations look for the version of the app data stored in localStorage and apply necessary transformations to bring it up to date with the current app version. Each migration is defined as a separate pure function that modifies the stored data as needed.

After successful migration, the version number is updated and data validated against the most recent schema.

Migrations are also run on data import.
