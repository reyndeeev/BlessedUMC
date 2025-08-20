import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { MapPin, Phone, Mail, Clock, Map, Send } from "lucide-react";
import type { InsertContactMessage } from "@shared/schema";

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const contactMutation = useMutation({
    mutationFn: async (data: InsertContactMessage) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you as soon as possible.",
      });
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to send message",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    contactMutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <section id="contact" className="py-20 bg-black/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="font-heading text-4xl font-bold text-white mb-6">
              Get in Touch
            </h2>
            <p className="text-lg text-gray-200 mb-8 leading-relaxed">
              We'd love to hear from you! Whether you're planning a visit, have
              questions about our ministries, or need pastoral care, we're here
              to help.
            </p>

            <div className="space-y-6 mb-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-methodist-blue rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-white" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-white mb-1">
                    Address
                  </h3>
                  <p className="text-gray-200">
                    69 Don Placido Campos Ave., San Jose
                    <br />
                    Dasmariñas, Cavite
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-soft-green rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="text-white" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-white mb-1">
                    Email
                  </h3>
                  <p className="text-gray-200">iamblessedchurch@gmail.com</p>
                </div>
              </div>
            </div>

            {/* Google Maps Embed */}
            <div className="rounded-xl overflow-hidden h-64">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4585.426065009781!2d120.92917507573804!3d14.331747283601128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397d4fcea32b8f5%3A0xaacc0220724690e7!2sBlessed%20United%20Methodist%20Church!5e1!3m2!1sen!2sus!4v1755699777991!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Blessed United Methodist Church Location"
              />
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-50 rounded-xl p-8">
            <h3 className="font-heading text-2xl font-bold text-methodist-blue mb-6">
              Send us a Message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="firstName"
                    className="text-sm font-medium text-methodist-blue mb-2"
                  >
                    First Name *
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    placeholder="Your first name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-methodist-blue focus:border-transparent outline-none transition-all"
                    required
                    data-testid="input-first-name"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="lastName"
                    className="text-sm font-medium text-methodist-blue mb-2"
                  >
                    Last Name *
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    placeholder="Your last name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-methodist-blue focus:border-transparent outline-none transition-all"
                    required
                    data-testid="input-last-name"
                  />
                </div>
              </div>

              <div>
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-methodist-blue mb-2"
                >
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-methodist-blue focus:border-transparent outline-none transition-all"
                  required
                  data-testid="input-email"
                />
              </div>

              <div>
                <Label
                  htmlFor="phone"
                  className="text-sm font-medium text-methodist-blue mb-2"
                >
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="(555) 123-4567"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-methodist-blue focus:border-transparent outline-none transition-all"
                  data-testid="input-phone"
                />
              </div>

              <div>
                <Label
                  htmlFor="subject"
                  className="text-sm font-medium text-methodist-blue mb-2"
                >
                  Subject *
                </Label>
                <Select
                  value={formData.subject}
                  onValueChange={(value) => handleInputChange("subject", value)}
                >
                  <SelectTrigger
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-methodist-blue focus:border-transparent outline-none transition-all"
                    data-testid="select-subject"
                  >
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Question</SelectItem>
                    <SelectItem value="visit">Planning a Visit</SelectItem>
                    <SelectItem value="ministry">
                      Ministry Information
                    </SelectItem>
                    <SelectItem value="pastoral">Pastoral Care</SelectItem>
                    <SelectItem value="event">Event Information</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label
                  htmlFor="message"
                  className="text-sm font-medium text-methodist-blue mb-2"
                >
                  Message *
                </Label>
                <Textarea
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  placeholder="Please share your message or question..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-methodist-blue focus:border-transparent outline-none transition-all resize-none"
                  required
                  data-testid="textarea-message"
                />
              </div>

              <Button
                type="submit"
                disabled={contactMutation.isPending}
                className="w-full bg-methodist-blue text-white py-3 px-6 rounded-lg font-medium hover:bg-opacity-90 transition-all transform hover:scale-[1.02]"
                data-testid="button-submit-contact"
              >
                <Send className="mr-2 h-4 w-4" />
                {contactMutation.isPending ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}