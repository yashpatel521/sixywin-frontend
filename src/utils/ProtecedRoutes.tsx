import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { useWebSocketStore } from "@/store/websocketStore";
import { Navigate } from "react-router-dom";
import { useMemo } from "react";
import { ProtectedRoutesProps } from "@/libs/interfaces";

export const ProtectedRoutes = ({
  children,
  isProtected = true,
  checklogin = true,
}: ProtectedRoutesProps) => {
  const { user } = useWebSocketStore(); // Get user from Zustand store
  const isAuthenticated = useMemo(() => !!user, [user]);

  if (checklogin && !isAuthenticated) {
    if (isProtected && !isAuthenticated)
      return <Navigate to="/login" replace />;

    if (!isProtected && isAuthenticated)
      return <Navigate to="/games" replace />;
  }

  // Render layout
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};
