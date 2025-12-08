import { useAuthContext } from "../../context/AuthContext";
// import Navbar from "./Navbar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthContext();
  return (
    <div>
      {/* <Navbar /> */}
      {user && <div>{children}</div>}
    </div>
  );
};

export default DashboardLayout;
