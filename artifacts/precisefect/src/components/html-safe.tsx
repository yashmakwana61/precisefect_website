import { useEffect, useState } from "react";

interface HtmlSafeProps {
  html: string;
  className?: string;
}

export function HtmlSafe({ html, className }: HtmlSafeProps) {
  const [clean, setClean] = useState("");

  useEffect(() => {
    let cancelled = false;
    void import("dompurify").then(({ default: DOMPurify }) => {
      if (cancelled) return;
      setClean(
        DOMPurify.sanitize(html || "", {
          USE_PROFILES: { html: true },
        }),
      );
    });
    return () => {
      cancelled = true;
    };
  }, [html]);

  if (!clean && !html) return null;

  return (
    <div
      className={className ?? "prose prose-lg max-w-none text-muted-foreground leading-relaxed"}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}

