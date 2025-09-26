import Navbar from "@/components/layout/Navbar";
import Button from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="hero-light py-24 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-6xl font-bold mb-6 text-balance text-gray-900">
            Transforming Healthcare Through
            <span className="text-transparent bg-gradient-to-r from-blue-500 to-blue-800 bg-clip-text">
              {" "}
              Transparent Donations
            </span>
          </h1>
          <p className="text-xl text-gray-700 mb-12 max-w-4xl mx-auto text-balance">
            JKVIS connects compassionate donors with critical healthcare needs
            worldwide, ensuring every contribution creates measurable impact in
            saving lives and improving healthcare access.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link href="/donate">
              <Button
                size="lg"
                className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-4 text-lg font-semibold"
              >
                Start Donating
              </Button>
            </Link>
            <Link href="/cases">
              <Button
                variant="outline"
                size="lg"
                className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 text-lg font-semibold bg-transparent"
              >
                View Active Cases
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-9 max-w-4xl mx-auto py-8">
        <div className="text-center">
          <div className="text-4xl font-bold mb-2 text-gray-900">$2.4M+</div>
          <div className="text-gray-600">Total Donated</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold mb-2 text-gray-900">15,000+</div>
          <div className="text-gray-600">Lives Impacted</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold mb-2 text-gray-900">98%</div>
          <div className="text-gray-600">Funds to Care</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold mb-2 text-gray-900">150+</div>
          <div className="text-gray-600">Partner Hospitals</div>
        </div>
      </div>

      <main className="container mx-auto px-4">
        <section className="py-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Why Choose JKVIS?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform ensures your donations create maximum impact through
              verified cases, transparent tracking, and direct healthcare
              support.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <Card className="p-8 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Direct Impact</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Your donations go directly to verified healthcare cases,
                ensuring maximum impact for those in critical need of medical
                assistance.
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Verified Cases</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                All medical cases are thoroughly verified by healthcare
                professionals and partner hospitals before being listed on our
                platform.
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Full Transparency</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Track your donations with detailed receipts, real-time updates,
                and comprehensive reports on how your contribution makes a
                difference.
              </p>
            </Card>
          </div>
        </section>

        <section className="py-24 bg-gray-50 -mx-4 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                How It Works
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our simple, transparent process ensures your donations reach
                those who need them most.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-2xl font-semibold mb-4">Browse Cases</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Explore verified medical cases from partner hospitals
                  worldwide. Each case includes detailed medical information,
                  funding goals, and patient stories.
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-2xl font-semibold mb-4">Make Donation</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Choose your donation amount and payment method. Our secure
                  platform supports multiple payment options including credit
                  cards and digital wallets.
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-2xl font-semibold mb-4">Track Impact</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Receive real-time updates on your donation's impact, including
                  treatment progress, recovery updates, and thank you messages
                  from patients.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Stories of Impact
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from donors and patients whose lives have been transformed
              through our platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-8">
              <div className="flex items-center mb-6">
                <Image
                  src="/professional-female-doctor-smiling-in-white-coat.jpg"
                  alt="Dr. Sarah Johnson"
                  width={60}
                  height={60}
                  className="rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold text-lg">Dr. Sarah Johnson</h4>
                  <p className="text-gray-600">Cardiac Surgeon</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                "JKVIS has revolutionized how we connect with donors. The
                transparency and efficiency of the platform has helped us save
                countless lives by securing funding for critical surgeries."
              </p>
            </Card>

            <Card className="p-8">
              <div className="flex items-center mb-6">
                <Image
                  src="/professional-asian-male-in-business-suit-smiling.jpg"
                  alt="Michael Chen"
                  width={60}
                  height={60}
                  className="rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold text-lg">Michael Chen</h4>
                  <p className="text-gray-600">Regular Donor</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                "I've donated to several cases through JKVIS and love receiving
                updates on the patients' recovery. It's incredible to see the
                direct impact of my contributions."
              </p>
            </Card>

            <Card className="p-8">
              <div className="flex items-center mb-6">
                <Image
                  src="/professional-african-female-doctor-in-medical-sett.jpg"
                  alt="Dr. Amara Okafor"
                  width={60}
                  height={60}
                  className="rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold text-lg">Dr. Amara Okafor</h4>
                  <p className="text-gray-600">Pediatric Specialist</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                "The verification process gives me confidence that donations
                reach legitimate cases. As a healthcare provider, I appreciate
                the platform's commitment to transparency."
              </p>
            </Card>
          </div>
        </section>

        <section className="py-24 bg-gray-50 -mx-4 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Trusted by Healthcare Leaders
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We partner with leading hospitals and healthcare organizations
                worldwide to ensure the highest standards of care and
                transparency.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
              <div className="text-center">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-gray-800">
                    Mayo Clinic
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-gray-800">
                    Johns Hopkins
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-gray-800">
                    Cleveland Clinic
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-gray-800">
                    Mass General
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="stats-light rounded-3xl p-16 text-center">
            <h2 className="text-5xl font-bold mb-6 text-balance text-blue-700">
              Ready to Save Lives?
            </h2>
            <p className="text-xl text-blue-800 mb-12 max-w-3xl mx-auto text-balance">
              Join thousands of compassionate donors who are making a real
              difference in healthcare worldwide. Every donation, no matter the
              size, has the power to transform lives.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-4 text-lg font-semibold"
                >
                  Start Your Impact Journey
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 text-lg font-semibold bg-transparent"
                >
                  Learn More About Us
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
