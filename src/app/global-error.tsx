"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Something went wrong</h1>
          <p className="text-gray-400">A critical error occurred.</p>
          <button
            onClick={reset}
            className="px-4 py-2 bg-white text-black rounded-md hover:bg-gray-200"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
