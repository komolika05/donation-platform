"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { ArrowLeft, Upload, X, Trash2 } from "lucide-react";
import Link from "next/link";
import { mockData } from "@/lib/api-client";
import type { Case } from "@/types";

const schema = yup.object({
  title: yup
    .string()
    .required("Title is required")
    .min(5, "Title must be at least 5 characters"),
  description: yup
    .string()
    .required("Description is required")
    .min(20, "Description must be at least 20 characters"),
  cost: yup
    .number()
    .required("Cost is required")
    .min(1, "Cost must be greater than 0"),
  currency: yup.string().oneOf(["USD", "CAD"]).required("Currency is required"),
  status: yup
    .string()
    .oneOf(["active", "completed", "cancelled"])
    .required("Status is required"),
});

type CaseFormData = yup.InferType<typeof schema>;

export default function EditCasePage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const caseId = params.id as string;

  const [caseData, setCaseData] = useState<Case | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CaseFormData>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (!user || user.role !== "hospital-admin") {
      router.push("/login");
      return;
    }

    // Load case data - using mock data for now
    const foundCase = mockData.cases.find((c) => c._id === caseId);
    if (foundCase) {
      setCaseData(foundCase);
      setImagePreview(foundCase.photoUrl || null);
      reset({
        title: foundCase.title,
        description: foundCase.description,
        cost: foundCase.cost,
        currency: foundCase.currency as "USD" | "CAD",
        status: foundCase.status as "active" | "completed" | "cancelled",
      });
    }
  }, [user, router, caseId, reset]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const onSubmit = async (data: CaseFormData) => {
    if (!user || user.role !== "hospital-admin" || !caseData) {
      toast.error("Unauthorized");
      return;
    }

    try {
      setIsLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In a real app, you would update the case
      console.log("Updating case:", {
        ...data,
        id: caseId,
        image: selectedImage,
      });

      toast.success("Case updated successfully!");
      router.push(`/hospital-admin/cases/${caseId}`);
    } catch (error: any) {
      console.error("Case update error:", error);
      toast.error(error.message || "Failed to update case");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCase = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this case? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setIsLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Case deleted successfully!");
      router.push("/hospital-admin");
    } catch (error: any) {
      console.error("Case deletion error:", error);
      toast.error(error.message || "Failed to delete case");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || user.role !== "hospital-admin" || !caseData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/hospital-admin/cases/${caseId}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Case Details
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Case</h1>
              <p className="text-gray-600 mt-1">
                Update case information and settings
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleDeleteCase}
              className="text-red-600 border-red-600 hover:bg-red-50 bg-transparent"
              disabled={isLoading}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Case
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Case Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Title */}
              <Input
                label="Case Title"
                placeholder="Enter a descriptive title for the case"
                error={errors.title?.message}
                {...register("title")}
              />

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  {...register("description")}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Provide detailed information about the medical case..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Cost, Currency, and Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Required Amount"
                  type="number"
                  step="0.01"
                  min="1"
                  placeholder="0.00"
                  error={errors.cost?.message}
                  {...register("cost", { valueAsNumber: true })}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Currency
                  </label>
                  <select
                    {...register("currency")}
                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="CAD">CAD ($)</option>
                  </select>
                  {errors.currency && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.currency.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    {...register("status")}
                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  {errors.status && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.status.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Case Image
                </label>

                {!imagePreview ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">
                      Upload an image to help donors connect with the case
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                    >
                      Choose Image
                    </label>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Case preview"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Case Stats (Read-only) */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-3">
                  Case Statistics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Raised Amount:</span>
                    <p className="font-medium text-green-600">
                      ${caseData.raisedAmount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Total Donations:</span>
                    <p className="font-medium">{caseData.donationsCount}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Progress:</span>
                    <p className="font-medium">
                      {Math.round(
                        (caseData.raisedAmount / caseData.cost) * 100
                      )}
                      %
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-4 pt-6">
                <Link href={`/hospital-admin/cases/${caseId}`}>
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  loading={isLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? "Updating Case..." : "Update Case"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
