import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import LoginForm from "./LoginForm";
import RegistrationForm from "./RegistrationForm";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../ui/use-toast";

type AuthMode = "login" | "register" | "forgot-password";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: AuthMode;
  onLoginSuccess?: () => void;
  onRegisterSuccess?: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = "login",
  onLoginSuccess = () => {},
  onRegisterSuccess = () => {},
}) => {
  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const { login, register, resetPassword, isLoading } = useAuth();
  const { toast } = useToast();

  const handleLogin = async (values: {
    identifier: string;
    password: string;
  }) => {
    const result = await login(values.identifier, values.password);

    if (result.error) {
      toast({
        title: "Login failed",
        description: result.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      onLoginSuccess();
      onClose();
    }
  };

  const handleRegistration = async (values: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) => {
    const result = await register(
      values.name,
      values.email,
      values.phone,
      values.password,
    );

    if (result.error) {
      toast({
        title: "Registration failed",
        description: result.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Registration successful",
        description: "Your account has been created.",
      });
      onRegisterSuccess();
      onClose();
    }
  };

  const handleForgotPassword = async (email: string) => {
    const result = await resetPassword(email);

    if (result.error) {
      toast({
        title: "Password reset failed",
        description: result.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Password reset email sent",
        description:
          "Please check your email for instructions to reset your password.",
      });
      setMode("login");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        {mode === "login" ? (
          <LoginForm
            onSubmit={handleLogin}
            onForgotPassword={() => setMode("forgot-password")}
            onRegister={() => setMode("register")}
            isLoading={isLoading}
          />
        ) : mode === "register" ? (
          <RegistrationForm
            onSubmit={handleRegistration}
            onCancel={() => setMode("login")}
            isLoading={isLoading}
          />
        ) : (
          <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold text-center mb-6">
              Reset Password
            </h2>
            <p className="text-gray-600 mb-4 text-center">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const email = (e.target as HTMLFormElement).email.value;
                handleForgotPassword(email);
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="example@email.com"
                  required
                />
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                  onClick={() => setMode("login")}
                  disabled={isLoading}
                >
                  Back to Login
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </button>
              </div>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
