import { Skeleton } from "@/components/ui/skeleton";

export default function StudioLoading() {
  return (
    <div className="h-screen flex">
      <Skeleton className="w-14 h-full" />
      <Skeleton className="flex-1 h-full" />
      <Skeleton className="w-72 h-full" />
    </div>
  );
}
