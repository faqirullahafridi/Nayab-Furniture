export function PageLoader() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div
        className="h-9 w-9 animate-spin rounded-full border-2 border-primary/30 border-t-primary"
        aria-label="Loading page"
      />
    </div>
  );
}
