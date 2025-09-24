"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  useElements,
  CardElement,
} from "@stripe/react-stripe-js";
import { useAuth } from "@/contexts/AuthContext";
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
import Input from "../ui/Input";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface DonationSuccess {
  transactionId: string;
  amount: number;
  currency: string;
  donationType: string;
  caseName?: string;
  receiptUrl: string;
  date: string;
}

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

const DonationSuccessScreen = ({
  success,
  onNewDonation,
}: {
  success: DonationSuccess;
  onNewDonation: () => void;
}) => {
  const downloadReceipt = () => {
    // Create a dummy PDF receipt download
    const receiptContent = `
JKVIS - Official Donation Receipt

Transaction ID: ${success.transactionId}
Date: ${success.date}
Amount: ${formatCurrency(success.amount, success.currency)}
Donation Type: ${success.donationType}
${success.caseName ? `Case: ${success.caseName}` : ""}

Thank you for your generous donation!
This receipt serves as proof of your charitable contribution.

JKVIS is a registered non-profit organization.
Tax ID: 12-3456789

For questions, contact us at support@jkvis.org
    `;

    const blob = new Blob([receiptContent], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `JKVIS-Receipt-${success.transactionId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="border-green-200 bg-green-50">
        <CardHeader className="text-center pb-6">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <CardTitle className="text-3xl font-bold text-green-800 mb-2">
            Donation Successful!
          </CardTitle>
          <CardDescription className="text-lg text-green-700">
            Thank you for your generous contribution to healthcare accessibility
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Transaction Details */}
          <div className="bg-white p-6 rounded-xl border border-green-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Transaction Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Transaction ID:</span>
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                  {success.transactionId}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Amount:</span>
                <span className="font-semibold text-xl text-green-600">
                  {formatCurrency(success.amount, success.currency)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Donation Type:</span>
                <span className="capitalize font-medium">
                  {success.donationType}
                </span>
              </div>
              {success.caseName && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Case Supported:</span>
                  <span className="font-medium">{success.caseName}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">{success.date}</span>
              </div>
            </div>
          </div>

          {/* Impact Message */}
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
            <h3 className="text-xl font-semibold text-blue-900 mb-3">
              Your Impact
            </h3>
            <p className="text-blue-800 leading-relaxed">
              Your donation of{" "}
              {formatCurrency(success.amount, success.currency)} will directly
              fund critical healthcare needs. You'll receive regular updates on
              how your contribution is making a difference in someone's life.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={downloadReceipt}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Download Receipt
            </Button>
            <Button
              onClick={onNewDonation}
              variant="outline"
              className="flex-1 border-green-600 text-green-600 hover:bg-green-50 font-semibold py-3 bg-transparent"
            >
              Make Another Donation
            </Button>
          </div>

          {/* Social Sharing */}
          <div className="text-center pt-4 border-t border-green-200">
            <p className="text-gray-600 mb-3">
              Share your impact and inspire others:
            </p>
            <div className="flex justify-center gap-3">
              <Button
                size="sm"
                variant="outline"
                className="text-blue-600 border-blue-600 hover:bg-blue-50 bg-transparent"
              >
                Share on Twitter
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-blue-800 border-blue-800 hover:bg-blue-50 bg-transparent"
              >
                Share on Facebook
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const DonationFormContent = () => {
  const { user } = useAuth();
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [availableCases, setAvailableCases] = useState<CaseReport[]>([]);
  const [selectedCase, setSelectedCase] = useState<CaseReport | null>(null);
  const [donationSuccess, setDonationSuccess] =
    useState<DonationSuccess | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    reset,
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

      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate processing time

      // Create dummy success data
      const successData: DonationSuccess = {
        transactionId: `TXN-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)
          .toUpperCase()}`,
        amount: data.amount,
        currency: data.currency,
        donationType: data.type,
        caseName: selectedCase?.title,
        receiptUrl: `/receipts/dummy-receipt-${Date.now()}.pdf`,
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setDonationSuccess(successData);
      toast.success("Donation completed successfully!");
    } catch (error: any) {
      console.error("Donation error:", error);
      toast.error(error.message || "Donation failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewDonation = () => {
    setDonationSuccess(null);
    setSelectedCase(null);
    reset();
  };

  if (donationSuccess) {
    return (
      <DonationSuccessScreen
        success={donationSuccess}
        onNewDonation={handleNewDonation}
      />
    );
  }

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
