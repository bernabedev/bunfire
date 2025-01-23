export interface Route {
  path: string;
  handler: string;
  type: "page" | "api";
}

export interface Layout {
  path: string;
  handler: string;
}
