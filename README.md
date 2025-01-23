# Bunfire

Bunfire is a lightweight and fast web framework built with Bun. It features:

- **Folder-based routing** for pages and APIs
- **React support** with `.tsx` and `.jsx` components
- **Layout hierarchy** similar to Next.js
- **Static file serving** for CSS and other assets

## Features

- **Routing**: Automatic routing based on the `pages` and `api` folders.
- **Layouts**: Nested layouts for reusable UI patterns.
- **TypeScript Support**: Fully typed with TypeScript while also supporting JavaScript.
- **CSS Integration**: Includes support for global and local CSS styles.

---

## Project Structure

```
.
├── src/
│   ├── pages/                 # Contains `.tsx` and `.jsx` files for routing
│   │   ├── index.tsx          # Page for `/`
│   │   ├── about/index.tsx    # Page for `/about`
│   │   └── contact/index.tsx  # Page for `/contact`
│   │   └── layout.tsx         # Layout for all pages
│   ├── api/                   # Contains `.ts` and `.js` files for API routes
│   │   ├── hello/index.ts     # API route for `/api/hello`
│   ├── styles/                # Global CSS files
│   │   └── global.css         # Global styles
│   └── index.ts               # Main server file
├── .gitignore                 # Git ignore file
├── package.json               # Project configuration
├── bunfig.toml                # Bun-specific configuration (optional)
└── tsconfig.json              # TypeScript configuration
```

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/yourusername/bunfire.git
cd bunfire
bun install
```

### Scripts

- **`bun run dev`**: Starts the development server.
- **`bun run start`**: Starts the production server.
- **`bun run build`**: Placeholder for build (not required in Bun).

### Running the Server

To start the server in development mode:

```bash
bun run dev
```

Open your browser and navigate to `http://localhost:3000`.

---

## Examples

### Adding a Page

Create a new file in the `pages` directory:

```tsx
// src/pages/contact/index.tsx
import React from "react";

export default function Contact() {
  return (
    <div>
      <h1>Contact Us</h1>
      <p>Email: contact@bunfire.dev</p>
    </div>
  );
}
```

This page will be available at `http://localhost:3000/contact`.

### Adding an API Route

Create a new file in the `api` directory:

```typescript
// src/api/hello/index.ts
export default function handler() {
  return new Response(JSON.stringify({ message: "Hello, API!" }), {
    headers: { "Content-Type": "application/json" },
  });
}
```

This API route will be available at `http://localhost:3000/api/hello`.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
