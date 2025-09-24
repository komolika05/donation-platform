"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { formatCurrency, formatDate, getInitials } from "@/lib/utils";
import { mockData } from "@/lib/api-client";
import type { Donation, DashboardStats } from "@/types";
import Link from "next/link";
import {
  Heart,
  DollarSign,
  Calendar,
  Download,
  Plus,
  TrendingUp,
  Gift,
} from "lucide-react";

export default function DonorDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && (!user || user.role !== "donor")) {
      router.push("/login");
      return;
    }

    if (user && user.role === "donor") {
      // Load donor data - using mock data for now
      setDonations(mockData.donations);
      setStats({
        ...mockData.donorStats,
        recentDonations: mockData.donations.slice(0, 3),
      });
      setIsLoading(false);
    }
  }, [user, loading, router]);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "donor") {
    return null;
  }

  const downloadReceipt = (donation: Donation) => {
    // Mock receipt download
    const receiptContent = `
JKVIS - Official Donation Receipt

Transaction ID: ${donation.transactionId}
Date: ${formatDate(donation.createdAt)}
Amount: ${formatCurrency(donation.amount, donation.currency)}
Donation Type: ${donation.type}
${donation.caseName ? `Case: ${donation.caseName}` : ""}

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
    a.download = `JKVIS-Receipt-${donation.transactionId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user.name}!
              </h1>
              <p className="text-gray-600 mt-1">
                Track your donations and see the impact you're making
              </p>
            </div>
            <Link href="/donate">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Make Donation
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Donations
              </CardTitle>
              <Gift className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.totalDonations || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Lifetime contributions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Amount
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(stats?.totalAmount || 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Total donated amount
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Cases Supported
              </CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalCases || 0}</div>
              <p className="text-xs text-muted-foreground">
                Lives you've helped
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Donations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Recent Donations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {donations.length > 0 ? (
                  donations.map((donation) => (
                    <div
                      key={donation._id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <DollarSign className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {formatCurrency(donation.amount, donation.currency)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {donation.caseName || `${donation.type} donation`}
                          </p>
                          <p className="text-xs text-gray-400">
                            {formatDate(donation.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
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
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadReceipt(donation)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No donations yet</p>
                    <Link href="/donate">
                      <Button>Make Your First Donation</Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Profile Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Profile Info */}
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xl font-semibold text-blue-600">
                      {getInitials(user.name)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {user.name}
                    </h3>
                    <p className="text-gray-500">{user.email}</p>
                    <p className="text-sm text-gray-400">
                      {user.address && `${user.address}, `}
                      {user.country}
                    </p>
                  </div>
                </div>

                {/* Impact Summary */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    Your Impact
                  </h4>
                  <p className="text-blue-800 text-sm leading-relaxed">
                    Through your generous donations of{" "}
                    {formatCurrency(stats?.totalAmount || 0)}, you've directly
                    contributed to {stats?.totalCases || 0} healthcare cases,
                    helping save lives and provide critical medical care to
                    those in need.
                  </p>
                </div>

                {/* Quick Actions */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Quick Actions</h4>
                  <div className="grid grid-cols-1 gap-2">
                    <Link href="/donate">
                      <Button
                        variant="outline"
                        className="w-full justify-start bg-transparent"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Make New Donation
                      </Button>
                    </Link>
                    <Link href="/cases">
                      <Button
                        variant="outline"
                        className="w-full justify-start bg-transparent"
                      >
                        <Heart className="h-4 w-4 mr-2" />
                        Browse Cases
                      </Button>
                    </Link>
                    <Link href="/profile">
                      <Button
                        variant="outline"
                        className="w-full justify-start bg-transparent"
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Update Profile
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* All Donations Table */}
        {donations.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>All Donations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Date
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Amount
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Type
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Case
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Receipt
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations.map((donation) => (
                      <tr
                        key={donation._id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="py-3 px-4 text-sm text-gray-900">
                          {formatDate(donation.createdAt)}
                        </td>
                        <td className="py-3 px-4 text-sm font-medium text-gray-900">
                          {formatCurrency(donation.amount, donation.currency)}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 capitalize">
                          {donation.type}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {donation.caseName || "General Fund"}
                        </td>
                        <td className="py-3 px-4">
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
                        </td>
                        <td className="py-3 px-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => downloadReceipt(donation)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
