import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";

import Button from "../components/ui/Button";
import notFoundImage from "../assets/images/not-found.png";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-[#fbfbfb] px-4 py-16">
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-size-[60px_60px]" />

      <div className="relative w-full max-w-6xl overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-2xl">
        <div className="absolute -top-24 -left-12 h-52 w-52 rounded-full bg-blue-900/5 blur-3xl" />
        <div className="absolute -bottom-32 -right-10 h-64 w-64 rounded-full bg-orange-400/10 blur-3xl" />

        <div className="grid items-center gap-12 px-6 py-12 sm:px-10 lg:grid-cols-2 lg:px-16">
          <div className="space-y-4 text-left">
            <p className="text-sm font-semibold tracking-wide text-blue-900 uppercase">
              404 — Page not found
            </p>
            <h1 className="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
              Looks like this aisle is empty.
            </h1>
            <p className="text-lg text-slate-600">
              The link you followed might be broken, or the page may have been
              moved. Let&rsquo;s get you back where you need to be.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                variant="primary"
                icon={Home}
                className="w-full sm:w-auto"
                onClick={() => navigate("/")}
              >
                Back to home
              </Button>
              <Button
                variant="secondary"
                icon={ArrowLeft}
                className="w-full sm:w-auto"
                onClick={() => navigate(-1)}
              >
                Go back
              </Button>
            </div>

            <div className="text-sm text-slate-500">
              Or{" "}
              <Link
                to="/dashboard"
                className="font-semibold text-blue-900 hover:text-blue-800 underline underline-offset-4"
              >
                jump to your dashboard
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-900/5 blur-2xl" />
            <div className="absolute -left-8 -bottom-8 h-28 w-28 rounded-full bg-orange-400/10 blur-2xl" />
            <div className="relative flex justify-center">
              <img
                src={notFoundImage}
                alt="page not found"
                className="w-full max-w-[520px] drop-shadow-2xl"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
