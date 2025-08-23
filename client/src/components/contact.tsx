
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Mail, Phone, MapPin, Clock, Send, Heart, Users } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  type: z.enum(['general', 'prayer', 'ministry', 'youth', 'pastoral'])
});

const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  name: z.string().min(2, 'Name must be at least 2 characters')
});

type ContactFormData = z.infer<typeof contactSchema>;
type NewsletterFormData = z.infer<typeof newsletterSchema>;

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNewsletterSubmitting, setIsNewsletterSubmitting] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema)
  });

  const {
    register: registerNewsletter,
    handleSubmit: handleNewsletterSubmit,
    formState: { errors: newsletterErrors },
    reset: resetNewsletter
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema)
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        toast({
          title: "Message Sent!",
          description: "Thank you for reaching out. We'll get back to you soon.",
        });
        reset();
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onNewsletterSubmit = async (data: NewsletterFormData) => {
    setIsNewsletterSubmitting(true);
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        toast({
          title: "Welcome!",
          description: "You've been added to our newsletter. Stay blessed!",
        });
        resetNewsletter();
      } else {
        throw new Error('Failed to subscribe');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsNewsletterSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-methodist-blue/5 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Get In Touch
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We'd love to hear from you! Whether you have questions, need prayer, 
            or want to get involved, we're here for you.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-methodist-blue flex items-center">
                  <Heart className="mr-2" size={24} />
                  Visit Us
                </CardTitle>
                <CardDescription>
                  Come join our loving church family
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="mr-3 mt-1 text-methodist-blue" size={20} />
                  <div>
                    <p className="font-semibold">Our Location</p>
                    <p className="text-gray-600">
                      [Church Address]<br />
                      [City, State ZIP]
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-start">
                  <Clock className="mr-3 mt-1 text-methodist-blue" size={20} />
                  <div>
                    <p className="font-semibold">Worship Times</p>
                    <p className="text-gray-600">
                      Sunday: 9:00 AM<br />
                      Wednesday Bible Study: 7:00 PM<br />
                      Friday Youth (UMYF): 6:00 PM
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start">
                  <Phone className="mr-3 mt-1 text-methodist-blue" size={20} />
                  <div>
                    <p className="font-semibold">Phone</p>
                    <p className="text-gray-600">[Church Phone Number]</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="mr-3 mt-1 text-methodist-blue" size={20} />
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-gray-600">[Church Email]</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Newsletter Signup */}
            <Card className="border-0 shadow-lg bg-warm-gold/10">
              <CardHeader>
                <CardTitle className="text-2xl text-methodist-blue">
                  Stay Connected
                </CardTitle>
                <CardDescription>
                  Subscribe to our newsletter for updates and inspiration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleNewsletterSubmit(onNewsletterSubmit)} className="space-y-4">
                  <div>
                    <Input
                      placeholder="Your Name"
                      {...registerNewsletter('name')}
                      className={newsletterErrors.name ? 'border-red-500' : ''}
                    />
                    {newsletterErrors.name && (
                      <p className="text-red-500 text-sm mt-1">{newsletterErrors.name.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Input
                      type="email"
                      placeholder="Your Email"
                      {...registerNewsletter('email')}
                      className={newsletterErrors.email ? 'border-red-500' : ''}
                    />
                    {newsletterErrors.email && (
                      <p className="text-red-500 text-sm mt-1">{newsletterErrors.email.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isNewsletterSubmitting}
                    className="w-full bg-warm-gold hover:bg-warm-gold/90 text-black"
                  >
                    {isNewsletterSubmitting ? 'Subscribing...' : 'Subscribe'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-methodist-blue flex items-center">
                  <Send className="mr-2" size={24} />
                  Send Us a Message
                </CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Input
                        placeholder="Your Name *"
                        {...register('name')}
                        className={errors.name ? 'border-red-500' : ''}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <Input
                        type="email"
                        placeholder="Your Email *"
                        {...register('email')}
                        className={errors.email ? 'border-red-500' : ''}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Input
                        type="tel"
                        placeholder="Phone Number (Optional)"
                        {...register('phone')}
                      />
                    </div>

                    <div>
                      <select
                        {...register('type')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-methodist-blue"
                      >
                        <option value="general">General Inquiry</option>
                        <option value="prayer">Prayer Request</option>
                        <option value="ministry">Join a Ministry</option>
                        <option value="youth">Youth Ministry (UMYF)</option>
                        <option value="pastoral">Pastoral Care</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <Input
                      placeholder="Subject *"
                      {...register('subject')}
                      className={errors.subject ? 'border-red-500' : ''}
                    />
                    {errors.subject && (
                      <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
                    )}
                  </div>

                  <div>
                    <Textarea
                      placeholder="Your Message *"
                      rows={6}
                      {...register('message')}
                      className={errors.message ? 'border-red-500' : ''}
                    />
                    {errors.message && (
                      <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    size="lg"
                    className="w-full bg-methodist-blue hover:bg-methodist-blue/90 text-white py-3 text-lg"
                  >
                    <Send className="mr-2" size={20} />
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
