import LoadingSpinner from '@/components/animation/loading-spinner';

/** Shown while the short link is resolved; the page itself only redirects. */
export default function EventAliasLoading() {
  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center">
      <LoadingSpinner />
    </div>
  );
}
