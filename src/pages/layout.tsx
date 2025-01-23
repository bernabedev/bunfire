import { readFileSync } from "fs";
import { join } from "path";
import React from "react";
import "../styles/global.css";
const globalStyles = readFileSync(
  join(import.meta.dir, "../styles/global.css"),
  "utf-8"
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <title>Global Layout</title>
        <style dangerouslySetInnerHTML={{ __html: globalStyles }}></style>
      </head>
      <body>
        <header>
          <h1>Global Layout</h1>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
