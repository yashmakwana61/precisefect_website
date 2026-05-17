import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { cmsApi } from "@/lib/cms-api";
import { useToast } from "@/hooks/use-toast";

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

  const create = useMutation({
    mutationFn: () =>
      cmsApi.createLeadAdmin({
        ...form,
        source: "manual",
        sourceDetail: "admin",
      }),
    onSuccess: (lead) => {
      toast({ title: "Lead created" });
      setLocation(`/admin/leads/${lead.id}`);
    },
    onError: (e) => toast({ title: "Failed", description: String(e), variant: "destructive" }),
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
        {(["name", "email", "phone", "businessType", "company"] as const).map((key) => (
          <div key={key}>
            <label className="text-xs font-bold uppercase tracking-wider text-primary block mb-2">{key}</label>
            <input
              required={key !== "company"}
              value={form[key]}
              onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg border border-border bg-surface"
            />
          </div>
        ))}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-primary block mb-2">Message</label>
          <textarea
            required
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            rows={4}
            className="w-full px-4 py-2 rounded-lg border border-border bg-surface resize-none"
          />
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
