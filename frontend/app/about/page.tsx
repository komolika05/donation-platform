import Navbar from "@/components/layout/Navbar";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      {/* Hero Section */}
      <section className="relative w-full h-[90vh] flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/young-boy-child-patient-with-family-in-hospital-ro.jpg"
            alt="Healthcare impact"
            layout="fill"
            objectFit="cover"
            className="brightness-75"
          />
          {/* Optional overlay gradient for better text contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            Transforming Healthcare Through
            <span className="block text-yellow-400">Compassionate Giving</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-8">
            JKVIS connects generous hearts with critical healthcare needs,
            ensuring every donation creates lasting impact worldwide.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
              Our Impact
            </button>
            <button className="border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white/10 hover:scale-105 transition-transform duration-300">
              Join Our Mission
            </button>
          </div>
        </div>

        {/* Optional floating badge */}
        <div className="absolute bottom-20 left-50 bg-yellow-400 text-black px-4 py-2 rounded-lg shadow-lg animate-bounce hidden md:block">
          100% Transparency
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                JKVIS was founded on the belief that healthcare should be
                accessible to everyone, regardless of their economic
                circumstances.
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Through our transparent platform, we ensure that 100% of
                donations reach their intended recipients, with real-time
                tracking.
              </p>

              <div className="grid grid-cols-2 gap-6 mt-8">
                {[
                  { value: "50,000+", label: "Lives Impacted" },
                  { value: "$2.5M+", label: "Funds Raised" },
                ].map((stat, idx) => (
                  <div
                    key={idx}
                    className="bg-white/5 backdrop-blur-md p-6 rounded-xl shadow-lg text-center transform hover:scale-105 transition-transform duration-300"
                  >
                    <div className="text-3xl font-bold text-jkvis-primary mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm text-white/80">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <Image
                height={600}
                width={600}
                src="/diverse-medical-team-helping-patients-in-modern-ho.jpg"
                alt="Medical team helping patients"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Impact Visualization */}
      <section className="py-20 bg-jkvis-dark text-black-700">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-balance">
              Know that your donation is making a difference
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto text-balance">
              JKVIS uses 100% of your donation to fund critical healthcare needs
              and provides complete transparency with real-time updates and
              reports.
            </p>
          </div>

          <div className="relative">
            <Image
              height={600}
              width={700}
              src="/world-map-showing-global-healthcare-impact-with-st.jpg"
              alt="Global impact visualization"
              className="w-full rounded-2xl shadow-2xl"
            />

            {/* Floating stats cards */}
            <div className="absolute top-8 right-8 grid grid-cols-3 gap-8 text-center">
              {[
                { val: 50336, label: "patients helped" },
                { val: 186000, label: "medical procedures" },
                { val: 45, label: "countries" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 shadow-lg hover:scale-105 transition-transform duration-300"
                >
                  <div className="text-2xl text-white/80 font-bold text-jkvis-accent">
                    {item.val.toLocaleString()}
                  </div>
                  <div className="text-sm text-white/80">{item.label}</div>
                </div>
              ))}
            </div>

            <div className="absolute top-8 left-8 bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-3xl text-white/80 font-bold text-jkvis-accent mb-2">
                JKVIS: Healthcare
              </div>
              <div className="text-sm text-white/80">
                Last updated: December 2024
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Meet Our Team
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Dedicated professionals working tirelessly to make healthcare
              accessible to all
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Dr. Sarah Johnson",
                role: "Chief Medical Officer",
                image: "/professional-female-doctor-smiling-in-white-coat.jpg",
              },
              {
                name: "Michael Chen",
                role: "Director of Operations",
                image: "/professional-asian-male-in-business-suit-smiling.jpg",
              },
              {
                name: "Dr. Amara Okafor",
                role: "Global Health Coordinator",
                image:
                  "/professional-african-female-doctor-in-medical-sett.jpg",
              },
            ].map((member, idx) => (
              <Card
                key={idx}
                className="p-6 text-center hover:shadow-lg hover:scale-105 transition-transform duration-300"
              >
                <Image
                  height={128}
                  width={128}
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {member.name}
                </h3>
                <p className="text-muted-foreground">{member.role}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Join thousands of donors who are transforming lives through
            healthcare accessibility
          </p>
          <Button className="bg-yellow-500 text-jkvis-primary font-semibold px-10 py-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            Start Donating Today
          </Button>
        </div>
      </section>
    </div>
  );
}
