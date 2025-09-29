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
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
            <div className="text-center lg:text-left">
              <h1 className="text-6xl font-bold mb-6 text-balance text-gray-900">
                Transforming Healthcare Through
                <span className="text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                  {" "}
                  Transparent Donations
                </span>
              </h1>
              <p className="text-xl text-gray-700 mb-12 max-w-2xl text-balance">
                JKVIS connects compassionate donors with critical healthcare
                needs worldwide, ensuring every contribution creates measurable
                impact in saving lives and improving healthcare access.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
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
            <div className="relative">
              <Image
                src="/diverse-healthcare-workers-helping-patients-in-mod.jpg"
                alt="Healthcare workers helping patients"
                width={800}
                height={600}
                className="rounded-3xl shadow-2xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2 text-gray-900">
                $2.4M+
              </div>
              <div className="text-gray-600">Total Donated</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2 text-gray-900">
                15,000+
              </div>
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
        </div>
      </section>

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
              <div className="mb-6">
                <Image
                  src="/hands-holding-heart-with-medical-cross-symbol-repr.jpg"
                  alt="Direct Impact"
                  width={300}
                  height={200}
                  className="rounded-2xl mx-auto"
                />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Direct Impact</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Your donations go directly to verified healthcare cases,
                ensuring maximum impact for those in critical need of medical
                assistance.
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="mb-6">
                <Image
                  src="/medical-professionals-reviewing-patient-files-with.jpg"
                  alt="Verified Cases"
                  width={300}
                  height={200}
                  className="rounded-2xl mx-auto"
                />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Verified Cases</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                All medical cases are thoroughly verified by healthcare
                professionals and partner hospitals before being listed on our
                platform.
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="mb-6">
                <Image
                  src="/transparent-dashboard-showing-donation-tracking-an.jpg"
                  alt="Full Transparency"
                  width={300}
                  height={200}
                  className="rounded-2xl mx-auto"
                />
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
                <div className="mb-6">
                  <Image
                    src="/person-browsing-medical-cases-on-tablet-showing-pa.jpg"
                    alt="Browse Cases"
                    width={350}
                    height={250}
                    className="rounded-2xl mx-auto"
                  />
                </div>
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
                <div className="mb-6">
                  <Image
                    src="/secure-payment-interface-with-credit-card-and-digi.jpg"
                    alt="Make Donation"
                    width={350}
                    height={250}
                    className="rounded-2xl mx-auto"
                  />
                </div>
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
                <div className="mb-6">
                  <Image
                    src="/mobile-app-showing-real-time-donation-impact-updat.jpg"
                    alt="Track Impact"
                    width={350}
                    height={250}
                    className="rounded-2xl mx-auto"
                  />
                </div>
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
              Success Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real stories of lives transformed through the generosity of our
              donor community.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <Card className="p-8">
              <div className="mb-6">
                <Image
                  src="/donation-guide-illustration-with-heart-and-medical.jpg"
                  alt="Heart Surgery Success"
                  width={500}
                  height={300}
                  className="rounded-2xl w-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-semibold mb-4">
                Life-Saving Heart Surgery
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                8-year-old Maria received a critical heart surgery thanks to
                donations from 47 generous donors. She's now back to playing
                with her friends and attending school regularly.
              </p>
              <div className="text-sm text-gray-600">
                <strong>Funded:</strong> $45,000 • <strong>Donors:</strong> 47 •{" "}
                <strong>Recovery:</strong> Complete
              </div>
            </Card>

            <Card className="p-8">
              <div className="mb-6">
                <Image
                  src="/elderly-man-walking-with-physical-therapist-after-.jpg"
                  alt="Knee Replacement Success"
                  width={500}
                  height={300}
                  className="rounded-2xl w-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Mobility Restored</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Robert, 68, can walk pain-free again after his knee replacement
                surgery was funded through our platform. He's now volunteering
                at his local community center.
              </p>
              <div className="text-sm text-gray-600">
                <strong>Funded:</strong> $32,000 • <strong>Donors:</strong> 23 •{" "}
                <strong>Recovery:</strong> Excellent
              </div>
            </Card>
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
            <h2 className="text-5xl font-bold mb-6 text-balance text-blue-900">
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
