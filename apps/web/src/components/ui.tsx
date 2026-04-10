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
    <section className="py-12 md:py-16 text-left space-y-4">
      <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider">{eyebrow}</p>
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">{title}</h1>
      <p className="text-xl text-muted-foreground max-w-2xl">{description}</p>
      {actions ? <div className="flex gap-4 mt-6">{actions}</div> : null}
    </section>
  );
}

export function SectionIntro({ eyebrow, title, description }: SectionIntroProps) {
  return (
    <div className="mb-0 space-y-4">
      <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider">{eyebrow}</p>
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">{title}</h2>
      <p className="text-lg text-muted-foreground max-w-2xl">{description}</p>
    </div>
  );
}

export function SurfaceCard({ title, description, headerAction, children }: SurfaceCardProps) {
  return (
    <Card className="overflow-hidden border-none shadow-md">
      <CardHeader className="flex flex-row items-center justify-between border-b px-6 py-5">
        <div className="space-y-1">
          <CardTitle className="text-xl font-semibold">{title}</CardTitle>
          {description ? <CardDescription className="text-sm">{description}</CardDescription> : null}
        </div>
        {headerAction}
      </CardHeader>
      <CardContent className="p-6 space-y-8">
        {children}
      </CardContent>
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
        <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{label}</span>
        {hint ? <span className="text-xs text-muted-foreground">{hint}</span> : null}
      </div>
      {children}
    </div>
  );
}

export function ResultPanel({ title, state, emptyMessage }: ResultPanelProps) {
  return (
    <div className="bg-muted/50 rounded-xl p-6 border border-border">
      <div className="flex items-center gap-3 mb-4">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{title}</h4>
        {state.loading ? <Badge variant="secondary" className="animate-pulse">Running</Badge> : null}
      </div>
      {state.error ? <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-md font-medium">{state.error}</p> : null}
      {!state.error && state.result ? (
        <pre className="text-xs font-mono bg-background p-4 rounded-lg overflow-auto border border-border mt-2 shadow-inner">
          {JSON.stringify(state.result, null, 2)}
        </pre>
      ) : null}
      {!state.loading && !state.error && !state.result ? (
        <p className="text-sm text-muted-foreground italic py-2">{emptyMessage}</p>
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <div className="bg-card p-5 rounded-lg border border-border flex flex-col gap-1 shadow-sm" key={item.label}>
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{item.label}</span>
          <strong className="text-lg font-bold truncate text-foreground">{item.value}</strong>
        </div>
      ))}
    </div>
  );
}
