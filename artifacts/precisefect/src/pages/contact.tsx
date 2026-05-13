import { Seo } from "@/components/seo";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Mail, Phone, MapPin, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSitePage } from "@/hooks/use-site-page";
import { HtmlSafe } from "@/components/html-safe";
import { CONTACT_INFO } from "@/lib/contact-info";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  businessType: z.string().min(1, "Please select an industry"),
  message: z.string().min(10, "Please provide structural details about your needs")
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { content } = useSitePage("/contact");

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      businessType: "",
      message: ""
    }
  });

  const onSubmit = (data: ContactFormValues) => {
    console.log("Form data:", data);
    setTimeout(() => setIsSubmitted(true), 800);
  };

  const legacyBodyContent =
    content.bodyContent?.includes("San Francisco") ||
    content.bodyContent?.includes("Bangalore") ||
    content.bodyContent?.includes("hello@precisefect.com");

  return (
    <>
      <Seo 
        title={content.metaTitle || "Submit RFP | Precisefect Consulting"} 
        description={content.metaDescription || "Schedule an architectural review with Precisefect to discuss your ERP implementation or business automation needs."}
      />
      
      <section className="py-24 md:py-32 bg-surface relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
            
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-xs font-bold text-on-primary-container tracking-[0.2em] uppercase mb-4">{content.heroEyebrow}</p>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-primary mb-8 leading-[0.95]">
                {content.heroHeadline}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-16 max-w-md">
                {content.heroSubheadline}
              </p>

              <div className="space-y-12">
                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center text-primary shrink-0">
                    <Mail size={24} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary text-lg mb-2">Direct Channel</h3>
                    <p className="text-muted-foreground mb-2 text-sm leading-relaxed">For RFPs, vendor assessments, and technical inquiries.</p>
                    <a href={`mailto:${CONTACT_INFO.email}`} className="text-primary-container font-bold hover:underline">{CONTACT_INFO.email}</a>
                  </div>
                </div>
                
                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center text-primary shrink-0">
                    <Phone size={24} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary text-lg mb-2">Voice Comms</h3>
                    <p className="text-muted-foreground mb-2 text-sm leading-relaxed">Mon-Fri, 09:00 - 18:00 IST.</p>
                    <a href={CONTACT_INFO.phoneHref} className="font-bold text-primary hover:underline">{CONTACT_INFO.phone}</a>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center text-primary shrink-0">
                    <MapPin size={24} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary text-lg mb-2">Coordinates</h3>
                    <p className="text-muted-foreground text-sm font-medium">{CONTACT_INFO.address}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-surface-container-lowest ghost-border p-10 md:p-12 rounded-xl shadow-xl relative overflow-hidden"
            >
              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-2xl font-bold text-primary mb-8 tracking-tight">Architectural Review Request</h2>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-primary font-bold text-xs uppercase tracking-wider">Full Name</FormLabel>
                              <FormControl>
                                <Input className="bg-surface border-border h-12 rounded-lg focus-visible:ring-primary-container" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-primary font-bold text-xs uppercase tracking-wider">Work Email</FormLabel>
                                <FormControl>
                                  <Input className="bg-surface border-border h-12 rounded-lg focus-visible:ring-primary-container" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-primary font-bold text-xs uppercase tracking-wider">Phone Number</FormLabel>
                                <FormControl>
                                  <Input className="bg-surface border-border h-12 rounded-lg focus-visible:ring-primary-container" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="businessType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-primary font-bold text-xs uppercase tracking-wider">Primary Vertical</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="bg-surface border-border h-12 rounded-lg focus:ring-primary-container">
                                    <SelectValue placeholder="Select a sector" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="manufacturing">Industrial Manufacturing</SelectItem>
                                  <SelectItem value="retail">Omnichannel Retail</SelectItem>
                                  <SelectItem value="logistics">Logistics & Supply Chain</SelectItem>
                                  <SelectItem value="pharma">Pharmaceuticals</SelectItem>
                                  <SelectItem value="services">Professional Services</SelectItem>
                                  <SelectItem value="other">Other Frameworks</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-primary font-bold text-xs uppercase tracking-wider">System Entropy Details</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Describe the structural bottlenecks and desired architecture..." 
                                  className="bg-surface border-border min-h-[140px] resize-none rounded-lg focus-visible:ring-primary-container" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <button type="submit" className="w-full signature-gradient text-white font-bold rounded-lg h-14 text-lg mt-8 btn-press shadow-md">
                          Transmit RFP
                        </button>
                      </form>
                    </Form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center text-center py-20 h-full"
                  >
                    <div className="w-20 h-20 bg-tertiary-container rounded-full flex items-center justify-center mb-8">
                      <CheckCircle2 className="w-10 h-10 text-on-tertiary-container" />
                    </div>
                    <h3 className="text-3xl font-bold tracking-tight text-primary mb-4">Transmission Received</h3>
                    <p className="text-muted-foreground mb-10 max-w-sm leading-relaxed">
                      Your structural data has been logged. An architect will review your parameters and establish contact within 24 hours.
                    </p>
                    <button 
                      onClick={() => {
                        form.reset();
                        setIsSubmitted(false);
                      }}
                      className="text-primary font-bold text-sm border-b-2 border-primary-container pb-1 hover:text-primary-container transition-colors"
                    >
                      Submit Another RFP
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>

      {content.bodyContent && !legacyBodyContent && (
        <section className="py-16 bg-surface-container-lowest border-t border-border">
          <div className="max-w-[1440px] mx-auto px-8 lg:px-16 max-w-3xl">
            <HtmlSafe html={content.bodyContent} className="prose prose-lg text-muted-foreground leading-relaxed" />
          </div>
        </section>
      )}
    </>
  );
}
