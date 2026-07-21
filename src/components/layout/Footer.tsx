export function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-200">
      <div className="mx-auto flex max-w-5xl flex-col gap-1 px-4 py-8 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>© {new Date().getFullYear()} RenderPop</p>
        <p>Free AI Image Generator · Free daily Fast generations</p>
      </div>
    </footer>
  );
}
