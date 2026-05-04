# Frontend

This project is part of the MeadStep pnpm monorepo. Run all commands from the **repo root** using pnpm workspace filters, or from inside this directory with `pnpm`.

## Development server

From the repo root:

```bash
pnpm --filter @meadstep/frontend dev
```

Or from `apps/frontend`:

```bash
pnpm dev
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run from `apps/frontend`:

```bash
pnpm ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
pnpm ng generate --help
```

## Building

From the repo root:

```bash
pnpm --filter @meadstep/frontend build
```

Or from `apps/frontend`:

```bash
pnpm build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

From the repo root:

```bash
pnpm --filter @meadstep/frontend test
```

Or from `apps/frontend`:

```bash
pnpm test
```

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
