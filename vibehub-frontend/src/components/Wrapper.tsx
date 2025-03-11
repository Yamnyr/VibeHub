import { Navigate, useLocation } from "react-router-dom";
import { ReactNode } from "react";
import MainLayout from "./MainLayout";
import {useAuth} from "../context/AuthContext.tsx";

interface WrapperProps {
    children: ReactNode;
}

const Wrapper = ({ children }: WrapperProps) => {
    const location = useLocation();
    const { isAuthenticated } = useAuth();

    const excludedRoutes = ["/login", "/register"];
    const isExcluded = excludedRoutes.includes(location.pathname);

    if (!isAuthenticated && !isExcluded) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (isAuthenticated && isExcluded) {
        return <Navigate to="/" replace />;
    }

    return <div>{isExcluded ? children : <MainLayout>{children}</MainLayout>}</div>;
};

export default Wrapper;