import { FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { SiFacebook, SiInstagram, SiX } from "react-icons/si";

const FooterLinks = ({
  href,
  to,
  children,
}: {
  href?: string;
  to?: string;
  children: React.ReactNode;
}) => {
  const className =
    "block text-gray-400 hover:text-white transition-colors duration-200";
  if (to) {
    return (
      <Link to={to} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
};

const SocialLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  const className =
    "w-10 h-10 bg-blue-950 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors duration-200";
  return (
    <a
      href={href}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
};

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4 md:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-blue-950 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold">
                AI Powered Purchase Orders
              </span>
            </Link>
            <p className="text-gray-400 leading-relaxed max-w-sm">
              The simplest way to create and send professional purchase orders.
            </p>
          </div>
          <div>
            <h3 className="text-base font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <FooterLinks to="#features">Features</FooterLinks>
              </li>
              <li>
                <FooterLinks to="#testimonials">Testimonials</FooterLinks>
              </li>
              <li>
                <FooterLinks to="#faq">FAQ</FooterLinks>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-base font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <FooterLinks to="/about">About Us</FooterLinks>
              </li>
              <li>
                <FooterLinks to="/contact">Contact</FooterLinks>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-base font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <FooterLinks to="/privacy">Privacy Policy</FooterLinks>
              </li>
              <li>
                <FooterLinks to="/terms">Terms of Service</FooterLinks>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-16 py-8">
          <div className="flex items-center justify-between flex-col md:flex-row space-y-4 md:space-y-0">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} FineStock AI. All rights
              reserved.
            </p>
            <div className="flex space-x-4">
              <SocialLink href="https://www.facebook.com/finestockai">
                <SiFacebook className="w-5 h-5" />
              </SocialLink>
              <SocialLink href="https://www.twitter.com/finestockai">
                <SiX className="w-5 h-5" />
              </SocialLink>
              <SocialLink href="https://www.instagram.com/finestockai">
                <SiInstagram className="w-5 h-5" />
              </SocialLink>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
