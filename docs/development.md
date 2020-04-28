## Development

### Prerequisites

- Node.js 12+

### Dependencies

Install all dependencies

```bash
npm install
```

### Build

Build the sources and open them in browser. Also will watch source files for changes, rebuild and reload the page

```bash
npm start
```

Build the game into a folder `dist/`, which then can be opened using web-server.

Development build - has debug menus and extra logging

```bash
npm run build:dev
```

Production build

```bash
npm run build:prod
```

### Code quality

Code linting from terminal

```
npm run lint
```

It is highly advised to install the following plugins for you code editor:

- EditorConfig
- Prettier
- ESLint
