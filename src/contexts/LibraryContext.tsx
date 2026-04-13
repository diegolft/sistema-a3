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
import { listOwnedGames } from "@/services/api/users";
import type { OwnedGame } from "@/types/domain";
import { useAuth } from "./AuthContext";

type LibraryContextValue = {
	ownedGames: OwnedGame[];
	ownedIds: number[];
	isLoading: boolean;
	isOwned: (gameId: number) => boolean;
	refreshOwnedGames: () => Promise<void>;
};

const LibraryContext = createContext<LibraryContextValue | null>(null);

export function LibraryProvider({ children }: { children: ReactNode }) {
	const { token, isAuthenticated } = useAuth();
	const [ownedGames, setOwnedGames] = useState<OwnedGame[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	const refreshOwnedGames = useCallback(async () => {
		if (!token) {
			setOwnedGames([]);
			setIsLoading(false);
			return;
		}
		setIsLoading(true);
		try {
			const games = await listOwnedGames(token);
			setOwnedGames(games);
		} finally {
			setIsLoading(false);
		}
	}, [token]);

	useEffect(() => {
		if (!isAuthenticated || !token) {
			setOwnedGames([]);
			setIsLoading(false);
			return;
		}
		void refreshOwnedGames();
	}, [isAuthenticated, refreshOwnedGames, token]);

	const ownedIds = useMemo(() => ownedGames.map((entry) => entry.jogo.id), [ownedGames]);
	const isOwned = useCallback((gameId: number) => ownedIds.includes(gameId), [ownedIds]);

	const value = useMemo(
		() => ({ ownedGames, ownedIds, isLoading, isOwned, refreshOwnedGames }),
		[ownedGames, ownedIds, isLoading, isOwned, refreshOwnedGames],
	);

	return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export function useLibrary(): LibraryContextValue {
	return requireContext(
		useContext(LibraryContext),
		"useLibrary deve ser usado dentro de LibraryProvider",
	);
}
