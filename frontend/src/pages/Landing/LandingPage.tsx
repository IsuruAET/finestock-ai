import FAQSection from "../../components/landing/FAQSection";
import FeaturesSection from "../../components/landing/FeaturesSection";
import Footer from "../../components/landing/Footer";
import Header from "../../components/landing/Header";
import HeroSection from "../../components/landing/HeroSection";
import TestimonialsSection from "../../components/landing/TestimonialsSection";

const LandingPage = () => {
  return (
    <div className="bg-white text-gray-600 min-h-screen">
      <Header />
      <main className="pt-16 lg:pt-20">
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
