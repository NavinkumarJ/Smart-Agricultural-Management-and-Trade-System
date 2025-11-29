import { motion } from "framer-motion";
import {
  MapPin,
  Bot,
  Cloud,
  Sprout,
  Tractor,
  ShieldCheck,
  Leaf,
  ShoppingCart
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="py-16 bg-[#F7F7F7] text-[#111827]">
      <div className="container-max mx-auto px-6">

        {/* HERO SECTION */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h1 className="text-5xl font-extrabold leading-tight">
            Transforming Agriculture with{" "}
            <span className="text-[#2E7D32]">Technology, AI & Data</span>
          </h1>

          <p className="mt-4 text-gray-600 text-lg">
            Smart Agriculture Trade System brings together farm analytics, AI-driven 
            recommendations, real-time monitoring, and direct marketplace integration 
            to empower farmers, consumers, and agricultural enterprises.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <a
              href="/chat-bot"
              className="px-8 py-3 rounded-xl bg-[#2E7D32] text-white font-semibold shadow hover:opacity-90 transition"
            >
              Start Using AI Assistant
            </a>

            <a
              href="#overview"
              className="px-8 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition"
            >
              Learn More
            </a>
          </div>
        </motion.section>


        {/* WHAT WE DO */}
        <section id="overview" className="mt-20 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold">What We Do</h2>
          <p className="mt-3 text-gray-600">
            Our platform helps farmers grow smarter, sell better, and operate more efficiently 
            by blending AI, IoT, satellite insights, and marketplace transparency.
          </p>

          <div className="mt-10 grid md:grid-cols-3 gap-6">
            <InfoCard
              icon={<Sprout size={38} />}
              title="Grow Smarter"
              desc="AI analyses soil, weather & crop patterns to recommend the best crop choices & detect diseases."
            />
            <InfoCard
              icon={<MapPin size={38} />}
              title="Monitor Efficiently"
              desc="Track your farm with sensor data, irrigation points, satellite views & weather alerts."
            />
            <InfoCard
              icon={<ShoppingCart size={38} />}
              title="Sell Transparently"
              desc="Farmers sell produce directly to customers with full traceability & QR-based product identity."
            />
          </div>
        </section>


        {/* WHY THIS PLATFORM */}
        <section className="mt-20 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold">Why Smart Agriculture Trade System?</h2>
          <p className="mt-3 text-gray-600">
            Agriculture faces unpredictable climate, limited technical knowledge, lack of crop transparency, 
            and poor market access. Our platform solves these with AI-driven insights and a digital marketplace.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mt-12 text-left">
            <BulletPoint text="Reduce crop loss through early disease detection." />
            <BulletPoint text="Get AI-based crop recommendations for soil & locality." />
            <BulletPoint text="Monitor weather & farm conditions in real time." />
            <BulletPoint text="Enable fair, direct trade with transparent pricing." />
            <BulletPoint text="Access farm data from anywhere, anytime." />
            <BulletPoint text="Provide customers with verified crop traceability." />
          </div>
        </section>


        {/* FEATURES SECTION */}
        <section className="mt-20">
          <h2 className="text-3xl font-bold text-center">Platform Features</h2>
          <p className="text-center text-gray-600 mt-2">
            A complete toolkit designed for modern farming operations.
          </p>

          <div className="grid md:grid-cols-3 gap-10 mt-12">
            <FeatureCard
              icon={<MapPin size={45} />}
              title="Farm Dashboard"
              desc="Map your plots, sensor points & irrigation systems with satellite view support."
            />

            <FeatureCard
              icon={<Leaf size={45} />}
              title="Crop Recommendation"
              desc="AI recommends the best-suited crops for your soil & weather patterns."
            />

            <FeatureCard
              icon={<Cloud size={45} />}
              title="Weather Monitoring"
              desc="Get accurate local forecasts & alerts for rain, frost, storms & heatwaves."
            />

            <FeatureCard
              icon={<Bot size={45} />}
              title="Gemini AI Assistant"
              desc="Ask crop questions & receive instant expert guidance powered by AI."
            />

            <FeatureCard
              icon={<Tractor size={45} />}
              title="Tools & Equipment Manager"
              desc="Track farm equipment inventory, usage, condition & availability."
            />

            <FeatureCard
              icon={<ShieldCheck size={45} />}
              title="Transparent Marketplace"
              desc="Buy & sell produce with QR-based origin traceability & secure transactions."
            />
          </div>
        </section>


        {/* WORKFLOW SECTION */}
        <section className="mt-20 max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center">How the System Works</h2>

          <div className="grid md:grid-cols-4 gap-6 mt-10">
            <WorkflowStep number="1" title="Analyze Soil" desc="Input soil data or sensors detect field conditions." />
            <WorkflowStep number="2" title="AI Suggestions" desc="AI recommends crops & detects issues using images." />
            <WorkflowStep number="3" title="Monitor Farm" desc="Keep track of weather alerts & field metrics." />
            <WorkflowStep number="4" title="Sell Produce" desc="List crops & allow customers to verify via QR traceability." />
          </div>
        </section>


        {/* CTA */}
        <section className="mt-24 text-center">
          <h2 className="text-3xl font-bold">Ready to Revolutionize Farming?</h2>
          <p className="text-gray-600 mt-2">
            Start using AI tools, modern dashboards & transparent trading today.
          </p>
          <div className="mt-6">
            <a
              href="/chat-bot"
              className="px-8 py-3 rounded-xl bg-[#2E7D32] text-white font-semibold shadow hover:opacity-95 transition"
            >
              Start Now
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}



/* --- SMALL REUSABLE COMPONENTS --- */

function InfoCard({ icon, title, desc }) {
  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      className="card p-6"
    >
      <div className="text-[#2E7D32] mb-3">{icon}</div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-gray-600 mt-1 text-sm">{desc}</p>
    </motion.div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="card p-7"
    >
      <div className="text-[#2E7D32]">{icon}</div>
      <h3 className="text-xl font-semibold mt-4">{title}</h3>
      <p className="text-gray-600 mt-2">{desc}</p>
    </motion.div>
  );
}

function BulletPoint({ text }) {
  return (
    <div className="flex gap-3 items-start">
      <div className="mt-1 w-3 h-3 rounded-full bg-[#2E7D32]"></div>
      <p className="text-gray-700 text-sm">{text}</p>
    </div>
  );
}

function WorkflowStep({ number, title, desc }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="card p-6 text-center"
    >
      <div className="text-4xl font-extrabold text-[#2E7D32]">{number}</div>
      <h4 className="font-semibold mt-3">{title}</h4>
      <p className="text-gray-600 text-sm mt-2">{desc}</p>
    </motion.div>
  );
}
