import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LandingPage } from "@/pages/LandingPage";

/** Visitantes veem a landing; usuários logados vão direto ao catálogo. */
export function PublicHomeRoute() {
	const { isAuthenticated } = useAuth();
	if (isAuthenticated) {
		return <Navigate to="/jogos" replace />;
	}
	return <LandingPage />;
}
