import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from "react";
import { requireContext } from "@/lib/context";
import { readJsonArray, safeSetJson } from "@/lib/storage";

const STORAGE_KEY = "sistema-a3-library";

const isStringId = (x: unknown): x is string => typeof x === "string";
const readIds = () => readJsonArray(STORAGE_KEY, isStringId);
const writeIds = (ids: string[]) => safeSetJson(STORAGE_KEY, ids);

type LibraryContextValue = {
	ownedIds: string[];
	isOwned: (gameId: string) => boolean;
	addOwned: (gameIds: string[]) => void;
};

const LibraryContext = createContext<LibraryContextValue | null>(null);

export function LibraryProvider({ children }: { children: ReactNode }) {
	const [ownedIds, setOwnedIds] = useState<string[]>(() => readIds());

	const addOwned = useCallback((gameIds: string[]) => {
		setOwnedIds((prev) => {
			const next = new Set(prev);
			for (const id of gameIds) next.add(id);
			const arr = [...next];
			writeIds(arr);
			return arr;
		});
	}, []);

	const isOwned = useCallback((gameId: string) => ownedIds.includes(gameId), [ownedIds]);

	const value = useMemo(() => ({ ownedIds, isOwned, addOwned }), [ownedIds, isOwned, addOwned]);

	return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export function useLibrary(): LibraryContextValue {
	return requireContext(
		useContext(LibraryContext),
		"useLibrary deve ser usado dentro de LibraryProvider",
	);
}
