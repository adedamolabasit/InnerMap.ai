"use client";

import { ReactNode } from "react";

export function FullPageLoading({
  message = "Loading...",
}: {
  message?: string;
}) {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          {message}
        </h2>
        <p className="text-muted-foreground">Preparing your dream journal</p>
      </div>
    </main>
  );
}

export function PageLoadingSpinner({ show = true }: { show?: boolean }) {
  if (!show) return null;

  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-primary/20 z-50 overflow-hidden">
      <div className="h-full bg-primary animate-[shimmer_2s_infinite] w-1/2"></div>
    </div>
  );
}

export function ContentLoading({
  message = "Loading...",
}: {
  message?: string;
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">{message}</p>
        </div>
      </div>
    </div>
  );
}

export function InlineLoading() {
  return (
    <div className="inline-block animate-spin rounded-full border-t-2 border-b-2 border-primary" />
  );
}

export function FullPageError({
  title = "Something went wrong",
  message = "Failed to load content",
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center max-w-md p-6">
        <div className="text-red-500 text-4xl mb-4">⚠️</div>
        <h2 className="text-xl font-semibold text-foreground mb-2">{title}</h2>
        <p className="text-muted-foreground mb-4">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>
        )}
      </div>
    </main>
  );
}

export function ContentError({
  title = "Failed to load",
  message,
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="text-red-500 text-4xl mb-4">⚠️</div>
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        {message && <p className="text-muted-foreground mb-4">{message}</p>}
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}

export function EmptyState({
  icon = "◆",
  title = "No content yet",
  description,
  actionLabel,
  onAction,
}: {
  icon?: ReactNode;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-12 border-border bg-card text-center space-y-4 rounded-lg">
        <div className="text-4xl">{icon}</div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {description && <p className="text-muted-foreground">{description}</p>}
        {onAction && actionLabel && (
          <button
            onClick={onAction}
            className="mt-4 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}

export function EmptyDreams({ onNewDream }: { onNewDream: () => void }) {
  return (
    <EmptyState
      icon="◆"
      title="No dreams yet"
      description="Start your first dream journal entry to begin exploring your inner world."
      actionLabel="Create First Entry"
      onAction={onNewDream}
    />
  );
}

export function EmptySearch({ onClear }: { onClear?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="text-4xl mb-4">🔍</div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        No results found
      </h3>
      <p className="text-muted-foreground mb-4">
        Try adjusting your search terms or filters
      </p>
      {onClear && (
        <button onClick={onClear} className="text-primary hover:underline">
          Clear search
        </button>
      )}
    </div>
  );
}

export default function NotFound() {
  return <div>404 page</div>;
}

export function DreamNotFound({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md p-6">
        <div className="text-4xl mb-4">🌙</div>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Dream not found
        </h2>
        <p className="text-muted-foreground mb-6">
          The dream you're looking for doesn't exist or has been deleted.
        </p>
        <button
          onClick={onBack}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
        >
          Back to Dreams
        </button>
      </div>
    </div>
  );
}

export function AppLoadingState() {
  return (
    <>
      <PageLoadingSpinner show={true} />
      <FullPageLoading message="Loading your dreams..." />
    </>
  );
}

export function AppErrorState({
  error,
  onRetry,
}: {
  error?: Error;
  onRetry?: () => void;
}) {
  return (
    <FullPageError
      title="Something went wrong"
      message={error?.message || "Failed to load dreams"}
      onRetry={onRetry || (() => window.location.reload())}
    />
  );
}
