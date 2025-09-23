import { DonationForm } from "@/components/forms/DonationForm"
import { Navbar } from "@/components/layout/Navbar"
import { Card } from "@/components/ui/Card"

export default function DonatePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Make a Donation</h1>
            <p className="text-lg text-gray-600">
              Your contribution helps provide critical healthcare support to those in need.
            </p>
          </div>

          <Card className="p-8">
            <DonationForm />
          </Card>
        </div>
      </main>
    </div>
  )
}
