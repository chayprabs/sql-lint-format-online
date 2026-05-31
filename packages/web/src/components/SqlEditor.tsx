import { lazy, Suspense } from "react";
const Monaco = lazy(() => import("./MonacoEditorInner"));

interface SqlEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: string;
  placeholder?: string;
}

export function SqlEditor({ value, onChange, height = "14rem", placeholder }: SqlEditorProps) {
  return (
    <Suspense
      fallback={
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          spellCheck={false}
          className="w-full resize-y rounded-lg border border-[var(--color-border)] bg-white p-3 font-mono text-sm"
          style={{ height }}
        />
      }
    >
      <Monaco value={value} onChange={onChange} height={height} />
    </Suspense>
  );
}
