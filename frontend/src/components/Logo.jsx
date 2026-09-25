const sizes = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-5xl xl:text-6xl',
};

function Logo({ size = 'md', dark = false, className = '' }) {
  return (
    <span
      className={`uppercase leading-none tracking-wide ${sizes[size]} ${
        dark ? 'text-white' : 'text-ink'
      } ${className}`}
      style={{ fontFamily: "'Anton', 'Inter', sans-serif" }}
    >
      Vaultrix
    </span>
  );
}

export default Logo;
