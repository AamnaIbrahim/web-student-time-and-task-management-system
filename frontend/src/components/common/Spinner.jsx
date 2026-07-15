function Spinner({ className = "h-8 w-8" }) {
  return (
    <div className={`animate-spin rounded-full border-2 border-primary-200 border-t-primary-600 ${className}`} />
  );
}

export default Spinner;