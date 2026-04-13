import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

type Props = {
	role: string;
};

export function RequireRole({ role }: Props) {
	const { isAuthenticated, isLoadingUser, user } = useAuth();

	if (!isAuthenticated) {
		return <Navigate to="/login" replace state={{ next: "/admin" }} />;
	}

	if (isLoadingUser) {
		return <p className="py-10 text-center text-[14px] text-neutral-400">Carregando permissões...</p>;
	}

	if (user?.perfil !== role) {
		return <Navigate to="/jogos" replace />;
	}

	return <Outlet />;
}
