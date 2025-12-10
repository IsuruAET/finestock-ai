import { Link } from "react-router-dom";
import heroImg from "../../assets/images/hero-img.png";
import { useAuthContext } from "../../context/AuthContext";

const HeroSection = () => {
  const { isAuthenticated } = useAuthContext();

  return (
    <section className="relative bg-[#fbfbfb] overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-size-[60px_60px]"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold text-blue-950 leading-tight mb-6">
            AI-Powered Supply Requests, Made Effortless
          </h1>
          <p className="text-base text-gray-700 mb-8 leading-relaxed max-w-3xl mx-auto">
            Let our AI handle your supply requests, track inventory
            automatically, generate order reminders, and provide smart insights
            to help you manage your procurement efficiently.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-4">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="w-full sm:w-auto bg-linear-to-r from-blue-950 to-blue-900 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base hover:bg-blue-900 transition-all duration-200 hover:scale-105 hover:shadow-2xl transform text-center"
              >
                Go to Dashboard
              </Link>
            ) : (
              <Link
                to="/signup"
                className="w-full sm:w-auto bg-linear-to-r from-blue-950 to-blue-900 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base hover:bg-blue-800 transition-all duration-200 hover:scale-105 hover:shadow-2xl transform text-center"
              >
                Get Started for Free
              </Link>
            )}
            <a
              href="#features"
              className="w-full sm:w-auto border-2 border-black text-black px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base hover:bg-white hover:text-black transition-all duration-200 hover:scale-105 text-center"
            >
              Learn More
            </a>
          </div>
        </div>
        <div className="mt-12 sm:mt-16 relative max-w-5xl mx-auto px-4 sm:px-0">
          <img
            src={heroImg}
            alt="hero-img"
            className="w-full h-auto rounded-2xl shadow-2xl shadow-gray-300 border-4 border-gray-200/20"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
