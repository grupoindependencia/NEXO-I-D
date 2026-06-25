import './Step.css';

interface StepProps {
  n: number;
  titulo: string;
  children: React.ReactNode;
  meta?: string;
}

export function Step({ n, titulo, children, meta }: StepProps) {
  return (
    <div className="step">
      <div className="step-n">{n}</div>
      <h4>{titulo}</h4>
      <div className="step-body">{children}</div>
      {meta && <span className="step-meta">{meta}</span>}
    </div>
  );
}

export function StepsContainer({ children }: { children: React.ReactNode }) {
  return <div className="steps">{children}</div>;
}
