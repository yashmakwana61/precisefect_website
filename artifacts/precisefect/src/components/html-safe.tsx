import DOMPurify from "dompurify";

interface HtmlSafeProps {
  html: string;
  className?: string;
}

export function HtmlSafe({ html, className }: HtmlSafeProps) {
  const clean = DOMPurify.sanitize(html || "", {
    USE_PROFILES: { html: true },
  });
  return (
    <div
      className={className ?? "prose prose-lg max-w-none text-muted-foreground leading-relaxed"}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
