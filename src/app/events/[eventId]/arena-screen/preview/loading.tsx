export default function Loading() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-slate-950" role="status" aria-busy="true">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-amber-400" aria-hidden />
    </div>
  );
}
