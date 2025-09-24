"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { formatCurrency, calculateProgress } from "@/lib/utils";
import { mockData } from "@/lib/api-client";
import type { Case } from "@/types";
import Link from "next/link";
import { Heart, Users, Calendar, TrendingUp } from "lucide-react";

export default function CasesPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [filter, setFilter] = useState<"all" | "active" | "completed">(
    "active"
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load cases - using mock data for now
    setCases(mockData.cases);
    setIsLoading(false);
  }, []);

  const filteredCases = cases.filter((caseItem) => {
    if (filter === "all") return true;
    return caseItem.status === filter;
  });

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Medical Cases Needing Support
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Browse verified medical cases that need your support. Every donation
            directly helps patients receive the healthcare they need.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8">
          <nav className="flex justify-center space-x-8">
            {[
              {
                key: "active",
                label: "Active Cases",
                count: cases.filter((c) => c.status === "active").length,
              },
              {
                key: "completed",
                label: "Completed",
                count: cases.filter((c) => c.status === "completed").length,
              },
              { key: "all", label: "All Cases", count: cases.length },
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key as any)}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  filter === key
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                {label}
                <span className="ml-2 px-2 py-1 text-xs bg-gray-200 rounded-full">
                  {count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCases.map((caseItem) => {
            const progress = calculateProgress(
              caseItem.raisedAmount,
              caseItem.cost
            );

            return (
              <Card
                key={caseItem._id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-video relative">
                  <img
                    src={
                      caseItem.photoUrl ||
                      "/placeholder.svg?height=200&width=300"
                    }
                    alt={caseItem.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-medium ${
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

                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    {caseItem.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {caseItem.description}
                  </p>

                  {/* Progress Section */}
                  <div className="space-y-3 mb-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">
                          {Math.round(progress)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Raised:</span>
                        <p className="font-semibold text-green-600">
                          {formatCurrency(caseItem.raisedAmount)}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Goal:</span>
                        <p className="font-semibold">
                          {formatCurrency(caseItem.cost)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {caseItem.donationsCount} donors
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(caseItem.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Hospital Info */}
                  <div className="text-sm text-gray-600 mb-4">
                    <span className="font-medium">{caseItem.hospitalName}</span>
                  </div>

                  {/* Action Button */}
                  {caseItem.status === "active" ? (
                    <Link href="/donate" className="block">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        <Heart className="h-4 w-4 mr-2" />
                        Donate Now
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      disabled
                    >
                      <TrendingUp className="h-4 w-4 mr-2" />
                      {caseItem.status === "completed"
                        ? "Fully Funded"
                        : "Case Closed"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredCases.length === 0 && (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No cases found
            </h3>
            <p className="text-gray-500">
              {filter === "active"
                ? "There are no active cases at the moment. Please check back later."
                : `No ${filter} cases available.`}
            </p>
          </div>
        )}

        {/* Call to Action */}
        {filteredCases.length > 0 && (
          <div className="text-center mt-12 bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Make a Difference?
            </h2>
            <p className="text-gray-600 mb-6">
              Your donation can help save lives and provide critical medical
              care to those who need it most.
            </p>
            <Link href="/donate">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Make a Donation
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
