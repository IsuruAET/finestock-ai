import { Link } from "react-router-dom";

interface FSLinkProps {
  to?: string;
  href?: string;
  target?: string;
  rel?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  children: React.ReactNode;
  className?: string;
}

const FSLink = ({
  to,
  href,
  target,
  rel,
  onClick,
  children,
  className = "",
}: FSLinkProps) => {
  const baseClassName =
    "font-medium text-blue-900 hover:text-blue-800 hover:underline focus:underline focus:outline-none border-none";
  const combinedClassName = `${baseClassName} ${className}`.trim();

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        onClick={onClick}
        className={combinedClassName}
      >
        {children}
      </a>
    );
  }

  return (
    <Link to={to || "#"} className={combinedClassName} onClick={onClick}>
      {children}
    </Link>
  );
};

export default FSLink;
