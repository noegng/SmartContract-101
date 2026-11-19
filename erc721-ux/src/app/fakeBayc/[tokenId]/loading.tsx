// With cacheComponents (Next 16 default), reading a dynamic param must happen
// inside a <Suspense> boundary. This file creates one around page.tsx.
export default function Loading() {
  return <main className="p-8">Loading…</main>;
}
