import Navbar from "@/components/layout/Navbar";
import Button from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section: Focused on the core mission of "giving sight" */}
      <section className="bg-gray-50 py-24 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-6xl font-bold mb-6 text-balance text-gray-900">
                Giving the Gift of Sight Through
                <span className="text-transparent bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text">
                  {" "}
                  Compassionate Donation
                </span>
              </h1>
              <p className="text-xl text-gray-700 mb-8 max-w-2xl text-balance">
                JKVIS connects donors with individuals in need of
                sight-restoring treatments, ensuring every contribution brings
                light to someone's world.
              </p>
              <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 mb-12">
                "A wonderful wonderful thing to do, to give someone back their
                vision."
                <cite className="block not-italic font-semibold mt-2">
                  - Jas Khangura
                </cite>
              </blockquote>
              <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                <Link href="/donations">
                  <Button
                    size="lg"
                    className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-4 text-lg font-semibold"
                  >
                    Donate Now
                  </Button>
                </Link>
                <Link href="/stories">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 text-lg font-semibold bg-transparent"
                  >
                    See Our Impact
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              {/* [Image of an elderly person's smiling eyes seeing clearly] */}
              <Image
                src="/diverse-healthcare-workers-helping-patients-in-mod.jpg"
                alt="An elderly patient smiling after successful eye surgery"
                width={800}
                height={600}
                className="rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4">
        {/* Impact Stats Section: Tailored to vision-related metrics */}
        <section className="py-20 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div>
              <div className="text-5xl font-bold text-blue-600 mb-2">
                10,000+
              </div>
              <div className="text-lg text-gray-600">Sights Restored</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-blue-600 mb-2">
                50,000+
              </div>
              <div className="text-lg text-gray-600">Patients Screened</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-blue-600 mb-2">100%</div>
              <div className="text-lg text-gray-600">Volunteer-Run</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-lg text-gray-600">Partner Eye Clinics</div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 bg-gray-50 -mx-4 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Our Path to Restoring Vision
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                A simple, transparent process to ensure your donation directly
                funds life-changing eye care for those in need.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="relative w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white">
                  1
                </div>
                <h3 className="text-2xl font-semibold mb-4">Find a Patient</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Browse verified profiles of individuals requiring urgent eye
                  surgeries, from cataract removal to corneal transplants.
                </p>
              </div>
              <div className="text-center">
                <div className="relative w-20 h-20 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white">
                  2
                </div>
                <h3 className="text-2xl font-semibold mb-4">
                  Give the Gift of Sight
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Make a secure donation. As a non-profit society, we ensure
                  every dollar goes directly towards patient care and treatment.
                </p>
              </div>
              <div className="text-center">
                <div className="relative w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white">
                  3
                </div>
                <h3 className="text-2xl font-semibold mb-4">
                  Witness the Miracle
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Receive updates on the patient's journey and see the profound
                  impact of your generosity as they regain their vision.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Success Stories Section: More emotive and specific */}
        <section className="py-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Stories of Hope
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real lives transformed by the clarity of vision, made possible by
              donors like you.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="p-8 flex flex-col">
              {/* [Image of a young girl reading a book after eye surgery] */}
              <Image
                src="/child-reading-post-surgery.webp"
                alt="A young girl reading a book clearly for the first time"
                width={500}
                height={300}
                className="rounded-2xl w-full object-cover mb-6"
              />
              <h3 className="text-2xl font-semibold mb-4">
                A Child's First Sunrise
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4 flex-grow">
                Seven-year-old Priya, born with congenital cataracts, saw the
                world clearly for the first time. Thanks to our donors, her
                future is now as bright as her vision.
              </p>
              <div className="text-sm text-gray-600 mt-auto pt-4 border-t">
                <strong>Surgery:</strong> Bilateral Cataract Removal •{" "}
                <strong>Donors:</strong> 82
              </div>
            </Card>
            <Card className="p-8 flex flex-col">
              {/* [Image of an elderly man happily looking at his family] */}
              <Image
                src="/elderly-man-walking-with-physical-therapist-after-.jpg"
                alt="An elderly man seeing his grandchildren clearly"
                width={500}
                height={300}
                className="rounded-2xl w-full object-cover mb-6"
              />
              <h3 className="text-2xl font-semibold mb-4">
                A Grandfather's Renewed Vision
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4 flex-grow">
                After years of fading sight due to glaucoma, Mr. Singh can now
                see his grandchildren's faces. A simple, funded procedure
                restored not just his sight, but his connection to family.
              </p>
              <div className="text-sm text-gray-600 mt-auto pt-4 border-t">
                <strong>Surgery:</strong> Corneal Transplant •{" "}
                <strong>Donors:</strong> 45
              </div>
            </Card>
          </div>
        </section>

        {/* About Us/Mission Section */}
        <section className="py-24">
          <div className="grid lg:grid-cols-5 gap-16 items-center">
            <div className="lg:col-span-2">
              {/* [Image of the Jas Khangura Vision International team] */}
              <Image
                src="/jkbs-images.jpg"
                alt="JKVIS team with happy patients"
                width={600}
                height={700}
                className="rounded-3xl shadow-xl object-cover"
              />
            </div>
            <div className="lg:col-span-3">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Our Mission: A World Where Everyone Can See
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Jas Khangura Vision International is a Canadian non-profit
                charitable society based in British Columbia. We are dedicated
                to promoting eye health awareness and providing free eye care,
                treatment, and operations to those who are unable to afford it.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                Our society is controlled by a Board of Trustees, with a strict
                mandate that ensures 100% of public donations go directly to
                patient care. No trustee, past or present, receives any monetary
                benefit from the society.
              </p>
              <Link href="/about-us">
                <Button size="lg" variant="outline">
                  Learn More About Our Work
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-24">
          <div className="bg-blue-600 rounded-3xl p-16 text-center text-white">
            <h2 className="text-5xl font-bold mb-6 text-balance">
              Ready to Bring Light to Someone's World?
            </h2>
            <p className="text-xl opacity-90 mb-12 max-w-3xl mx-auto text-balance">
              "It is a very beautiful thing to see a person smiling. And even
              more beautiful is, knowing that you are the reason behind it."
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/donations">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-200 px-8 py-4 text-lg font-semibold"
                >
                  Give the Gift of Sight
                </Button>
              </Link>
              <Link href="/how-to-help">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white bg-blue-600 text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold"
                >
                  More Ways to Help
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
