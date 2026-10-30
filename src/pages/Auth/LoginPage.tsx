import { useState } from "react";
import { Button, Card, CardBody } from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Boxes } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FormInput } from "../../components/form";
import { useAuth } from "../../context/AuthContext";
import { APP_NAME } from "../../globals/apiConfig";
import { loginSchema, type LoginFormValues } from "../../schemas/auth.schema";

/**
 * The sign-in page. A good first example of a form:
 *   1. useForm() with a zod schema holds the values and the validation
 *   2. <FormInput control={control} name="..."> fields show their own errors
 *   3. handleSubmit(onSubmit) runs onSubmit only when every field is valid
 */
export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const { control, handleSubmit } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setSubmitting(true);
    const ok = await login(values.email, values.password);
    setSubmitting(false);
    if (ok) navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardBody className="gap-5 p-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <Boxes className="text-primary" size={36} />
            <h1 className="text-xl font-semibold">{APP_NAME}</h1>
            <p className="text-sm text-default-500">Sign in to continue</p>
          </div>

          <form noValidate className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
            <FormInput control={control} name="email" label="Email" type="email" autoComplete="username" />
            <FormInput control={control} name="password" label="Password" type="password" autoComplete="current-password" />
            <Button type="submit" color="primary" isLoading={submitting} className="mt-2">
              Sign in
            </Button>
          </form>

          {/* The demo account made by `php artisan migrate --seed` in the API. Remove this for real use. */}
          <p className="text-center text-xs text-default-400">Demo: admin@example.com / password</p>
        </CardBody>
      </Card>
    </div>
  );
}
