import Editor from "@monaco-editor/react";

interface MonacoEditorInnerProps {
  value: string;
  onChange: (value: string) => void;
  height: string;
}

export default function MonacoEditorInner({ value, onChange, height }: MonacoEditorInnerProps) {
  return (
    <div
      className="overflow-hidden rounded-lg border border-[var(--color-border)] shadow-sm"
      style={{ height }}
    >
      <Editor
        height={height}
        defaultLanguage="sql"
        theme="vs"
        value={value}
        onChange={(v) => onChange(v ?? "")}
        options={{
          minimap: { enabled: false },
          fontSize: 13,
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          wordWrap: "on",
          padding: { top: 8 },
        }}
      />
    </div>
  );
}
