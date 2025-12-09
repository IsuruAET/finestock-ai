import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { loginSchema, type LoginFormData } from "../../schemas/authSchemas";
import type { AuthError } from "../../types/auth";
import { useLoginMutation } from "../../api/services/auth-service";

const LoginPage = () => {
  const navigate = useNavigate();
  const loginMutation = useLoginMutation();

  const { handleSubmit, control } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await loginMutation.mutateAsync(data);
      if (response.accessToken) {
        toast.success("Login successful!");
        navigate("/dashboard");
      }
    } catch (error: unknown) {
      const message =
        (error as AuthError | undefined)?.message ||
        "Login failed. Please try again.";
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="text-3xl font-bold text-center text-gray-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            name="email"
            control={control}
            label="Email Address"
            placeholder="john@example.com"
            type="email"
            disabled={loginMutation.isPending}
            required
          />

          <Input
            name="password"
            control={control}
            label="Password"
            placeholder="Enter your password"
            type="password"
            disabled={loginMutation.isPending}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={loginMutation.isPending}
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-blue-900 hover:text-blue-800"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
