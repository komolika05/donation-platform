"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { formatCurrency, formatDate, calculateProgress } from "@/lib/utils";
import { mockData } from "@/lib/api-client";
import type { Donation, Case, DashboardStats } from "@/types";
import {
  Users,
  DollarSign,
  Heart,
  TrendingUp,
  Plus,
  Eye,
  Edit,
} from "lucide-react";

export default function HospitalAdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "donations" | "cases"
  >("overview");

  useEffect(() => {
    if (!loading && (!user || user.role !== "hospital-admin")) {
      router.push("/login");
      return;
    }

    if (user && user.role === "hospital-admin") {
      // Load admin data - using mock data for now
      const allDonations = [
        ...mockData.donations,
        {
          _id: "3",
          donorId: "user2",
          donorName: "Jane Smith",
          donorEmail: "jane@example.com",
          amount: 1000,
          currency: "USD",
          type: "sponsorship" as const,
          caseId: "case2",
          caseName: "Cancer Treatment for Michael",
          transactionId: "TXN-123458",
          paymentMethod: "stripe",
          status: "completed" as const,
          receiptUrl: "/receipts/receipt-3.pdf",
          createdAt: new Date("2024-01-12"),
          updatedAt: new Date("2024-01-12"),
        },
        {
          _id: "4",
          donorId: "user3",
          donorName: "Bob Johnson",
          donorEmail: "bob@example.com",
          amount: 300,
          currency: "USD",
          type: "general" as const,
          transactionId: "TXN-123459",
          paymentMethod: "paypal",
          status: "completed" as const,
          receiptUrl: "/receipts/receipt-4.pdf",
          createdAt: new Date("2024-01-08"),
          updatedAt: new Date("2024-01-08"),
        },
      ];

      setDonations(allDonations);
      setCases(mockData.cases);
      setStats({
        ...mockData.adminStats,
        recentDonations: allDonations.slice(0, 5),
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

  if (!user || user.role !== "hospital-admin") {
    return null;
  }

  const handleCreateCase = () => {
    router.push("/hospital-admin/cases/new");
  };

  const handleEditCase = (caseId: string) => {
    router.push(`/hospital-admin/cases/${caseId}/edit`);
  };

  const handleViewCase = (caseId: string) => {
    router.push(`/hospital-admin/cases/${caseId}`);
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Donations
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalDonations || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats?.totalAmount || 0)}
            </div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeCases || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.completedCases || 0} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Donors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(donations.map((d) => d.donorId)).size}
            </div>
            <p className="text-xs text-muted-foreground">Active contributors</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Donations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {donations.slice(0, 5).map((donation) => (
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
                        {formatCurrency(donation.amount, donation.currency)}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatDate(donation.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {donation.caseName || "General Fund"}
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Case Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cases
                .filter((c) => c.status === "active")
                .slice(0, 3)
                .map((caseItem) => (
                  <div
                    key={caseItem._id}
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {caseItem.title}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {formatCurrency(caseItem.raisedAmount)} of{" "}
                          {formatCurrency(caseItem.cost)}
                        </p>
                      </div>
                      <span className="text-sm font-medium text-blue-600">
                        {Math.round(
                          calculateProgress(
                            caseItem.raisedAmount,
                            caseItem.cost
                          )
                        )}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${calculateProgress(
                            caseItem.raisedAmount,
                            caseItem.cost
                          )}%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {caseItem.donationsCount} donations
                    </p>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderDonations = () => (
    <Card>
      <CardHeader>
        <CardTitle>All Donations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium text-gray-900">
                  Donor
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
                  Date
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {donations.map((donation) => (
                <tr key={donation._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900">
                        {donation.donorName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {donation.donorEmail}
                      </p>
                    </div>
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
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {formatDate(donation.createdAt)}
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );

  const renderCases = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Case Management</h2>
        <Button
          onClick={handleCreateCase}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Case
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {cases.map((caseItem) => (
          <Card key={caseItem._id} className="overflow-hidden">
            <div className="aspect-video relative">
              <img
                src={caseItem.photoUrl || "/placeholder.svg"}
                alt={caseItem.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    caseItem.status === "active"
                      ? "bg-green-100 text-green-800"
                      : caseItem.status === "completed"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {caseItem.status}
                </span>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                {caseItem.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {caseItem.description}
              </p>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span className="font-medium">
                      {Math.round(
                        calculateProgress(caseItem.raisedAmount, caseItem.cost)
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${calculateProgress(
                          caseItem.raisedAmount,
                          caseItem.cost
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Raised:</span>
                  <span className="font-medium">
                    {formatCurrency(caseItem.raisedAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Goal:</span>
                  <span className="font-medium">
                    {formatCurrency(caseItem.cost)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Donations:</span>
                  <span className="font-medium">{caseItem.donationsCount}</span>
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleViewCase(caseItem._id)}
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditCase(caseItem._id)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Hospital Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Manage donations, cases, and track healthcare funding
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { key: "overview", label: "Overview", icon: TrendingUp },
              { key: "donations", label: "Donations", icon: DollarSign },
              { key: "cases", label: "Cases", icon: Heart },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === key
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && renderOverview()}
        {activeTab === "donations" && renderDonations()}
        {activeTab === "cases" && renderCases()}
      </main>
    </div>
  );
}
