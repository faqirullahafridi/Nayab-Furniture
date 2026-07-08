import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateInquiry } from "@workspace/api-client-react";
import { MapPin, Phone, Mail, Clock, Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SITE, whatsappUrl } from "@/lib/site";
import { LazyMap } from "@/components/LazyMap";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  email: z.string().email("Please enter a valid email").optional().or(z.literal("")),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export default function Contact() {
  const { toast } = useToast();
  const createInquiry = useCreateInquiry();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createInquiry.mutate(
      { data: values },
      {
        onSuccess: () => {
          setIsSubmitted(true);
          toast({
            title: "Message Sent",
            description: "Thank you for reaching out. We will get back to you shortly.",
          });
          form.reset();
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Something went wrong. Please try again or reach us via WhatsApp.",
          });
        }
      }
    );
  }

  return (
    <div className="flex-1 w-full bg-background min-h-screen pb-20">
      {/* Page Header */}
      <div className="bg-card py-16 border-b border-border">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-card-foreground mb-4">Contact Us</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Visit our showroom or drop us a message. We're here to help you craft your perfect home.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Contact Info & Map */}
          <div className="space-y-10">
            <div>
              <h2 className="text-3xl font-serif font-bold mb-6">Visit Our Showroom</h2>
              <p className="text-muted-foreground mb-8">
                Experience the warmth, texture, and undeniable quality of our solid wood furniture in person. Our design consultants are ready to assist you.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Address</h4>
                    <p className="text-muted-foreground">{SITE.address.line1}, <br />{SITE.address.line2}, <br />{SITE.address.region}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Phone / WhatsApp</h4>
                    <a href={whatsappUrl()} className="text-primary hover:underline font-medium text-lg">{SITE.whatsappDisplay}</a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Email</h4>
                    <a href={`mailto:${SITE.email}`} className="text-muted-foreground hover:text-primary transition-colors">{SITE.email}</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Business Hours</h4>
                    <p className="text-muted-foreground">Monday - Sunday<br/>10:00 AM - 9:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <LazyMap />
          </div>

          {/* Contact Form */}
          <div className="bg-card border border-border rounded-sm p-8 shadow-sm">
            <h3 className="text-2xl font-serif font-bold mb-6">Send us an Inquiry</h3>
            
            {isSubmitted ? (
              <div className="h-[400px] flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in">
                <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mb-2">
                  <Send className="h-8 w-8 ml-1" />
                </div>
                <h4 className="text-2xl font-serif font-bold">Message Sent!</h4>
                <p className="text-muted-foreground max-w-sm">
                  Thank you for your interest in Nayab Furniture. We have received your message and will contact you shortly.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setIsSubmitted(false)}
                >
                  Send another message
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" className="bg-background" {...field} />
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
                        <FormLabel>Phone Number *</FormLabel>
                        <FormControl>
                          <Input placeholder="0311 1234567" className="bg-background" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="john@example.com" type="email" className="bg-background" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Message *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="I'm interested in a custom dining table..." 
                            className="bg-background min-h-[150px] resize-none" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full h-12 text-base font-medium"
                    disabled={createInquiry.isPending}
                  >
                    {createInquiry.isPending ? (
                      <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Sending...</>
                    ) : (
                      <><Send className="mr-2 h-4 w-4" /> Send Message</>
                    )}
                  </Button>
                </form>
              </Form>
            )}

            <div className="mt-8 pt-8 border-t border-border">
              <p className="text-sm text-center text-muted-foreground">
                For immediate assistance, please use WhatsApp:
              </p>
              <a 
                href="https://api.whatsapp.com/send?phone=03111088001" 
                target="_blank" rel="noopener noreferrer"
                className="mt-4 flex items-center justify-center gap-2 w-full bg-[#25D366] text-white hover:bg-[#20bd5a] py-3 rounded-sm font-medium transition-colors"
              >
                <Phone className="h-5 w-5" /> Chat on WhatsApp
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
