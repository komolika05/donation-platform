"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import {
  Building2,
  FileText,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  AlertTriangle,
  Badge,
} from "lucide-react";
import { mockSuperAdminData } from "@/lib/api-client";
import type { Hospital, CaseReport, SuperAdminStats } from "@/types";
import toast from "react-hot-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import Navbar from "@/components/layout/Navbar";

export default function SuperAdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<SuperAdminStats | null>(null);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [pendingReports, setPendingReports] = useState<CaseReport[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(
    null
  );

  useEffect(() => {
    if (!loading && (!user || user.role !== "super-admin")) {
      router.push("/");
      return;
    }

    if (user?.role === "super-admin") {
      // Load mock data for now
      setStats(mockSuperAdminData.superAdminStats);
      setHospitals(mockSuperAdminData.hospitals);
    }
  }, [user, loading, router]);

  const handleApproveCase = async (caseId: string) => {
    try {
      // In real implementation, call superAdminApi.approveCaseReport(caseId)
      setPendingReports((prev) =>
        prev.filter((report) => report.id !== caseId)
      );
      toast.success("Case approved successfully!");
    } catch (error) {
      toast.error("Failed to approve case");
    }
  };

  const handleRejectCase = async (caseId: string, reason: string) => {
    try {
      // In real implementation, call superAdminApi.rejectCaseReport(caseId, reason)
      setPendingReports((prev) =>
        prev.filter((report) => report.id !== caseId)
      );
      toast.success("Case rejected successfully!");
    } catch (error) {
      toast.error("Failed to reject case");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || user.role !== "super-admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Super Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage hospitals, case reports, and platform oversight
          </p>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Hospitals
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalHospitals}
                  </p>
                </div>
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
              <div className="mt-2 flex items-center text-sm">
                <span className="text-green-600">
                  {stats.activeHospitals} active
                </span>
                <span className="text-gray-400 mx-2">•</span>
                <span className="text-orange-600">
                  {stats.pendingHospitals} pending
                </span>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Pending Reports
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    {stats.pendingCaseReports}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-1" />
                Requires review
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Cases
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalCases}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-purple-600" />
              </div>
              <div className="mt-2 flex items-center text-sm">
                <span className="text-green-600">
                  {stats.approvedCases} approved
                </span>
                <span className="text-gray-400 mx-2">•</span>
                <span className="text-red-600">
                  {stats.rejectedCases} rejected
                </span>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Donations
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    ${stats.totalDonationAmount.toLocaleString()}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                {stats.totalDonations} donations
              </div>
            </Card>
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="pending-reports" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending-reports">
              Pending Case Reports
            </TabsTrigger>
            <TabsTrigger value="hospitals">Hospital Management</TabsTrigger>
            <TabsTrigger value="overview">Platform Overview</TabsTrigger>
          </TabsList>

          {/* Pending Case Reports */}
          <TabsContent value="pending-reports" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                Pending Case Reports
              </h2>
              {pendingReports.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <p className="text-gray-600">
                    No pending case reports to review
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingReports.map((report) => (
                    <div
                      key={report.id}
                      className="border rounded-lg p-4 bg-white"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">
                              {report.title}
                            </h3>
                            <Badge className="text-orange-600 border-orange-600">
                              Pending Review
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-3">
                            {report.description}
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Hospital:</span>
                              <p className="text-gray-600">
                                {report.HospitalId}
                              </p>
                            </div>
                            <div>
                              <span className="font-medium">Cost:</span>
                              <p className="text-gray-600">
                                ${report.cost.toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <span className="font-medium">Submitted:</span>
                              <p className="text-gray-600">
                                {report.createdAt}
                              </p>
                            </div>
                            <div>
                              <span className="font-medium">Status:</span>
                              <p className="text-gray-600 capitalize">
                                {report.status}
                              </p>
                            </div>
                          </div>
                        </div>
                        {report.photoUrl && (
                          <img
                            src={report.photoUrl || "/placeholder.svg"}
                            alt={report.title}
                            className="w-20 h-20 object-cover rounded-lg ml-4"
                          />
                        )}
                      </div>
                      <div className="flex gap-3 mt-4 pt-4 border-t">
                        <Button
                          onClick={() => handleApproveCase(report.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            const reason = prompt(
                              "Please provide a reason for rejection:"
                            );
                            if (reason) {
                              handleRejectCase(report.id, reason);
                            }
                          }}
                          className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                        <Button variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Hospital Management */}
          <TabsContent value="hospitals" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                Hospital Management
              </h2>
              <div className="space-y-4">
                {hospitals.map((hospital) => (
                  <div
                    key={hospital._id}
                    className="border rounded-lg p-4 bg-white"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg">
                          {hospital.name}
                        </h3>
                        <Badge
                          className={
                            hospital.status === "active"
                              ? "bg-green-600"
                              : "bg-orange-600"
                          }
                        >
                          {hospital.status}
                        </Badge>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedHospital(hospital)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Location:</span>
                        <p className="text-gray-600">
                          {hospital.city}, {hospital.state}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium">Admin:</span>
                        <p className="text-gray-600">{hospital.adminName}</p>
                      </div>
                      <div>
                        <span className="font-medium">Total Cases:</span>
                        <p className="text-gray-600">{hospital.totalCases}</p>
                      </div>
                      <div>
                        <span className="font-medium">Donations Received:</span>
                        <p className="text-gray-600">
                          ${hospital.totalDonationsReceived.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 text-sm text-gray-600">
                      <p>
                        <span className="font-medium">Contact:</span>{" "}
                        {hospital.contactEmail} • {hospital.contactPhone}
                      </p>
                      <p>
                        <span className="font-medium">Address:</span>{" "}
                        {hospital.address}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Platform Overview */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">New hospital registered</p>
                      <p className="text-sm text-gray-600">
                        Regional Emergency Hospital
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                    <FileText className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="font-medium">Case report submitted</p>
                      <p className="text-sm text-gray-600">
                        Kidney Transplant for David
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Case approved</p>
                      <p className="text-sm text-gray-600">
                        Heart Surgery for Sarah
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">System Health</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Active Hospitals</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-medium">2/3 Online</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Pending Reviews</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="font-medium">
                        {pendingReports.length} Cases
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Platform Status</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-medium">Operational</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
