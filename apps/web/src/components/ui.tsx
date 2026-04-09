import type { PropsWithChildren, ReactNode } from 'react';

export type OperationState = {
  loading: boolean;
  error: string | null;
  result: unknown;
};

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
};

type SectionIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

type SurfaceCardProps = PropsWithChildren<{
  title: string;
  description?: string;
  headerAction?: ReactNode;
}>;

type ResultPanelProps = {
  title: string;
  state: OperationState;
  emptyMessage: string;
};

export function PageHero({ eyebrow, title, description, actions }: PageHeroProps) {
  return (
    <section className="page-hero">
      <p className="page-kicker">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="page-description">{description}</p>
      {actions ? <div className="page-actions">{actions}</div> : null}
    </section>
  );
}

export function SectionIntro({ eyebrow, title, description }: SectionIntroProps) {
  return (
    <div className="section-intro">
      <p className="section-kicker-dark">{eyebrow}</p>
      <h2>{title}</h2>
      <p className="section-body">{description}</p>
    </div>
  );
}

export function SurfaceCard({ title, description, headerAction, children }: SurfaceCardProps) {
  return (
    <section className="surface-card">
      <div className="surface-card-header">
        <div>
          <h3>{title}</h3>
          {description ? <p>{description}</p> : null}
        </div>
        {headerAction}
      </div>
      <div className="surface-card-body">{children}</div>
    </section>
  );
}

export function FormField({
  label,
  hint,
  children,
}: PropsWithChildren<{
  label: string;
  hint?: string;
}>) {
  return (
    <label className="form-field">
      <span className="field-label">{label}</span>
      {hint ? <span className="field-hint">{hint}</span> : null}
      {children}
    </label>
  );
}

export function ResultPanel({ title, state, emptyMessage }: ResultPanelProps) {
  return (
    <div className="result-panel">
      <div className="result-panel-header">
        <h4>{title}</h4>
        {state.loading ? <span className="result-badge">Running</span> : null}
      </div>
      {state.error ? <p className="result-error">{state.error}</p> : null}
      {!state.error && state.result ? (
        <pre className="result-code">{JSON.stringify(state.result, null, 2)}</pre>
      ) : null}
      {!state.loading && !state.error && !state.result ? <p className="result-empty">{emptyMessage}</p> : null}
    </div>
  );
}

export function StatGrid({
  items,
}: {
  items: Array<{
    label: string;
    value: string;
  }>;
}) {
  return (
    <div className="stat-grid">
      {items.map((item) => (
        <div className="stat-card" key={item.label}>
          <span>{item.label}</span>
          <strong>{item.value}</strong>
        </div>
      ))}
    </div>
  );
}
