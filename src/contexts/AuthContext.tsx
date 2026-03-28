import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from "react";
import { toast } from "sonner";
import {
	isMockToken,
	MOCK_AUTH_TOKEN,
	type MockUserProfile,
	mockDelay,
	readMockProfile,
	USE_AUTH_MOCK,
	writeMockProfile,
} from "@/lib/authMock";
import { requireContext } from "@/lib/context";
import { safeGetItem, safeSetItem } from "@/lib/storage";
import {
	type ChangePasswordBody,
	changePassword as changePasswordApi,
	type LoginBody,
	loginUser,
	type RegisterBody,
	registerUser,
} from "@/services/api/auth";

const STORAGE_KEY = "sistema-a3-auth-token";

type AuthContextValue = {
	token: string | null;
	isAuthenticated: boolean;
	/** Perfil preenchido no modo mock; em modo API pode ser null. */
	user: MockUserProfile | null;
	isAuthMock: boolean;
	login: (body: LoginBody) => Promise<void>;
	register: (body: RegisterBody) => Promise<void>;
	changePassword: (body: ChangePasswordBody) => Promise<void>;
	logout: () => void;
	setToken: (t: string | null) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const readStoredToken = () => safeGetItem(STORAGE_KEY);
const writeStoredToken = (t: string | null) => safeSetItem(STORAGE_KEY, t);

function initialUser(): MockUserProfile | null {
	const t = readStoredToken();
	if (isMockToken(t)) return readMockProfile();
	return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
	const [token, setTokenState] = useState<string | null>(readStoredToken);
	const [user, setUser] = useState<MockUserProfile | null>(initialUser);

	const setToken = useCallback((t: string | null) => {
		setTokenState(t);
		writeStoredToken(t);
		setUser(isMockToken(t) ? readMockProfile() : null);
	}, []);

	const login = useCallback(
		async (body: LoginBody) => {
			const email = body.email.trim();
			if (USE_AUTH_MOCK) {
				await mockDelay();
				const stored = readMockProfile();
				const name =
					stored && stored.email.toLowerCase() === email.toLowerCase()
						? stored.name
						: (email.split("@")[0] || "Jogador").replace(/\./g, " ");
				const profile: MockUserProfile = { name, email };
				writeMockProfile(profile);
				setToken(MOCK_AUTH_TOKEN);
				toast.success("Bem-vindo de volta!");
				return;
			}
			const { token: t } = await loginUser(body);
			if (!t) {
				throw new Error("Resposta de login sem token. Verifique o formato da API.");
			}
			setToken(t);
		},
		[setToken],
	);

	const register = useCallback(async (body: RegisterBody) => {
		if (USE_AUTH_MOCK) {
			await mockDelay();
			const email = body.email.trim();
			const name = body.name?.trim() || "Jogador";
			writeMockProfile({ name, email });
			toast.success("Conta criada! Faça login para continuar.");
			return;
		}
		await registerUser(body);
	}, []);

	const changePassword = useCallback(
		async (body: ChangePasswordBody) => {
			if (!token) {
				throw new Error("Sessão necessária para alterar a senha.");
			}
			if (USE_AUTH_MOCK && isMockToken(token)) {
				await mockDelay();
				if (body.newPassword.length < 6) {
					throw new Error("A nova senha deve ter pelo menos 6 caracteres.");
				}
				return;
			}
			await changePasswordApi(body, token);
		},
		[token],
	);

	const logout = useCallback(() => {
		setTokenState(null);
		writeStoredToken(null);
		setUser(null);
	}, []);

	const isAuthMock = Boolean(USE_AUTH_MOCK && isMockToken(token));

	const value = useMemo<AuthContextValue>(
		() => ({
			token,
			isAuthenticated: Boolean(token),
			user,
			isAuthMock,
			login,
			register,
			changePassword,
			logout,
			setToken,
		}),
		[token, user, isAuthMock, login, register, changePassword, logout, setToken],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
	return requireContext(useContext(AuthContext), "useAuth deve ser usado dentro de AuthProvider");
}
