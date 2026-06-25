import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Loader2 } from 'lucide-react';
import { LIFECYCLE_CONFIG, type LifecycleStatus } from '@/config/projects';
import './LifecyclePicker.css';

interface LifecyclePickerProps {
  lifecycle: LifecycleStatus;
  editable?: boolean;
  saving?: boolean;
  onChange?: (lc: LifecycleStatus) => void;
  onOpenChange?: (open: boolean) => void;
}

export function LifecyclePicker({ lifecycle, editable = false, saving = false, onChange, onOpenChange }: LifecyclePickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const lc  = LIFECYCLE_CONFIG[lifecycle] ?? LIFECYCLE_CONFIG['investigacion'];

  function setOpenWithNotify(next: boolean) {
    setOpen(next);
    onOpenChange?.(next);
  }

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpenWithNotify(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  function handleSelect(key: LifecycleStatus) {
    setOpenWithNotify(false);
    onChange?.(key);
  }

  return (
    <div ref={ref} className="lcp-wrap">
      <span
        className={`lcp-chip ${editable ? 'lcp-chip--editable' : ''} ${saving ? 'lcp-chip--saving' : ''}`}
        style={{ color: lc.color, background: lc.bg }}
        onClick={editable ? () => setOpenWithNotify(!open) : undefined}
        title={editable ? 'Cambiar estado' : undefined}
      >
        {saving
          ? <Loader2 size={11} className="lcp-spin" />
          : null}
        {lc.label}
        {editable && !saving && <ChevronDown size={10} className="lcp-caret" />}
      </span>

      {open && (
        <div className="lcp-dropdown">
          {(Object.entries(LIFECYCLE_CONFIG) as [LifecycleStatus, typeof lc][]).map(([key, cfg]) => (
            <button
              key={key}
              className={`lcp-option ${key === lifecycle ? 'lcp-option--active' : ''}`}
              onClick={() => handleSelect(key)}
            >
              <span className="lcp-option-dot" style={{ background: cfg.color }} />
              {cfg.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
