import { PenTool } from "lucide-react";

export function EmptyState({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="rounded-full bg-muted p-6 mb-6">
        <PenTool className="size-10 text-muted-foreground" />
      </div>
      <h2 className="text-xl font-semibold mb-2">No designs yet</h2>
      <p className="text-muted-foreground mb-6 max-w-sm">
        Create your first AI-powered clothing design
      </p>
      {children}
    </div>
  );
}
