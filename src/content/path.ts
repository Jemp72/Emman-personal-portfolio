export function sitePath(path: string) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return path.startsWith("/") && !path.startsWith("//")
    ? `${base}${path}`
    : path;
}
