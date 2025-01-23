#!/usr/bin/env bun
import { execSync } from "child_process";
import { join } from "path";
import { startServer } from "./server";

const command = process.argv[2];
const projectRoot = process.cwd();
console.log(`Project root: ${projectRoot}`);

switch (command) {
  case "dev":
    console.log("Starting Bunfire in development mode...");
    startServer({ port: 3000, dir: `${join(projectRoot)}/src` });
    break;

  case "build":
    console.log("Building Bunfire project...");
    execSync("bun build --target=bun src/index.ts --outdir dist", {
      stdio: "inherit",
    });
    console.log("Build completed!");
    break;

  case "start":
    console.log("Starting Bunfire in production mode...");
    execSync("bun run dist/server.js", { stdio: "inherit" });
    break;

  default:
    console.log(`Unknown command: ${command}`);
    console.log("Available commands: dev, build, start");
    process.exit(1);
}
