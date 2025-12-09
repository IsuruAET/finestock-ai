import spinner from "../../assets/images/page-spinner.svg";

const PageLoader = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-[#f7f7f8]">
    <img
      src={spinner}
      alt="Loading"
      className="h-20 w-20"
      loading="lazy"
      aria-live="polite"
    />
  </div>
);

export default PageLoader;
