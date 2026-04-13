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
import { decodeAuthToken, isTokenExpired } from "@/lib/jwt";
import { safeGetItem, safeSetItem } from "@/lib/storage";
import {
	type ChangePasswordBody,
	changePassword as changePasswordApi,
	type LoginBody,
	loginUser,
	type RegisterBody,
	registerUser,
} from "@/services/api/auth";
import { ApiError } from "@/services/api/client";
import { getCurrentUser, type UpdateUserBody, updateUser } from "@/services/api/users";
import type { AuthUser } from "@/types/domain";

const STORAGE_KEY = "sistema-a3-auth-token";

type AuthContextValue = {
	token: string | null;
	isAuthenticated: boolean;
	isAdmin: boolean;
	isLoadingUser: boolean;
	user: AuthUser | null;
	login: (body: LoginBody) => Promise<void>;
	register: (body: RegisterBody) => Promise<void>;
	changePassword: (body: ChangePasswordBody) => Promise<void>;
	refreshUser: () => Promise<AuthUser | null>;
	updateProfile: (body: UpdateUserBody) => Promise<void>;
	logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredToken(): string | null {
	const token = safeGetItem(STORAGE_KEY);
	if (!token) return null;
	const decoded = decodeAuthToken(token);
	return decoded && !isTokenExpired(decoded) ? token : null;
}

function writeStoredToken(token: string | null) {
	safeSetItem(STORAGE_KEY, token);
}

export function AuthProvider({ children }: { children: ReactNode }) {
	const [token, setTokenState] = useState<string | null>(readStoredToken);
	const [user, setUser] = useState<AuthUser | null>(null);
	const [isLoadingUser, setIsLoadingUser] = useState(Boolean(token));

	const clearSession = useCallback(() => {
		setTokenState(null);
		setUser(null);
		setIsLoadingUser(false);
		writeStoredToken(null);
	}, []);

	const setToken = useCallback(
		(nextToken: string | null) => {
			if (!nextToken) {
				clearSession();
				return;
			}

			const decoded = decodeAuthToken(nextToken);
			if (!decoded || isTokenExpired(decoded)) {
				clearSession();
				return;
			}

			setTokenState(nextToken);
			writeStoredToken(nextToken);
			setIsLoadingUser(true);
		},
		[clearSession],
	);

	const refreshUser = useCallback(async (): Promise<AuthUser | null> => {
		if (!token) {
			setUser(null);
			setIsLoadingUser(false);
			return null;
		}

		const decoded = decodeAuthToken(token);
		if (!decoded || isTokenExpired(decoded)) {
			clearSession();
			return null;
		}

		setIsLoadingUser(true);
		try {
			const currentUser = await getCurrentUser(decoded.id, token, decoded.perfil);
			setUser(currentUser);
			return currentUser;
		} catch (error) {
			if (error instanceof ApiError && error.status === 401) {
				clearSession();
				toast.error("Sua sessao expirou. Entre novamente.");
				return null;
			}
			throw error;
		} finally {
			setIsLoadingUser(false);
		}
	}, [clearSession, token]);

	useEffect(() => {
		if (!token) {
			setUser(null);
			setIsLoadingUser(false);
			return;
		}

		void refreshUser().catch(() => {
			/* handled by pages/toasts */
		});
	}, [refreshUser, token]);

	const login = useCallback(
		async (body: LoginBody) => {
			const { token: nextToken } = await loginUser(body);
			if (!nextToken) {
				throw new Error("Resposta de login sem token. Verifique o formato da API.");
			}

			setToken(nextToken);
			const decoded = decodeAuthToken(nextToken);
			if (decoded) {
				const currentUser = await getCurrentUser(decoded.id, nextToken, decoded.perfil);
				setUser(currentUser);
				setIsLoadingUser(false);
			}
			toast.success("Bem-vindo de volta!");
		},
		[setToken],
	);

	const register = useCallback(async (body: RegisterBody) => {
		await registerUser(body);
	}, []);

	const changePassword = useCallback(
		async (body: ChangePasswordBody) => {
			if (!token) {
				throw new Error("Sessao necessaria para alterar a senha.");
			}
			await changePasswordApi(body, token);
		},
		[token],
	);

	const updateProfileHandler = useCallback(
		async (body: UpdateUserBody) => {
			if (!token || !user) {
				throw new Error("Sessao necessaria para atualizar o perfil.");
			}
			await updateUser(user.id, body, token);
			await refreshUser();
		},
		[refreshUser, token, user],
	);

	const logout = useCallback(() => {
		clearSession();
	}, [clearSession]);

	const isAdmin = user?.perfil === "Administrador";

	const value = useMemo<AuthContextValue>(
		() => ({
			token,
			isAuthenticated: Boolean(token),
			isAdmin,
			isLoadingUser,
			user,
			login,
			register,
			changePassword,
			refreshUser,
			updateProfile: updateProfileHandler,
			logout,
		}),
		[token, isAdmin, isLoadingUser, user, login, register, changePassword, refreshUser, updateProfileHandler, logout],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
	return requireContext(useContext(AuthContext), "useAuth deve ser usado dentro de AuthProvider");
}
