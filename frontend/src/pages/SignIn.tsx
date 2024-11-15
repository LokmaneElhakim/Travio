import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { useAppContext } from "../contexts/AppContext";
import * as apiClient from "../api-client";
import { Link, useLocation, useNavigate } from "react-router-dom";

export type SignInFormData = { email: string; password: string };

const SignIn = () => {
  const queryClient = useQueryClient();
  const { showToast } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<SignInFormData>();
  const mutation = useMutation(apiClient.signIn, {
    onSuccess: async () => {
      showToast({ type: "SUCCESS", message: "Welcome Back", icon: "👋" });
      await queryClient.invalidateQueries("validateToken");
      navigate(location.state?.from?.pathname || "/");
      // navigate("/");
    },
    onError: async () => {
      showToast({
        type: "ERROR",
        message: "Invalid credentials",
      });
    },
  });
  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });
  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      <h2 className="text-3xl font-bold">Sign In</h2>
      <label className="text-gray-700 text-sm font-bold flex-1">
        Email
        <input
          type="email"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("email", { required: "This field is required" })}
        ></input>
        {errors.email && (
          <span className="text-red-500">{errors.email.message}</span>
        )}
      </label>
      <label className="text-gray-700 text-sm font-bold flex-1">
        Password
        <input
          type="password"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("password", {
            required: "This field is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
        ></input>
        {errors.password && (
          <span className="text-red-500">{errors.password.message}</span>
        )}
      </label>

      <span className="flex items-center justify-between">
        <span className="text-sm">
          Not Registered?{" "}
          <Link className="underline text-blue-600 ml-1" to="/register">
            Create an account here
          </Link>
        </span>
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-8 rounded-sm font-bold hover:bg-blue-500 text-xl"
          disabled={isSubmitting}
        >
          {isSubmitting && (
            <span className="spinner-border spinner-border-sm mr-1"></span>
          )}
          Login
        </button>
      </span>
    </form>
  );
};

export default SignIn;
