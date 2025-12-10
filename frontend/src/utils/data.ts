import { BarChart2, FileText, Mail, Sparkles } from "lucide-react";

export const APP_FEATURES = [
  {
    icon: Sparkles,
    title: "AI-Powered Purchase Orders",
    description:
      "Paste any text, email, or receipt and let our AI instantly create a complete, professional purchase order for your team.",
  },
  {
    icon: BarChart2,
    title: "AI-Powered Dashboard",
    description:
      "Get smart, actionable insights about your purchase orders and inventory, generated automatically by our AI analyst.",
  },
  {
    icon: Mail,
    title: "AI-Powered Order Reminders",
    description:
      "Automatically generate polite and effective reminders for pending purchase orders with a single click.",
  },
  {
    icon: FileText,
    title: "Easy Order Tracking",
    description:
      "Easily manage all your purchase orders, track order statuses, and send reminders for pending approvals or deliveries.",
  },
];

export const TESTIMONIALS = [
  {
    author: "Avery Lin",
    title: "Ops Lead, Northwind Logistics",
    quote:
      "We cut intake time by 70%. The AI drafts crystal-clear requests and our team actually reads them now.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
  },
  {
    author: "Marcos Vega",
    title: "Procurement Manager, Horizon Health",
    quote:
      "The dashboard flags stalled orders before they become fires. Approvals are faster and vendors love the clean summaries.",
    avatar: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39",
  },
  {
    author: "Priya Raman",
    title: "Head of Facilities, Brightline Studios",
    quote:
      "Order reminders run themselves now. We stay stocked, finance is happy, and I get fewer Slack pings.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
  },
];

export type FAQ = {
  question: string;
  answer: string;
};

export const FAQS: FAQ[] = [
  {
    question: "What is FineStock AI?",
    answer:
      "FineStock AI is an intelligent purchase order and inventory management platform that uses AI to automate the creation, tracking, and management of purchase orders. It transforms unstructured text, emails, or receipts into professional purchase orders instantly.",
  },
  {
    question: "How does the AI generate purchase orders?",
    answer:
      "Simply paste any text, email, or upload a receipt. Our AI analyzes the content, extracts relevant details like item names, quantities, and specifications, then automatically creates a complete, formatted purchase order ready for approval.",
  },
  {
    question: "What kind of insights does the AI dashboard provide?",
    answer:
      "The AI dashboard analyzes your purchase orders and inventory patterns to provide actionable insights such as spending trends, approval bottlenecks, frequently requested items, and recommendations for bulk ordering or vendor negotiations.",
  },
  {
    question: "Can I integrate FineStock AI with existing systems?",
    answer:
      "Yes, FineStock AI is designed to work alongside your existing procurement and inventory systems. We offer API access and integrations with popular business tools to streamline your workflow.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. We use enterprise-grade encryption, secure cloud storage, and follow industry best practices for data protection. Your purchase orders and inventory data are encrypted both in transit and at rest.",
  },
  {
    question: "How do the AI-powered order reminders work?",
    answer:
      "The system automatically identifies pending orders that need follow-up. With one click, it generates polite, professional reminder messages tailored to the specific situation, saving you time while maintaining good vendor relationships.",
  },
  {
    question: "What types of organizations can use FineStock AI?",
    answer:
      "FineStock AI is perfect for any organization that manages supplies and inventory, including healthcare facilities, educational institutions, offices, manufacturing companies, and facilities management teams. It scales from small teams to large enterprises.",
  },
];
