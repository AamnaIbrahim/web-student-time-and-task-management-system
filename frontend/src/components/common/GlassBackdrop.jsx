function GlassBackdrop() {
  return (
    <>
      <div className="pointer-events-none absolute -left-10 -top-16 -z-10 h-64 w-64 animate-blob rounded-full bg-primary-200/40 blur-3xl" />
      <div className="animation-delay-2000 pointer-events-none absolute right-0 top-40 -z-10 h-56 w-56 animate-blob rounded-full bg-amber-200/30 blur-3xl" />
      <div className="animation-delay-4000 pointer-events-none absolute bottom-0 left-1/3 -z-10 h-56 w-56 animate-blob rounded-full bg-emerald-200/30 blur-3xl" />
    </>
  );
}

export default GlassBackdrop;