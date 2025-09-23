"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import type { RegisterData } from "@/types";

const schema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
  role: yup
    .string()
    .oneOf(["donor", "hospital-admin"], "Invalid role")
    .required("Role is required"),
  phone: yup.string().required("Phone number is required"),
  address: yup.string().required("Address is required"),
  hospitalName: yup.string().when("role", {
    is: "hospital-admin",
    then: (schema) =>
      schema.required("Hospital name is required for hospital admins"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

export function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: yupResolver(schema),
  });

  const watchRole = watch("role");

  const onSubmit = async (data: RegisterData) => {
    try {
      setLoading(true);
      await registerUser(data);
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Input
            {...register("firstName")}
            placeholder="First Name"
            error={errors.firstName?.message}
          />
        </div>
        <div>
          <Input
            {...register("lastName")}
            placeholder="Last Name"
            error={errors.lastName?.message}
          />
        </div>
      </div>

      <Input
        {...register("email")}
        type="email"
        placeholder="Email Address"
        error={errors.email?.message}
      />

      <Input
        {...register("phone")}
        type="tel"
        placeholder="Phone Number"
        error={errors.phone?.message}
      />

      <Input
        {...register("address")}
        placeholder="Address"
        error={errors.address?.message}
      />

      <div>
        <select
          {...register("role")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Role</option>
          <option value="donor">Donor</option>
          <option value="hospital-admin">Hospital Admin</option>
        </select>
        {errors.role && (
          <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
        )}
      </div>

      {watchRole === "hospital-admin" && (
        <Input
          {...register("hospitalName")}
          placeholder="Hospital Name"
          error={errors.hospitalName?.message}
        />
      )}

      <Input
        {...register("password")}
        type="password"
        placeholder="Password"
        error={errors.password?.message}
      />

      <Input
        {...register("confirmPassword")}
        type="password"
        placeholder="Confirm Password"
        error={errors.confirmPassword?.message}
      />

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating Account..." : "Create Account"}
      </Button>
    </form>
  );
}
