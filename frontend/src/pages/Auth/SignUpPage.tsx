import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Checkbox from "../../components/ui/Checkbox";
import FSLink from "../../components/ui/FSLink";
import {
  registerSchema,
  type RegisterFormData,
} from "../../schemas/authSchemas";
import type { AuthError } from "../../types/auth";
import { useRegisterMutation } from "../../api/services/auth-service";
import { FileText, Mail, Lock, User, LogIn } from "lucide-react";

const SignUpPage = () => {
  const registerMutation = useRegisterMutation();

  const { handleSubmit, control } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const response = await registerMutation.mutateAsync(data);
      if (response.accessToken) {
        toast.success("Account created successfully!");
      }
    } catch (error: unknown) {
      const message =
        (error as AuthError | undefined)?.message ||
        "Registration failed. Please try again.";
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <div className="w-12 h-12 bg-linear-to-r from-blue-950 to-blue-900 rounded-xl mx-auto mb-6 flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-center text-gray-900">
            Create an Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join Supply Request Generator today
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            name="fullName"
            icon={<User className="w-4 h-4 text-gray-500" />}
            control={control}
            label="Full Name"
            placeholder="John Doe"
            type="text"
            disabled={registerMutation.isPending}
            required
          />

          <Input
            name="email"
            icon={<Mail className="w-4 h-4 text-gray-500" />}
            control={control}
            label="Email Address"
            placeholder="john@example.com"
            type="email"
            disabled={registerMutation.isPending}
            required
          />

          <Input
            name="password"
            icon={<Lock className="w-4 h-4 text-gray-500" />}
            control={control}
            label="Password"
            placeholder="Create a strong password"
            type="password"
            disabled={registerMutation.isPending}
            required
          />

          <Input
            name="confirmPassword"
            icon={<Lock className="w-4 h-4 text-gray-500" />}
            control={control}
            label="Confirm Password"
            placeholder="Re-enter your password"
            type="password"
            disabled={registerMutation.isPending}
            required
          />

          <Checkbox
            name="acceptTerms"
            control={control}
            label={
              <>
                I agree to the{" "}
                <FSLink
                  href="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  Terms of Service
                </FSLink>{" "}
                and{" "}
                <FSLink
                  href="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  Privacy Policy
                </FSLink>
              </>
            }
            disabled={registerMutation.isPending}
            required
            className="ml-1"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={registerMutation.isPending}
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? (
              "Creating account..."
            ) : (
              <>
                Sign Up <LogIn className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            Already have an account? <FSLink to="/login">Sign in</FSLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
