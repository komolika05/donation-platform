"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { formatCurrency, formatDate, calculateProgress } from "@/lib/utils";
import { mockData } from "@/lib/api-client";
import type { Case, Donation } from "@/types";
import Link from "next/link";
import {
  ArrowLeft,
  Edit,
  DollarSign,
  Users,
  Calendar,
  TrendingUp,
} from "lucide-react";

export default function CaseDetailPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const caseId = params.id as string;

  const [caseData, setCaseData] = useState<Case | null>(null);
  const [caseDonations, setCaseDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "hospital-admin") {
      router.push("/login");
      return;
    }

    // Load case data - using mock data for now
    const foundCase = mockData.cases.find((c) => c._id === caseId);
    if (foundCase) {
      setCaseData(foundCase);
      // Get donations for this case
      const donations = mockData.donations.filter((d) => d.caseId === caseId);
      setCaseDonations(donations);
    }
    setIsLoading(false);
  }, [user, router, caseId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "hospital-admin" || !caseData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Case Not Found
            </h1>
            <Link href="/hospital-admin">
              <Button>Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const progress = calculateProgress(caseData.raisedAmount, caseData.cost);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/hospital-admin"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {caseData.title}
              </h1>
              <p className="text-gray-600 mt-1">
                Case ID: {caseData._id} • Created{" "}
                {formatDate(caseData.createdAt)}
              </p>
            </div>
            <Link href={`/hospital-admin/cases/${caseId}/edit`}>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Edit className="h-4 w-4 mr-2" />
                Edit Case
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Case Image */}
            {caseData.photoUrl && (
              <Card>
                <CardContent className="p-0">
                  <img
                    src={caseData.photoUrl || "/placeholder.svg"}
                    alt={caseData.title}
                    className="w-full h-64 object-cover rounded-t-lg"
                  />
                </CardContent>
              </Card>
            )}

            {/* Case Description */}
            <Card>
              <CardHeader>
                <CardTitle>Case Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {caseData.description}
                </p>
              </CardContent>
            </Card>

            {/* Donations List */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Donations</CardTitle>
              </CardHeader>
              <CardContent>
                {caseDonations.length > 0 ? (
                  <div className="space-y-4">
                    {caseDonations.map((donation) => (
                      <div
                        key={donation._id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <DollarSign className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {donation.donorName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {donation.donorEmail}
                            </p>
                            <p className="text-xs text-gray-400">
                              {formatDate(donation.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-lg text-green-600">
                            {formatCurrency(donation.amount, donation.currency)}
                          </p>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              donation.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : donation.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {donation.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      No donations yet for this case
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Card */}
            <Card>
              <CardHeader>
                <CardTitle>Funding Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span className="font-medium">{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Raised:</span>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(caseData.raisedAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Goal:</span>
                    <span className="font-semibold">
                      {formatCurrency(caseData.cost)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Remaining:</span>
                    <span className="font-semibold text-orange-600">
                      {formatCurrency(caseData.cost - caseData.raisedAmount)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle>Case Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-600">Donors</span>
                  </div>
                  <span className="font-semibold">
                    {caseData.donationsCount}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-600">Created</span>
                  </div>
                  <span className="font-semibold">
                    {formatDate(caseData.createdAt)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <TrendingUp className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-600">Status</span>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full font-medium ${
                      caseData.status === "active"
                        ? "bg-green-100 text-green-800"
                        : caseData.status === "completed"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {caseData.status}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Hospital Info */}
            <Card>
              <CardHeader>
                <CardTitle>Hospital Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="text-gray-600">Hospital:</span>
                  <p className="font-medium">{caseData.hospitalName}</p>
                </div>
                <div>
                  <span className="text-gray-600">Hospital ID:</span>
                  <p className="font-mono text-sm">{caseData.hospitalId}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
