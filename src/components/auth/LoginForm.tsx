import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

const loginSchema = z.object({
  identifier: z.string().min(1, { message: "Email or phone is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSubmit?: (values: LoginFormValues) => void;
  onForgotPassword?: () => void;
  onRegister?: () => void;
  isLoading?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit = () => {},
  onForgotPassword = () => {},
  onRegister = () => {},
  isLoading = false,
}) => {
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const handleSubmit = (values: LoginFormValues) => {
    onSubmit(values);
  };

  if (showForgotPassword) {
    return <ForgotPasswordForm onCancel={() => setShowForgotPassword(false)} />;
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold text-center mb-6">Welcome Back</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="identifier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email or Phone</FormLabel>
                <FormControl>
                  <Input
                    placeholder="example@email.com or +971 XX XXX XXXX"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between items-center">
            <Button
              type="button"
              variant="link"
              className="px-0"
              onClick={() => setShowForgotPassword(true)}
            >
              Forgot Password?
            </Button>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Button
                type="button"
                variant="link"
                className="p-0"
                onClick={onRegister}
              >
                Register
              </Button>
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
};

interface ForgotPasswordFormProps {
  onSubmit?: (email: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onSubmit = () => {},
  onCancel,
  isLoading = false,
}) => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>
      <p className="text-gray-600 mb-4 text-center">
        Enter your email address and we'll send you a link to reset your
        password.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
            required
          />
        </div>

        <div className="flex justify-between pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Back to Login
          </Button>
          <Button type="submit" disabled={isLoading || !email}>
            {isLoading ? "Sending..." : "Send Reset Link"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
