import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

interface EmailSignupStepProps {
  onSubmit: (values: z.infer<typeof emailSchema>) => Promise<void>;
}

const EmailSignupStep = ({ onSubmit }: EmailSignupStepProps) => {
  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">What's your email?</h2>
        <p className="mt-2 text-lg text-gray-600">
          We'll use this to create your account
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Enter your email"
                    type="email"
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

export default EmailSignupStep;