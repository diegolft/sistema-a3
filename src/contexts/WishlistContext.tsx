import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from "react";
import { toast } from "sonner";
import { requireContext } from "@/lib/context";
import { readJsonArray, safeSetJson } from "@/lib/storage";

const STORAGE_KEY = "sistema-a3-wishlist";

const isStringId = (x: unknown): x is string => typeof x === "string";
const readIds = () => readJsonArray(STORAGE_KEY, isStringId);
const writeIds = (ids: string[]) => safeSetJson(STORAGE_KEY, ids);

type WishlistContextValue = {
	wishlistIds: string[];
	hasWishlist: (gameId: string) => boolean;
	toggleWishlist: (gameId: string) => void;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
	const [wishlistIds, setWishlistIds] = useState<string[]>(() => readIds());

	const toggleWishlist = useCallback((gameId: string) => {
		let wasRemoved = false;
		setWishlistIds((prev) => {
			const has = prev.includes(gameId);
			const next = has ? prev.filter((id) => id !== gameId) : [...prev, gameId];
			writeIds(next);
			wasRemoved = has;
			return next;
		});
		if (wasRemoved) {
			toast.message("Removido da lista de desejos", {
				action: {
					label: "Desfazer",
					onClick: () => {
						setWishlistIds((p) => {
							if (p.includes(gameId)) return p;
							const n = [...p, gameId];
							writeIds(n);
							return n;
						});
					},
				},
			});
		} else {
			toast.success("Adicionado à lista de desejos!");
		}
	}, []);

	const hasWishlist = useCallback((gameId: string) => wishlistIds.includes(gameId), [wishlistIds]);

	const value = useMemo(
		() => ({ wishlistIds, hasWishlist, toggleWishlist }),
		[wishlistIds, hasWishlist, toggleWishlist],
	);

	return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist(): WishlistContextValue {
	return requireContext(
		useContext(WishlistContext),
		"useWishlist deve ser usado dentro de WishlistProvider",
	);
}
