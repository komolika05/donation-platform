"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { User, Mail, MapPin, Globe, Calendar, Shield } from "lucide-react";
import { getInitials, formatDate } from "@/lib/utils";

const profileSchema = yup.object({
  name: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),
  address: yup.string().optional(),
  country: yup.string().optional(),
});

const passwordSchema = yup.object({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: yup
    .string()
    .required("New password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("newPassword")], "Passwords must match"),
});

type ProfileFormData = yup.InferType<typeof profileSchema>;
type PasswordFormData = yup.InferType<typeof passwordSchema>;

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const profileForm = useForm<ProfileFormData>({
    resolver: yupResolver(profileSchema),
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: yupResolver(passwordSchema),
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      profileForm.reset({
        name: user.name,
        address: user.address || "",
        country: user.country || "",
      });
    }
  }, [user, loading, router, profileForm]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const onUpdateProfile = async (data: ProfileFormData) => {
    try {
      setIsUpdatingProfile(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Updating profile:", data);
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const onUpdatePassword = async (data: PasswordFormData) => {
    try {
      setIsUpdatingPassword(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Updating password");
      toast.success("Password updated successfully!");
      passwordForm.reset();
    } catch (error: any) {
      console.error("Password update error:", error);
      toast.error(error.message || "Failed to update password");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-1">
            Manage your account information and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-semibold text-blue-600">
                      {getInitials(user.name)}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {user.name}
                  </h3>
                  <p className="text-gray-500 mb-4">{user.email}</p>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-center">
                      <Shield className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="capitalize text-gray-600">
                        {user.role}
                      </span>
                    </div>

                    {user.address && (
                      <div className="flex items-center justify-center">
                        <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-600">{user.address}</span>
                      </div>
                    )}

                    {user.country && (
                      <div className="flex items-center justify-center">
                        <Globe className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-600">{user.country}</span>
                      </div>
                    )}

                    {user.createdAt && (
                      <div className="flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-600">
                          Joined {formatDate(user.createdAt)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={profileForm.handleSubmit(onUpdateProfile)}
                  className="space-y-4"
                >
                  <Input
                    label="Full Name"
                    error={profileForm.formState.errors.name?.message}
                    {...profileForm.register("name")}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="email"
                        value={user.email}
                        disabled
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Email address cannot be changed
                    </p>
                  </div>

                  <Input
                    label="Address"
                    placeholder="Enter your address"
                    error={profileForm.formState.errors.address?.message}
                    {...profileForm.register("address")}
                  />

                  <Input
                    label="Country"
                    placeholder="Enter your country"
                    error={profileForm.formState.errors.country?.message}
                    {...profileForm.register("country")}
                  />

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      loading={isUpdatingProfile}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isUpdatingProfile ? "Updating..." : "Update Profile"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Change Password */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Change Password
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={passwordForm.handleSubmit(onUpdatePassword)}
                  className="space-y-4"
                >
                  <Input
                    label="Current Password"
                    type="password"
                    error={
                      passwordForm.formState.errors.currentPassword?.message
                    }
                    {...passwordForm.register("currentPassword")}
                  />

                  <Input
                    label="New Password"
                    type="password"
                    error={passwordForm.formState.errors.newPassword?.message}
                    {...passwordForm.register("newPassword")}
                  />

                  <Input
                    label="Confirm New Password"
                    type="password"
                    error={
                      passwordForm.formState.errors.confirmPassword?.message
                    }
                    {...passwordForm.register("confirmPassword")}
                  />

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      loading={isUpdatingPassword}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isUpdatingPassword ? "Updating..." : "Update Password"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Account Status */}
            <Card>
              <CardHeader>
                <CardTitle>Account Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Email Verification:</span>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        user.isEmailVerified
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {user.isEmailVerified ? "Verified" : "Pending"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Account Type:</span>
                    <span className="capitalize font-medium text-gray-900">
                      {user.role.replace("-", " ")}
                    </span>
                  </div>

                  {user.createdAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Member Since:</span>
                      <span className="font-medium text-gray-900">
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
