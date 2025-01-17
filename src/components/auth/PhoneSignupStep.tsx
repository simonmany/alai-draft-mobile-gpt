import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const phoneSchema = z.object({
  phone: z.string().min(10, "Please enter a valid phone number"),
});

interface PhoneSignupStepProps {
  onSubmit: (values: z.infer<typeof phoneSchema>) => Promise<void>;
}

const PhoneSignupStep = ({ onSubmit }: PhoneSignupStepProps) => {
  const form = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phone: "",
    },
  });

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">What's your phone number?</h2>
        <p className="mt-2 text-lg text-gray-600">
          We'll use this to keep in touch
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Enter your phone number"
                    type="tel"
                    className="text-lg h-12"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full text-lg h-12">
            Continue
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default PhoneSignupStep;