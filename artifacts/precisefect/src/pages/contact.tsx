import { Seo } from "@/components/seo";
import { Button } from "@/components/ui/button";
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

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  businessType: z.string().min(1, "Please select an industry"),
  message: z.string().min(10, "Please provide some details about your needs")
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);

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
    // Simulate API call
    console.log("Form data:", data);
    setTimeout(() => setIsSubmitted(true), 800);
  };

  return (
    <>
      <Seo 
        title="Contact Us | Precisefect Consulting" 
        description="Schedule a discovery call with Precisefect to discuss your ERP implementation or business automation needs."
      />
      
      <section className="py-24 md:py-32 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
            
            {/* Contact Info */}
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">Let's build the system.</h1>
              <p className="text-xl text-muted-foreground mb-12 max-w-md">
                Tell us about your current operational bottlenecks. Our principal architects review every inquiry directly.
              </p>

              <div className="space-y-10">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary text-lg">Email Us</h3>
                    <p className="text-muted-foreground mb-1">For general inquiries and RFPs.</p>
                    <a href="mailto:hello@precisefect.com" className="text-secondary font-medium hover:underline">hello@precisefect.com</a>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary text-lg">Call Us</h3>
                    <p className="text-muted-foreground mb-1">Mon-Fri, 9am - 6pm EST.</p>
                    <p className="font-medium text-foreground">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary text-lg">Offices</h3>
                    <p className="text-muted-foreground mb-1">San Francisco, CA</p>
                    <p className="text-muted-foreground">Bangalore, IN</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="bg-card border border-border p-8 md:p-12 rounded-3xl shadow-sm relative overflow-hidden">
              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-2xl font-bold text-primary mb-8">Schedule a Discovery Call</h2>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-foreground">Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Jane Doe" className="bg-background h-12" {...field} />
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
                                <FormLabel className="text-foreground">Work Email</FormLabel>
                                <FormControl>
                                  <Input placeholder="jane@company.com" className="bg-background h-12" {...field} />
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
                                <FormLabel className="text-foreground">Phone Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="+1 (555) 000-0000" className="bg-background h-12" {...field} />
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
                              <FormLabel className="text-foreground">Primary Industry</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="bg-background h-12">
                                    <SelectValue placeholder="Select an industry" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                                  <SelectItem value="retail">Retail & E-commerce</SelectItem>
                                  <SelectItem value="logistics">Logistics & Supply Chain</SelectItem>
                                  <SelectItem value="pharma">Pharmaceuticals</SelectItem>
                                  <SelectItem value="services">Professional Services</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
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
                              <FormLabel className="text-foreground">How can we help?</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Briefly describe your current systems and operational bottlenecks..." 
                                  className="bg-background min-h-[120px] resize-none" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground h-14 text-lg rounded-xl mt-4">
                          Request Consultation
                        </Button>
                      </form>
                    </Form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center text-center py-16 h-full"
                  >
                    <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle2 className="w-10 h-10 text-secondary" />
                    </div>
                    <h3 className="text-2xl font-bold text-primary mb-4">Request Received</h3>
                    <p className="text-muted-foreground mb-8 max-w-xs">
                      Thank you for reaching out. One of our principal architects will review your details and contact you within 24 hours to schedule a call.
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        form.reset();
                        setIsSubmitted(false);
                      }}
                      className="rounded-full"
                    >
                      Send another message
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
