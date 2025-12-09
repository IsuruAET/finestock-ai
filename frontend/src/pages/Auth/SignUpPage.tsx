import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import {
  registerSchema,
  type RegisterFormData,
} from "../../schemas/authSchemas";
import type { AuthError } from "../../types/auth";
import { useRegisterMutation } from "../../api/services/auth-service";

const SignUpPage = () => {
  const registerMutation = useRegisterMutation();

  const { handleSubmit, control } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
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
          <h2 className="text-3xl font-bold text-center text-gray-900">
            Create an Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join us today by entering your details below
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            name="fullName"
            control={control}
            label="Full Name"
            placeholder="John Doe"
            type="text"
            disabled={registerMutation.isPending}
            required
          />

          <Input
            name="email"
            control={control}
            label="Email Address"
            placeholder="john@example.com"
            type="email"
            disabled={registerMutation.isPending}
            required
          />

          <Input
            name="password"
            control={control}
            label="Password"
            placeholder="Min 8 characters with uppercase, lowercase, and number"
            type="password"
            disabled={registerMutation.isPending}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={registerMutation.isPending}
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? "Creating account..." : "Sign Up"}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-blue-900 hover:text-blue-800"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
