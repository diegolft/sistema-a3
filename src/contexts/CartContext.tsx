import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from "react";
import { toast } from "sonner";
import { useLibrary } from "@/contexts/LibraryContext";
import { requireContext } from "@/lib/context";
import { readJsonArray, safeSetJson } from "@/lib/storage";

const STORAGE_KEY = "sistema-a3-cart";

export type CartLine = { gameId: string };

function isCartLine(x: unknown): x is CartLine {
	return (
		typeof x === "object" &&
		x !== null &&
		"gameId" in x &&
		typeof (x as CartLine).gameId === "string"
	);
}

const readCart = () => readJsonArray(STORAGE_KEY, isCartLine);
const writeCart = (lines: CartLine[]) => safeSetJson(STORAGE_KEY, lines);

type CartContextValue = {
	items: CartLine[];
	itemCount: number;
	addToCart: (gameId: string) => void;
	removeFromCart: (gameId: string) => void;
	/** Recoloca um item sem toast (ex.: desfazer remoção). */
	restoreCartItem: (gameId: string) => void;
	clearCart: () => void;
	finalizePurchase: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
	const { addOwned } = useLibrary();
	const [items, setItems] = useState<CartLine[]>(() => readCart());

	const addToCart = useCallback((gameId: string) => {
		setItems((prev) => {
			if (prev.some((l) => l.gameId === gameId)) {
				toast.message("Este jogo já está no carrinho.");
				return prev;
			}
			const next = [...prev, { gameId }];
			writeCart(next);
			toast.success("Adicionado ao carrinho!");
			return next;
		});
	}, []);

	const removeFromCart = useCallback((gameId: string) => {
		setItems((prev) => {
			const next = prev.filter((l) => l.gameId !== gameId);
			writeCart(next);
			return next;
		});
	}, []);

	const restoreCartItem = useCallback((gameId: string) => {
		setItems((prev) => {
			if (prev.some((l) => l.gameId === gameId)) return prev;
			const next = [...prev, { gameId }];
			writeCart(next);
			return next;
		});
	}, []);

	const clearCart = useCallback(() => {
		setItems([]);
		writeCart([]);
	}, []);

	const finalizePurchase = useCallback(() => {
		if (items.length === 0) return;
		const ids = items.map((l) => l.gameId);
		addOwned(ids);
		clearCart();
		toast.success("Compra finalizada! Jogos na sua biblioteca.");
	}, [items, addOwned, clearCart]);

	const value = useMemo<CartContextValue>(
		() => ({
			items,
			itemCount: items.length,
			addToCart,
			removeFromCart,
			restoreCartItem,
			clearCart,
			finalizePurchase,
		}),
		[items, addToCart, removeFromCart, restoreCartItem, clearCart, finalizePurchase],
	);

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
	return requireContext(useContext(CartContext), "useCart deve ser usado dentro de CartProvider");
}
