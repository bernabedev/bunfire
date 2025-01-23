import { readdirSync, statSync } from "fs";
import { basename, extname, join } from "path";

export interface Layout {
  path: string;
  handler: string;
}

export function getLayouts(directory: string): Layout[] {
  const layouts: Layout[] = [];
  const entries = readdirSync(directory);

  for (const entry of entries) {
    const fullPath = join(directory, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      // Recursively find layouts in subdirectories
      layouts.push(...getLayouts(fullPath));
    } else if (basename(entry, extname(entry)) === "layout") {
      // Include layout if file name is "layout"
      layouts.push({ path: directory, handler: fullPath });
    }
  }

  return layouts;
}
