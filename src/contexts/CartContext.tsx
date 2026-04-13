import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { toast } from "sonner";
import { requireContext } from "@/lib/context";
import { addCartItem, getActiveCart, removeCartItem } from "@/services/api/carts";
import { checkout, paySale } from "@/services/api/sales";
import type { Cart, CartItem, PaymentMethod } from "@/types/domain";
import { useAuth } from "./AuthContext";
import { useLibrary } from "./LibraryContext";
import { useSales } from "./SalesContext";

type CartContextValue = {
	cart: Cart | null;
	items: CartItem[];
	itemCount: number;
	isLoading: boolean;
	addToCart: (gameId: number) => Promise<void>;
	removeFromCart: (gameId: number) => Promise<void>;
	refreshCart: () => Promise<void>;
	finalizePurchase: (method: PaymentMethod) => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
	const { token, isAuthenticated } = useAuth();
	const { refreshOwnedGames } = useLibrary();
	const { refreshSales } = useSales();
	const [cart, setCart] = useState<Cart | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const refreshCart = useCallback(async () => {
		if (!token) {
			setCart(null);
			setIsLoading(false);
			return;
		}
		setIsLoading(true);
		try {
			const nextCart = await getActiveCart(token);
			setCart(nextCart);
		} finally {
			setIsLoading(false);
		}
	}, [token]);

	useEffect(() => {
		if (!isAuthenticated || !token) {
			setCart(null);
			setIsLoading(false);
			return;
		}
		void refreshCart();
	}, [isAuthenticated, refreshCart, token]);

	const addToCartHandler = useCallback(
		async (gameId: number) => {
			if (!token) {
				throw new Error("Sessao necessaria para adicionar ao carrinho.");
			}
			await addCartItem(gameId, token);
			await refreshCart();
			toast.success("Adicionado ao carrinho!");
		},
		[refreshCart, token],
	);

	const removeFromCartHandler = useCallback(
		async (gameId: number) => {
			if (!token) {
				throw new Error("Sessao necessaria para alterar o carrinho.");
			}
			await removeCartItem(gameId, token);
			await refreshCart();
		},
		[refreshCart, token],
	);

	const finalizePurchase = useCallback(
		async (method: PaymentMethod) => {
			if (!token) {
				throw new Error("Sessao necessaria para finalizar a compra.");
			}
			await checkout(token);
			await paySale(method, token);
			await Promise.all([refreshCart(), refreshOwnedGames(), refreshSales()]);
			toast.success("Compra concluida com sucesso!");
		},
		[refreshCart, refreshOwnedGames, refreshSales, token],
	);

	const items = cart?.items ?? [];
	const value = useMemo<CartContextValue>(
		() => ({
			cart,
			items,
			itemCount: items.length,
			isLoading,
			addToCart: addToCartHandler,
			removeFromCart: removeFromCartHandler,
			refreshCart,
			finalizePurchase,
		}),
		[cart, items, isLoading, addToCartHandler, removeFromCartHandler, refreshCart, finalizePurchase],
	);

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
	return requireContext(useContext(CartContext), "useCart deve ser usado dentro de CartProvider");
}
