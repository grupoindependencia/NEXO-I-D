import './PageHeader.css';

interface PageHeaderProps {
  titulo: string;
  subtitulo?: string;
  tag?: string;
}

export function PageHeader({ titulo, subtitulo, tag }: PageHeaderProps) {
  return (
    <div className="section-head">
      <div>
        <h2>{titulo}</h2>
        {subtitulo && <p className="sub">{subtitulo}</p>}
      </div>
      {tag && <span className="section-tag">{tag}</span>}
    </div>
  );
}
