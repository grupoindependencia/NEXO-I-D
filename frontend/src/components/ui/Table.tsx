import './Table.css';

export function TableWrap({ children }: { children: React.ReactNode }) {
  return <div className="tbl-wrap"><table className="tbl">{children}</table></div>;
}

export function Pill({ tipo, children }: { tipo: 'r' | 'a' | 'c' | 'i' | 'ok'; children: React.ReactNode }) {
  return <span className={`pill pill-${tipo}`}>{children}</span>;
}
