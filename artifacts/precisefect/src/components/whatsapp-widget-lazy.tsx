import { lazy, Suspense } from "react";

const WhatsAppWidget = lazy(() =>
  import("./whatsapp-widget").then((m) => ({ default: m.WhatsAppWidget })),
);

export function DeferredWhatsAppWidget() {
  return (
    <Suspense fallback={null}>
      <WhatsAppWidget />
    </Suspense>
  );
}
