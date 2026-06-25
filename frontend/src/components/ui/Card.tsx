import { type ReactNode } from 'react';
import './Card.css';

interface CardProps {
  titulo?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Card({ titulo, icon, children, className = '' }: CardProps) {
  return (
    <div className={`card ${className}`}>
      {titulo && (
        <h3>
          {icon && <span className="card-icon">{icon}</span>}
          {titulo}
        </h3>
      )}
      {children}
    </div>
  );
}

export function Callout({
  tipo = 'info',
  titulo,
  children,
}: {
  tipo?: 'info' | 'warn' | 'crit' | 'ok';
  titulo?: string;
  children: ReactNode;
}) {
  return (
    <div className={`callout callout-${tipo}`}>
      {titulo && <strong className="callout-title">{titulo}</strong>}
      {children}
    </div>
  );
}
