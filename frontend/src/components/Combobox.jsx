import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation.js';

function Combobox({ label, items, value, onChange, placeholder }) {
  const { t } = useTranslation();
  const resolvedPlaceholder = placeholder || t('common.search');
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlighted, setHighlighted] = useState(0);
  const rootRef = useRef(null);
  const inputRef = useRef(null);

  const selected = items.find((item) => item.value === value) || null;
  const filtered = query
    ? items.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()))
    : items;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      setHighlighted(0);
    }
  }, [open, query]);

  const selectItem = (item) => {
    onChange(item.value);
    setOpen(false);
    setQuery('');
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlighted((prev) => Math.min(prev + 1, filtered.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlighted((prev) => Math.max(prev - 1, 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (filtered[highlighted]) selectItem(filtered[highlighted]);
    } else if (event.key === 'Escape') {
      setOpen(false);
      setQuery('');
    }
  };

  return (
    <div ref={rootRef} className="relative flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-ink">{label}</label>}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between rounded-lg border border-border px-3.5 py-2.5 text-left text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
      >
        <span className="flex items-center gap-2 truncate">
          {selected?.flag && <span className="text-base leading-none">{selected.flag}</span>}
          {selected?.symbol && (
            <span className="w-5 flex-shrink-0 text-xs font-medium text-muted">{selected.symbol}</span>
          )}
          {selected ? (
            <span className="truncate">{selected.label}</span>
          ) : (
            <span className="text-muted">{resolvedPlaceholder}</span>
          )}
        </span>
        <ChevronDown className={`h-4 w-4 flex-shrink-0 text-muted transition ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-30 mt-1.5 w-full overflow-hidden rounded-lg border border-border bg-white shadow-xl">
          <div className="flex items-center gap-2 border-b border-border px-3 py-2">
            <Search className="h-3.5 w-3.5 flex-shrink-0 text-muted" />
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={resolvedPlaceholder}
              className="w-full text-sm text-ink outline-none placeholder:text-muted"
            />
          </div>

          <div className="max-h-56 overflow-y-auto py-1">
            {filtered.length === 0 && (
              <p className="px-3.5 py-2.5 text-sm text-muted">{t('common.noMatches')}</p>
            )}
            {filtered.map((item, index) => (
              <button
                key={item.value}
                type="button"
                onClick={() => selectItem(item)}
                onMouseEnter={() => setHighlighted(index)}
                className={`flex w-full items-center gap-2 px-3.5 py-2 text-left text-sm ${
                  index === highlighted ? 'bg-surface' : ''
                } ${item.value === value ? 'font-medium text-ink' : 'text-ink'}`}
              >
                {item.flag && <span className="text-base leading-none">{item.flag}</span>}
                {item.symbol && (
                  <span className="w-5 flex-shrink-0 text-xs font-medium text-muted">{item.symbol}</span>
                )}
                <span className="truncate">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Combobox;
