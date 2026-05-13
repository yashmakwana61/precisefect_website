import { useState } from "react";
import { ImagePlus } from "lucide-react";
import { HtmlSafe } from "@/components/html-safe";
import { AssetPicker } from "@/components/admin/asset-picker";

interface HtmlEditorProps {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
  testId?: string;
}

export function HtmlEditor({ value, onChange, rows = 10, placeholder, testId }: HtmlEditorProps) {
  const [pickerOpen, setPickerOpen] = useState(false);

  function insertImage(url: string) {
    const tag = `<img src="${url}" alt="" class="rounded-lg max-w-full my-4" />`;
    onChange((value || "") + (value ? "\n" : "") + tag);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">HTML source</p>
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-container"
        >
          <ImagePlus className="w-3.5 h-3.5" /> Insert image
        </button>
      </div>
      <textarea
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        data-testid={testId}
        className="w-full px-4 py-3 rounded-lg bg-surface border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-container font-mono text-sm resize-y min-h-[200px]"
      />
      <div>
        <p className="text-xs font-bold text-primary tracking-[0.12em] uppercase mb-3">Preview</p>
        <div className="rounded-lg border border-border bg-surface-container-lowest p-6 min-h-[120px]">
          {value ? (
            <HtmlSafe html={value} />
          ) : (
            <p className="text-sm text-muted-foreground italic">Nothing to preview yet.</p>
          )}
        </div>
      </div>
      <AssetPicker open={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={insertImage} />
    </div>
  );
}
