import { useNavigate, useLocation, RouteProps } from "react-router-dom";
import { useEffect } from "react";
import { useTypedSelector } from "../../hooks/useTypedSelector";

interface IProps extends RouteProps {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: IProps) => {
  let navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = useTypedSelector((s) => s.users.isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", {
        replace: true,
        state: location.pathname,
      });
    }
  }, [isLoggedIn, location.pathname, navigate]);
  return children;
};

export default ProtectedRoute;
