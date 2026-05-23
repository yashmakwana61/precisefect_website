import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { z } from "zod";
import { cmsApi } from "@/lib/cms-api";
import { useToast } from "@/hooks/use-toast";

const adminLeadSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Enter a valid email"),
  phone: z
    .string()
    .trim()
    .refine((v) => v.replace(/\D/g, "").length >= 7, "Phone must include at least 7 digits"),
  businessType: z.string().trim().min(1, "Business type is required"),
  company: z.string().trim().optional(),
  message: z.string().trim().min(1, "Add a short note about this lead"),
});

const FIELDS = [
  { key: "name" as const, label: "Name", required: true },
  { key: "email" as const, label: "Email", required: true },
  { key: "phone" as const, label: "Phone", required: true, hint: "At least 7 digits (spaces/dashes OK)" },
  { key: "businessType" as const, label: "Business type", required: true },
  { key: "company" as const, label: "Company", required: false },
];

export default function LeadNew() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    businessType: "",
    message: "",
    company: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const create = useMutation({
    mutationFn: () => {
      const parsed = adminLeadSchema.safeParse(form);
      if (!parsed.success) {
        const errors: Record<string, string> = {};
        for (const issue of parsed.error.issues) {
          const key = String(issue.path[0] ?? "form");
          if (!errors[key]) errors[key] = issue.message;
        }
        setFieldErrors(errors);
        throw new Error(Object.values(errors).join("\n"));
      }
      setFieldErrors({});
      return cmsApi.createLeadAdmin({
        ...parsed.data,
        company: parsed.data.company ?? "",
        source: "manual",
        sourceDetail: "admin",
      });
    },
    onSuccess: (lead) => {
      toast({ title: "Lead created" });
      setLocation(`/admin/leads/${lead.id}`);
    },
    onError: (e) => toast({ title: "Could not create lead", description: String(e), variant: "destructive" }),
  });

  return (
    <div className="px-8 lg:px-16 py-12 max-w-xl">
      <Link href="/admin/leads" className="inline-flex items-center text-xs font-bold text-muted-foreground hover:text-primary uppercase tracking-[0.15em] mb-8">
        <ArrowLeft className="w-3.5 h-3.5 mr-2" /> All leads
      </Link>
      <h1 className="text-3xl font-bold text-primary mb-8">Add lead</h1>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          create.mutate();
        }}
      >
        {FIELDS.map(({ key, label, required, hint }) => (
          <div key={key}>
            <label className="text-xs font-bold uppercase tracking-wider text-primary block mb-2">{label}</label>
            <input
              required={required}
              value={form[key]}
              onChange={(e) => {
                setForm((f) => ({ ...f, [key]: e.target.value }));
                setFieldErrors((prev) => {
                  const next = { ...prev };
                  delete next[key];
                  return next;
                });
              }}
              className="w-full px-4 py-2 rounded-lg border border-border bg-surface"
            />
            {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
            {fieldErrors[key] && <p className="text-xs text-destructive mt-1">{fieldErrors[key]}</p>}
          </div>
        ))}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-primary block mb-2">Message / notes</label>
          <textarea
            required
            value={form.message}
            onChange={(e) => {
              setForm((f) => ({ ...f, message: e.target.value }));
              setFieldErrors((prev) => {
                const next = { ...prev };
                delete next.message;
                return next;
              });
            }}
            rows={4}
            placeholder="e.g. Met at trade show, wants ERP quote"
            className="w-full px-4 py-2 rounded-lg border border-border bg-surface resize-none"
          />
          <p className="text-xs text-muted-foreground mt-1">Any short note is fine (minimum 1 character).</p>
          {fieldErrors.message && <p className="text-xs text-destructive mt-1">{fieldErrors.message}</p>}
        </div>
        <button
          type="submit"
          disabled={create.isPending}
          className="signature-gradient text-white font-bold rounded-lg px-6 py-3 disabled:opacity-50"
        >
          {create.isPending ? "Saving…" : "Create lead"}
        </button>
      </form>
    </div>
  );
}
