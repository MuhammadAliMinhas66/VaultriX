function Button({ children, loading, ...rest }) {
  return (
    <button
      className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      disabled={loading || rest.disabled}
      {...rest}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
      )}
      {loading ? 'Please wait' : children}
    </button>
  );
}

export default Button;
