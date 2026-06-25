import './Leds.css';

interface LedItem { color: 'green' | 'yellow' | 'red'; name: string; desc?: string }

export function Leds({ items, size = 44 }: { items: LedItem[]; size?: number }) {
  return (
    <div className="leds">
      {items.map((l, i) => (
        <div key={i} className="led-card">
          <div className={`led led-${l.color}`} style={{ width: size, height: size }} />
          <div className="led-name">{l.name}</div>
          {l.desc && <div className="led-desc">{l.desc}</div>}
        </div>
      ))}
    </div>
  );
}
