import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type ApiErrorStateProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
};

export function ApiErrorState({
  title = "Unable to load data",
  message = "Something went wrong while fetching content. Please try again.",
  onRetry,
}: ApiErrorStateProps) {
  return (
    <div className="text-center py-16 px-6 bg-card border border-border rounded-sm">
      <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-4" />
      <h3 className="font-serif text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-md mx-auto mb-6">{message}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}
