import type { PropsWithChildren, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
    <section className="apple-section-dark overflow-hidden rounded-xl px-6 py-14 text-left md:px-10 md:py-20">
      <div className="max-w-3xl space-y-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/68">{eyebrow}</p>
        <h1 className="font-heading text-4xl font-semibold leading-[1.07] tracking-[-0.032em] text-white md:text-[56px]">
          {title}
        </h1>
        <p className="max-w-2xl text-[17px] leading-[1.47] tracking-[-0.022em] text-white/78 md:text-[21px] md:leading-[1.19] md:tracking-[0.011em]">
          {description}
        </p>
        {actions ? <div className="flex flex-wrap gap-3 pt-2">{actions}</div> : null}
      </div>
    </section>
  );
}

export function SectionIntro({ eyebrow, title, description }: SectionIntroProps) {
  return (
    <div className="max-w-3xl space-y-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-black/52">{eyebrow}</p>
      <h2 className="font-heading text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-foreground md:text-[40px]">
        {title}
      </h2>
      <p className="max-w-2xl text-[17px] leading-[1.47] tracking-[-0.022em] text-black/70">{description}</p>
    </div>
  );
}

export function SurfaceCard({ title, description, headerAction, children }: SurfaceCardProps) {
  return (
    <Card className="overflow-hidden border-none">
      <CardHeader className="flex flex-row items-start justify-between gap-4 px-6 py-6">
        <div className="space-y-1">
          <CardTitle>{title}</CardTitle>
          {description ? <CardDescription>{description}</CardDescription> : null}
        </div>
        {headerAction ? <div className="shrink-0">{headerAction}</div> : null}
      </CardHeader>
      <CardContent className="space-y-8 p-6">{children}</CardContent>
    </Card>
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
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-[14px] font-semibold leading-none tracking-[-0.016em] text-foreground">{label}</span>
        {hint ? <span className="text-[12px] tracking-[-0.01em] text-black/48">{hint}</span> : null}
      </div>
      {children}
    </div>
  );
}

export function ResultPanel({ title, state, emptyMessage }: ResultPanelProps) {
  return (
    <div className="apple-shadow rounded-xl bg-page-dark p-6 text-white">
      <div className="flex items-center gap-3 mb-4">
        <h4 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/56">{title}</h4>
        {state.loading ? <Badge variant="secondary" className="animate-pulse bg-white/12 text-white/80">Running</Badge> : null}
      </div>
      {state.error ? <p className="rounded-lg bg-destructive/12 p-3 text-sm font-medium text-[#ff8f87]">{state.error}</p> : null}
      {!state.error && state.result ? (
        <pre className="mt-2 overflow-auto rounded-lg bg-white/6 p-4 font-mono text-[11px] leading-6 text-white/88">
          {JSON.stringify(state.result, null, 2)}
        </pre>
      ) : null}
      {!state.loading && !state.error && !state.result ? (
        <p className="py-2 text-sm italic text-white/52">{emptyMessage}</p>
      ) : null}
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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <div className="apple-shadow flex flex-col gap-2 rounded-xl bg-card px-5 py-5" key={item.label}>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-black/52">{item.label}</span>
          <strong className="font-heading text-[21px] font-semibold leading-[1.19] tracking-[-0.022em] text-foreground">
            {item.value}
          </strong>
        </div>
      ))}
    </div>
  );
}
