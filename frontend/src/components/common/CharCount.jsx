function CharCount({ value = "", max }) {
  return (
    <p className="shrink-0 text-xs text-slate-400">
      {value.length}/{max}
    </p>
  );
}

export default CharCount;