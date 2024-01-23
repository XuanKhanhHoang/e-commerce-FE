export default async function CustomFetch(
  dir: string,
  options: object | undefined = { cache: "no-store" }
) {
  options = { cache: "no-store", ...options };
  return await fetch("http://localhost:8081/api/v1" + dir, options);
}
