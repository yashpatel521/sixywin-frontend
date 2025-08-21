import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Navigate } from "react-router-dom";
import { useMemo } from "react";
import { ProtectedRoutesProps } from "@/libs/interfaces";
import { getUserProfile } from "./storage";

export const ProtectedRoutes = ({ children }: ProtectedRoutesProps) => {
  const userProfile = getUserProfile();
  const isAuthenticated = useMemo(() => !!userProfile?.user, [userProfile]);

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};
