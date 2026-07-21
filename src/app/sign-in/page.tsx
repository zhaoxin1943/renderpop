import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to RenderPop with Google.",
};

type SearchParams = Promise<{ return_to?: string }>;

export default async function SignInPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const returnTo = params.return_to ?? "/";

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Sign in
        </h1>
        <p className="text-sm leading-6 text-zinc-600">
          Google OAuth + session cookie will be wired to the Python API. After
          login you return to{" "}
          <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs">
            {returnTo}
          </code>
          .
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <button
          type="button"
          disabled
          className="flex h-11 w-full cursor-not-allowed items-center justify-center rounded-full bg-zinc-900 text-sm font-medium text-white opacity-60"
        >
          Continue with Google (coming soon)
        </button>
        <p className="mt-4 text-center text-xs leading-5 text-zinc-500">
          Planned:{" "}
          <code className="rounded bg-zinc-100 px-1 py-0.5">
            GET /api/v1/auth/google/start
          </code>
        </p>
      </div>

      <p className="text-center text-sm text-zinc-500">
        <Link href="/" className="font-medium text-zinc-900 underline-offset-4 hover:underline">
          Back home
        </Link>
      </p>
    </div>
  );
}
