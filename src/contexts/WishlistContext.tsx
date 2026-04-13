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
import { addWishlistGame, listWishlist, removeWishlistGame } from "@/services/api/wishlist";
import type { WishlistGame } from "@/types/domain";
import { useAuth } from "./AuthContext";

type WishlistContextValue = {
	wishlistGames: WishlistGame[];
	wishlistIds: number[];
	isLoading: boolean;
	hasWishlist: (gameId: number) => boolean;
	toggleWishlist: (gameId: number) => Promise<void>;
	refreshWishlist: () => Promise<void>;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
	const { token, isAuthenticated } = useAuth();
	const [wishlistGames, setWishlistGames] = useState<WishlistGame[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	const refreshWishlist = useCallback(async () => {
		if (!token) {
			setWishlistGames([]);
			setIsLoading(false);
			return;
		}
		setIsLoading(true);
		try {
			const games = await listWishlist(token);
			setWishlistGames(games);
		} finally {
			setIsLoading(false);
		}
	}, [token]);

	useEffect(() => {
		if (!isAuthenticated || !token) {
			setWishlistGames([]);
			setIsLoading(false);
			return;
		}
		void refreshWishlist();
	}, [isAuthenticated, refreshWishlist, token]);

	const wishlistIds = useMemo(() => wishlistGames.map((game) => game.id), [wishlistGames]);

	const hasWishlist = useCallback((gameId: number) => wishlistIds.includes(gameId), [wishlistIds]);

	const toggleWishlist = useCallback(
		async (gameId: number) => {
			if (!token) {
				throw new Error("Sessao necessaria para acessar a lista de desejos.");
			}

			if (wishlistIds.includes(gameId)) {
				await removeWishlistGame(gameId, token);
				await refreshWishlist();
				toast.message("Removido da lista de desejos.", {
					action: {
						label: "Desfazer",
						onClick: () => {
							void addWishlistGame(gameId, token).then(refreshWishlist);
						},
					},
				});
				return;
			}

			await addWishlistGame(gameId, token);
			await refreshWishlist();
			toast.success("Adicionado a lista de desejos!");
		},
		[refreshWishlist, token, wishlistIds],
	);

	const value = useMemo(
		() => ({ wishlistGames, wishlistIds, isLoading, hasWishlist, toggleWishlist, refreshWishlist }),
		[wishlistGames, wishlistIds, isLoading, hasWishlist, toggleWishlist, refreshWishlist],
	);

	return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist(): WishlistContextValue {
	return requireContext(
		useContext(WishlistContext),
		"useWishlist deve ser usado dentro de WishlistProvider",
	);
}
