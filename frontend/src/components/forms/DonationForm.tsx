"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";
import toast from "react-hot-toast";
import type { CaseReport } from "@/types";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const schema = yup.object({
  amount: yup
    .number()
    .min(1, "Minimum donation is $1")
    .max(100000, "Maximum donation is $100,000")
    .required("Amount is required"),
  currency: yup.string().oneOf(["USD", "CAD"]).required("Currency is required"),
  type: yup
    .string()
    .oneOf(["sponsorship", "20kids20", "general"])
    .required("Donation type is required"),
  caseReportId: yup.string().when("type", {
    is: (type: string) => type === "sponsorship" || type === "20kids20",
    then: (schema) => schema.required("Please select a case to sponsor"),
    otherwise: (schema) => schema.optional(),
  }),
  paymentMethod: yup
    .string()
    .oneOf(["stripe", "paypal"])
    .required("Payment method is required"),
});

type DonationFormData = yup.InferType<typeof schema>;

const DonationFormContent = () => {
  const { user } = useAuth();
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [availableCases, setAvailableCases] = useState<CaseReport[]>([]);
  const [selectedCase, setSelectedCase] = useState<CaseReport | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<DonationFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      currency: "USD",
      type: "general",
      paymentMethod: "stripe",
    },
  });

  const watchType = watch("type");
  const watchAmount = watch("amount");
  const watchCurrency = watch("currency");

  // Fetch available cases when type changes
  useEffect(() => {
    if (watchType === "sponsorship" || watchType === "20kids20") {
      fetchAvailableCases(watchType);
    }
  }, [watchType]);

  const fetchAvailableCases = async (fundType: string) => {
    try {
      const response = await api.get(
        `/donations/available-cases?fundType=${fundType}`
      );
      if (response.data.success) {
        setAvailableCases(response.data.data.cases);
      }
    } catch (error) {
      console.error("Error fetching available cases:", error);
    }
  };

  const onSubmit = async (data: DonationFormData) => {
    if (!user) {
      toast.error("Please login to make a donation");
      return;
    }

    if (!stripe || !elements) {
      toast.error("Payment system not ready");
      return;
    }

    try {
      setIsLoading(true);

      // Create payment intent
      const paymentIntentResponse = await api.post(
        "/donations/create-payment-intent",
        {
          amount: data.amount,
          currency: data.currency,
          type: data.type,
          caseReportId: data.caseReportId,
        }
      );

      const { clientSecret } = paymentIntentResponse.data.data;

      // Confirm payment with Stripe
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("Card element not found");
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: user.name,
              email: user.email,
            },
          },
        }
      );

      if (error) {
        throw new Error(error.message);
      }

      if (paymentIntent?.status === "succeeded") {
        // Confirm donation on backend
        await api.post("/donations/confirm-stripe", {
          paymentIntentId: paymentIntent.id,
        });

        toast.success("Donation completed successfully!");

        // Reset form or redirect
        window.location.href = "/dashboard";
      }
    } catch (error: any) {
      console.error("Donation error:", error);
      toast.error(error.message || "Donation failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Make a Donation</CardTitle>
          <CardDescription>
            Support our mission by making a secure donation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Donation Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Donation Type
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  {
                    value: "general",
                    label: "General Fund",
                    description: "Support our overall mission",
                  },
                  {
                    value: "sponsorship",
                    label: "Sponsorship",
                    description: "Sponsor a specific case",
                  },
                  {
                    value: "20kids20",
                    label: "20 Kids 20",
                    description: "Support our 20 Kids 20 program",
                  },
                ].map((option) => (
                  <label key={option.value} className="relative">
                    <input
                      type="radio"
                      value={option.value}
                      {...register("type")}
                      className="sr-only peer"
                    />
                    <div className="p-4 border border-gray-200 rounded-lg cursor-pointer peer-checked:border-blue-500 peer-checked:bg-blue-50 hover:bg-gray-50 transition-colors">
                      <div className="font-medium text-gray-900">
                        {option.label}
                      </div>
                      <div className="text-sm text-gray-500">
                        {option.description}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.type.message}
                </p>
              )}
            </div>

            {/* Case Selection */}
            {(watchType === "sponsorship" || watchType === "20kids20") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Case to Sponsor
                </label>
                <div className="grid gap-4">
                  {availableCases.map((caseReport) => (
                    <label key={caseReport.id} className="relative">
                      <input
                        type="radio"
                        value={caseReport.id}
                        {...register("caseReportId")}
                        className="sr-only peer"
                        onChange={() => setSelectedCase(caseReport)}
                      />
                      <div className="p-4 border border-gray-200 rounded-lg cursor-pointer peer-checked:border-blue-500 peer-checked:bg-blue-50 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start space-x-4">
                          <img
                            src={caseReport.photoUrl || "/placeholder.svg"}
                            alt={caseReport.title}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">
                              {caseReport.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {caseReport.description}
                            </p>
                            <p className="text-sm font-medium text-blue-600 mt-2">
                              Cost: {formatCurrency(caseReport.cost)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
                {errors.caseReportId && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.caseReportId.message}
                  </p>
                )}
              </div>
            )}

            {/* Amount and Currency */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Amount"
                type="number"
                step="0.01"
                min="1"
                max="100000"
                error={errors.amount?.message}
                {...register("amount", { valueAsNumber: true })}
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
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="relative">
                  <input
                    type="radio"
                    value="stripe"
                    {...register("paymentMethod")}
                    className="sr-only peer"
                  />
                  <div className="p-4 border border-gray-200 rounded-lg cursor-pointer peer-checked:border-blue-500 peer-checked:bg-blue-50 hover:bg-gray-50 transition-colors text-center">
                    <div className="font-medium text-gray-900">Credit Card</div>
                    <div className="text-sm text-gray-500">
                      Visa, Mastercard, Amex
                    </div>
                  </div>
                </label>
                <label className="relative">
                  <input
                    type="radio"
                    value="paypal"
                    {...register("paymentMethod")}
                    className="sr-only peer"
                  />
                  <div className="p-4 border border-gray-200 rounded-lg cursor-pointer peer-checked:border-blue-500 peer-checked:bg-blue-50 hover:bg-gray-50 transition-colors text-center">
                    <div className="font-medium text-gray-900">PayPal</div>
                    <div className="text-sm text-gray-500">Pay with PayPal</div>
                  </div>
                </label>
              </div>
              {errors.paymentMethod && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.paymentMethod.message}
                </p>
              )}
            </div>

            {/* Card Element for Stripe */}
            {watch("paymentMethod") === "stripe" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Details
                </label>
                <div className="p-3 border border-gray-300 rounded-lg">
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          color: "#424770",
                          "::placeholder": {
                            color: "#aab7c4",
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            )}

            {/* Summary */}
            {watchAmount && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">
                  Donation Summary
                </h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span>{formatCurrency(watchAmount, watchCurrency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <span className="capitalize">{watchType}</span>
                  </div>
                  {selectedCase && (
                    <div className="flex justify-between">
                      <span>Case:</span>
                      <span>{selectedCase.title}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              loading={isLoading}
              disabled={!stripe}
            >
              {isLoading
                ? "Processing..."
                : `Donate ${
                    watchAmount
                      ? formatCurrency(watchAmount, watchCurrency)
                      : ""
                  }`}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

const DonationForm = () => {
  return (
    <Elements stripe={stripePromise}>
      <DonationFormContent />
    </Elements>
  );
};

export default DonationForm;
