import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { requireContext } from "@/lib/context";
import { listSales } from "@/services/api/sales";
import type { Sale } from "@/types/domain";
import { useAuth } from "./AuthContext";

type SalesContextValue = {
	sales: Sale[];
	isLoading: boolean;
	refreshSales: () => Promise<void>;
};

const SalesContext = createContext<SalesContextValue | null>(null);

export function SalesProvider({ children }: { children: ReactNode }) {
	const { token, isAuthenticated } = useAuth();
	const [sales, setSales] = useState<Sale[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	const refreshSales = useCallback(async () => {
		if (!token) {
			setSales([]);
			setIsLoading(false);
			return;
		}
		setIsLoading(true);
		try {
			const nextSales = await listSales(token);
			setSales(nextSales);
		} finally {
			setIsLoading(false);
		}
	}, [token]);

	useEffect(() => {
		if (!isAuthenticated || !token) {
			setSales([]);
			setIsLoading(false);
			return;
		}
		void refreshSales();
	}, [isAuthenticated, refreshSales, token]);

	const value = useMemo(
		() => ({
			sales,
			isLoading,
			refreshSales,
		}),
		[sales, isLoading, refreshSales],
	);

	return <SalesContext.Provider value={value}>{children}</SalesContext.Provider>;
}

export function useSales(): SalesContextValue {
	return requireContext(useContext(SalesContext), "useSales deve ser usado dentro de SalesProvider");
}
