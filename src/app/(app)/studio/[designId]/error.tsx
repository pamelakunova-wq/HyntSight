"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function StudioError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-semibold">Editor Error</h2>
        <p className="text-muted-foreground">
          Something went wrong loading the editor.
        </p>
        <div className="flex gap-2 justify-center">
          <Button onClick={reset} variant="outline">
            Try Again
          </Button>
          <Button render={<Link href="/dashboard" />} variant="default">
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
