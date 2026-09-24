function FormField({ label, type = 'text', value, onChange, error, ...rest }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-ink">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-ink outline-none transition focus:ring-2 focus:ring-accent/20 ${
          error ? 'border-red-400' : 'border-border focus:border-accent'
        }`}
        {...rest}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}

export default FormField;
