export default function handler(req: Request): Response {
  return new Response(JSON.stringify({ message: "Hello, API!" }), {
    headers: { "Content-Type": "application/json" },
  });
}
