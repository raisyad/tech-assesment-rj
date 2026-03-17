import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  description = "An error occurred while fetching data. Please try again.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-red-100 bg-red-50/50 p-8 text-center",
        className
      )}
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
        <svg
          className="h-6 w-6 text-red-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h3 className="mt-4 text-lg font-semibold text-red-900">{title}</h3>
      <p className="mt-2 text-sm text-red-700">{description}</p>
      {onRetry && (
        <Button
          variant="outline"
          onClick={onRetry}
          className="mt-6 border-red-200 text-red-700 hover:bg-red-100"
        >
          Try Again
        </Button>
      )}
    </div>
  );
}
