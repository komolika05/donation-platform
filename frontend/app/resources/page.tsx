import Navbar from "@/components/layout/Navbar";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Image from "next/image";

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      {/* Resources Hero Section */}
      <section className="relative w-full h-[70vh] flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/adult-patient-consultation-with-surgeon-in-modern-.jpg"
            alt="Resources and support"
            layout="fill"
            objectFit="cover"
            className="brightness-75"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            Resources & Support
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-8">
            Everything you need to maximize your impact and understand our
            mission
          </p>
          {/* Optional CTA Button */}
          <div className="flex justify-center gap-4">
            <button className="bg-white text-blue-700 font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
              Explore Resources
            </button>
          </div>
        </div>
      </section>

      {/* Resource Categories */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Resource Categories
            </h2>
            <p className="text-lg text-muted-foreground">
              Find the information you need to get started
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Donor Guides */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="mb-4">
                <img
                  src="/donation-guide-illustration-with-heart-and-medical.jpg"
                  alt="Donor Guide"
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Donor Guides
              </h3>
              <p className="text-muted-foreground mb-4">
                Step-by-step guides to help you make the most impactful
                donations
              </p>
              <Button variant="outline" size="sm">
                View Guides
              </Button>
            </Card>

            {/* Impact Reports */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="mb-4">
                <img
                  src="/impact-report-charts-and-graphs-showing-medical-st.jpg"
                  alt="Impact Reports"
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Impact Reports
              </h3>
              <p className="text-muted-foreground mb-4">
                Detailed reports showing how your donations are making a
                difference
              </p>
              <Button variant="outline" size="sm">
                View Reports
              </Button>
            </Card>

            {/* Tax Information */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="mb-4">
                <img
                  src="/tax-documents-and-calculator-for-charitable-donati.jpg"
                  alt="Tax Information"
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Tax Information
              </h3>
              <p className="text-muted-foreground mb-4">
                Everything you need to know about tax benefits for charitable
                giving
              </p>
              <Button variant="outline" size="sm">
                Learn More
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="py-20 bg-jkvis-light">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-6">
                Featured Resources
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-jkvis-primary rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Getting Started Guide
                    </h3>
                    <p className="text-muted-foreground">
                      Learn how to create your account and make your first
                      donation in just a few minutes.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-jkvis-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Maximizing Impact
                    </h3>
                    <p className="text-muted-foreground">
                      Discover strategies to make your donations go further and
                      create lasting change.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-jkvis-accent rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Tracking Your Impact
                    </h3>
                    <p className="text-muted-foreground">
                      Use our dashboard to see real-time updates on how your
                      donations are being used.
                    </p>
                  </div>
                </div>
              </div>

              <Button className="mt-8 bg-jkvis-primary hover:bg-jkvis-primary/90">
                Download Complete Guide
              </Button>
            </div>

            <div className="relative">
              <img
                src="/modern-dashboard-interface-showing-donation-tracki.jpg"
                alt="Resource Dashboard"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-foreground text-center mb-16">
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              {[
                {
                  question:
                    "How do I know my donation is being used effectively?",
                  answer:
                    "We provide complete transparency with real-time tracking, detailed impact reports, and regular updates on funded projects. You'll receive receipts and can track your donation's journey through our dashboard.",
                },
                {
                  question:
                    "What percentage of my donation goes to administrative costs?",
                  answer:
                    "100% of your donation goes directly to healthcare needs. Our operational costs are covered separately through grants and corporate partnerships, ensuring maximum impact for your contribution.",
                },
                {
                  question: "Can I specify which medical cases to support?",
                  answer:
                    "Yes! You can browse active cases and choose specific patients or medical needs to support. You can also set up recurring donations for ongoing cases that matter to you.",
                },
                {
                  question: "How do I get tax receipts for my donations?",
                  answer:
                    "Tax receipts are automatically generated and emailed to you immediately after each donation. You can also access all your receipts through your donor dashboard at any time.",
                },
              ].map((faq, index) => (
                <Card key={index} className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-jkvis-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Need More Help?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Our support team is here to help you make the most of your giving
            experience
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-jkvis-dark hover:bg-white/90"
            >
              Contact Support
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 bg-transparent"
            >
              Schedule a Call
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
