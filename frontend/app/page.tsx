// Make this a client component to enable animations and hooks
"use client";

import { useState, ReactNode } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import CountUp from "react-countup";
import {
  Heart,
  Users,
  Eye,
  HelpingHand, // Corrected: Renamed HandHelping to HelpingHand
  ChevronDown,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Button from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import Image from "next/image";

// Corrected: Added explicit 'Variants' type for Framer Motion
const fadeIn: Variants = {
  initial: { opacity: 0, y: 30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeInOut" },
  },
};

const staggerContainer: Variants = {
  initial: {}, // Added initial state for consistency
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gray-50 py-24 px-4 overflow-hidden">
        <div className="container mx-auto">
          <motion.div
            className="grid lg:grid-cols-2 gap-16 items-center"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.div
              className="text-center lg:text-left"
              variants={staggerContainer}
            >
              <motion.h1
                className="text-6xl font-bold mb-6 text-balance text-gray-900"
                variants={fadeIn}
              >
                Giving the Gift of Sight Through
                <span className="text-transparent bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text">
                  {" "}
                  Compassionate Donation
                </span>
              </motion.h1>
              <motion.p
                className="text-xl text-gray-700 mb-8 max-w-2xl text-balance"
                variants={fadeIn}
              >
                JKVIS connects donors with individuals in need of
                sight-restoring treatments, ensuring every contribution brings
                light to someone's world.
              </motion.p>
              <motion.blockquote
                className="border-l-4 border-blue-500 pl-4 italic text-gray-600 mb-12"
                variants={fadeIn}
              >
                "A wonderful wonderful thing to do, to give someone back their
                vision."
                <cite className="block not-italic font-semibold mt-2">
                  - Jas Khangura
                </cite>
              </motion.blockquote>
              <motion.div
                className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start"
                variants={fadeIn}
              >
                <Link href="/donations">
                  <Button
                    size="lg"
                    className="bg-blue-600 text-white hover:bg-blue-700 transition-all transform hover:scale-105 px-8 py-4 text-lg font-semibold"
                  >
                    Donate Now
                  </Button>
                </Link>
                <Link href="/stories">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all transform hover:scale-105 px-8 py-4 text-lg font-semibold bg-transparent"
                  >
                    See Our Impact
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{
                opacity: 1,
                scale: 1,
                transition: { duration: 0.8, ease: "easeOut" },
              }}
            >
              <Image
                src="/diverse-healthcare-workers-helping-patients-in-mod.jpg"
                alt="An elderly patient smiling after successful eye surgery"
                width={800}
                height={600}
                className="rounded-3xl shadow-2xl"
                priority
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      <main className="container mx-auto px-4">
        {/* Impact Stats Section */}
        <section className="py-20 text-center">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto"
            initial="initial"
            whileInView="animate"
            variants={staggerContainer}
            viewport={{ once: true, amount: 0.5 }}
          >
            <StatCard
              icon={<Eye size={40} />}
              end={10000}
              label="Sights Restored"
            />
            <StatCard
              icon={<Users size={40} />}
              end={50000}
              label="Patients Screened"
            />
            <StatCard
              icon={<Heart size={40} />}
              end={100}
              label="Volunteer-Run"
              isPercentage
            />
            <StatCard
              icon={<HelpingHand size={40} />} // Corrected Icon
              end={50}
              label="Partner Eye Clinics"
            />
          </motion.div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 bg-gray-50 -mx-4 px-4">
          <div className="container mx-auto">
            <motion.div
              className="text-center mb-16"
              initial="initial"
              whileInView="animate"
              variants={fadeIn}
              viewport={{ once: true, amount: 0.8 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Our Path to Restoring Vision
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                A simple, transparent process to ensure your donation directly
                funds life-changing eye care for those in need.
              </p>
            </motion.div>

            <motion.div
              className="grid md:grid-cols-3 gap-12"
              initial="initial"
              whileInView="animate"
              variants={staggerContainer}
              viewport={{ once: true, amount: 0.3 }}
            >
              <HowItWorksStep
                number={1}
                title="Find a Patient"
                description="Browse verified profiles of individuals requiring urgent eye surgeries, from cataract removal to corneal transplants."
                color="bg-blue-600"
              />
              <HowItWorksStep
                number={2}
                title="Give the Gift of Sight"
                description="Make a secure donation. As a non-profit society, we ensure every dollar goes directly towards patient care and treatment."
                color="bg-teal-500"
              />
              <HowItWorksStep
                number={3}
                title="Witness the Miracle"
                description="Receive updates on the patient's journey and see the profound impact of your generosity as they regain their vision."
                color="bg-purple-600"
              />
            </motion.div>
          </div>
        </section>

        {/* Success Stories Section */}
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
            <SuccessStoryCard
              imageSrc="/child-reading-post-surgery.webp"
              imageAlt="A young girl reading a book clearly for the first time"
              title="A Child's First Sunrise"
              story="Seven-year-old Priya, born with congenital cataracts, saw the world clearly for the first time. Thanks to our donors, her future is now as bright as her vision."
              surgeryType="Bilateral Cataract Removal"
              donorCount={82}
            />
            <SuccessStoryCard
              imageSrc="/elderly-man-walking-with-physical-therapist-after-.jpg"
              imageAlt="An elderly man seeing his grandchildren clearly"
              title="A Grandfather's Renewed Vision"
              story="After years of fading sight due to glaucoma, Mr. Singh can now see his grandchildren's faces. A simple, funded procedure restored not just his sight, but his connection to family."
              surgeryType="Corneal Transplant"
              donorCount={45}
            />
          </div>
        </section>

        {/* About Us/Mission Section */}
        <section className="py-24">
          <div className="grid lg:grid-cols-5 gap-16 items-center">
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.5 }}
            >
              <Image
                src="/jkbs-images.jpg"
                alt="JKVIS team with happy patients"
                width={600}
                height={700}
                className="rounded-3xl shadow-xl object-cover"
              />
            </motion.div>
            <motion.div
              className="lg:col-span-3"
              initial="initial"
              whileInView="animate"
              variants={staggerContainer}
              viewport={{ once: true, amount: 0.5 }}
            >
              <motion.h2
                className="text-4xl font-bold text-gray-900 mb-6"
                variants={fadeIn}
              >
                Our Mission: A World Where Everyone Can See
              </motion.h2>
              <motion.p
                className="text-lg text-gray-700 leading-relaxed mb-6"
                variants={fadeIn}
              >
                Jas Khangura Vision International is a Canadian non-profit
                charitable society based in British Columbia. We are dedicated
                to promoting eye health awareness and providing free eye care,
                treatment, and operations to those who are unable to afford it.
              </motion.p>
              <motion.p
                className="text-lg text-gray-700 leading-relaxed mb-8"
                variants={fadeIn}
              >
                Our society is controlled by a Board of Trustees, with a strict
                mandate that ensures 100% of public donations go directly to
                patient care. No trustee, past or present, receives any monetary
                benefit from the society.
              </motion.p>
              <motion.div variants={fadeIn}>
                <Link href="/about-us">
                  <Button size="lg" variant="outline">
                    Learn More About Our Work
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* NEW: FAQ Section */}
        <FAQSection />

        {/* Final CTA Section */}
        <section className="py-24">
          <motion.div
            className="bg-gradient-to-br from-blue-600 to-teal-500 rounded-3xl p-16 text-center text-white"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.8 }}
          >
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
                  className="bg-white text-blue-600 hover:bg-gray-200 px-8 py-4 text-lg font-semibold transition-transform transform hover:scale-105"
                >
                  Give the Gift of Sight
                </Button>
              </Link>
              <Link href="/how-to-help">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white bg-transparent text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold transition-all transform hover:scale-105"
                >
                  More Ways to Help
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}

// Sub-components with explicit prop types

interface StatCardProps {
  icon: ReactNode;
  end: number;
  label: string;
  isPercentage?: boolean;
}

const StatCard = ({
  icon,
  end,
  label,
  isPercentage = false,
}: StatCardProps) => (
  <motion.div
    className="bg-gray-50 p-6 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
    variants={fadeIn}
  >
    <div className="text-blue-600 mb-4 inline-block">{icon}</div>
    <div className="text-5xl font-bold text-blue-600 mb-2">
      <CountUp end={end} duration={2.5} enableScrollSpy scrollSpyOnce />
      {isPercentage && "%"}
      {label.includes("Restored") || label.includes("Screened") ? "+" : ""}
    </div>
    <div className="text-lg text-gray-600">{label}</div>
  </motion.div>
);

interface HowItWorksStepProps {
  number: number;
  title: string;
  description: string;
  color: string;
}

const HowItWorksStep = ({
  number,
  title,
  description,
  color,
}: HowItWorksStepProps) => (
  <motion.div className="text-center" variants={fadeIn}>
    <div
      className={`relative w-20 h-20 ${color} rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white transition-transform transform hover:scale-110`}
    >
      {number}
    </div>
    <h3 className="text-2xl font-semibold mb-4">{title}</h3>
    <p className="text-gray-600 text-lg leading-relaxed">{description}</p>
  </motion.div>
);

interface SuccessStoryCardProps {
  imageSrc: string;
  imageAlt: string;
  title: string;
  story: string;
  surgeryType: string;
  donorCount: number;
}

const SuccessStoryCard = ({
  imageSrc,
  imageAlt,
  title,
  story,
  surgeryType,
  donorCount,
}: SuccessStoryCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: "easeInOut" }}
    viewport={{ once: true, amount: 0.4 }}
    className="group"
  >
    <Card className="p-8 flex flex-col h-full overflow-hidden transition-shadow hover:shadow-2xl">
      <div className="overflow-hidden rounded-2xl mb-6">
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={500}
          height={300}
          className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <h3 className="text-2xl font-semibold mb-4">{title}</h3>
      <p className="text-gray-700 leading-relaxed mb-4 flex-grow">{story}</p>
      <div className="text-sm text-gray-600 mt-auto pt-4 border-t">
        <strong>Surgery:</strong> {surgeryType} • <strong>Donors:</strong>{" "}
        {donorCount}
      </div>
    </Card>
  </motion.div>
);

const faqData = [
  {
    question: "How do I know my donation is used effectively?",
    answer:
      "We are a 100% volunteer-run society. Every dollar donated by the public goes directly to patient screening, treatment, and surgeries. Our financial records are transparent and available for review to ensure accountability.",
  },
  {
    question: "Can I choose which patient to donate to?",
    answer:
      "Yes. Our platform allows you to browse profiles of verified patients in need. You can read their stories and choose to fund a specific individual's surgery, creating a direct and personal impact.",
  },
  {
    question: "Are my donations tax-deductible?",
    answer:
      "As a registered Canadian non-profit charitable society, all donations are eligible for tax deductions in Canada. You will receive a tax receipt for your contribution.",
  },
  {
    question: "What happens if a campaign doesn't reach its goal?",
    answer:
      "Funds are pooled from general donations to ensure that every patient we commit to helping receives their necessary treatment, regardless of whether their individual campaign reaches its specific goal.",
  },
];

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-gray-50 -mx-4 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          className="text-center mb-16"
          initial="initial"
          whileInView="animate"
          variants={fadeIn}
          viewport={{ once: true, amount: 0.8 }}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your questions, answered. Building trust through transparency.
          </p>
        </motion.div>
        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <button
                className="w-full flex justify-between items-center text-left p-6"
                onClick={() => toggleFAQ(index)}
              >
                <span className="text-lg font-semibold text-gray-800">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`transform transition-transform duration-300 ${
                    activeIndex === index ? "rotate-180" : ""
                  }`}
                  size={24}
                />
              </button>
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <p className="text-gray-600 p-6 pt-0 leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
