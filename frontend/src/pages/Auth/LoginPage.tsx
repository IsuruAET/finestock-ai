import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import FSLink from "../../components/ui/FSLink";
import { loginSchema, type LoginFormData } from "../../schemas/authSchemas";
import type { AuthError } from "../../types/auth";
import { useLoginMutation } from "../../api/services/auth-service";
import { ArrowRight, FileText, Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
      }
    } catch (error: unknown) {
      const message =
        (error as AuthError | undefined)?.message ||
        "Login failed. Please try again.";
      toast.error(message);
    }
  };

  return (
    <div className="page-container">
      <div className="page-card">
        <div>
          <div className="page-logo" onClick={() => navigate("/")}>
            <FileText className="w-6 h-6 text-white" />
          </div>
          <h2 className="page-title">Login to your account</h2>
          <p className="page-subtitle">
            Welcome back to Supply Request Generator
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5 sm:space-y-6"
        >
          <Input
            name="email"
            icon={<Mail className="w-4 h-4 text-gray-500" />}
            control={control}
            label="Email Address"
            placeholder="john@example.com"
            type="email"
            disabled={loginMutation.isPending}
            required
          />

          <Input
            name="password"
            icon={<Lock className="w-4 h-4 text-gray-500" />}
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
            className="btn-primary w-full mt-6"
            isLoading={loginMutation.isPending}
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? (
              "Signing in..."
            ) : (
              <>
                Sign In <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account? <FSLink to="/signup">Sign up</FSLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
