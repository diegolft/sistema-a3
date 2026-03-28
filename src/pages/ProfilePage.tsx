import { motion } from "framer-motion";
import { Lock, UserRound } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { AuthButton } from "@/components/auth/AuthButton";
import { PasswordField } from "@/components/auth/PasswordField";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { getFormErrorMessage } from "@/lib/formErrors";

export function ProfilePage() {
	const { user, changePassword, isAuthenticated } = useAuth();
	const [loading, setLoading] = useState(true);
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [pwdLoading, setPwdLoading] = useState(false);
	const [pwdError, setPwdError] = useState<string | null>(null);

	useEffect(() => {
		const t = window.setTimeout(() => setLoading(false), 600);
		return () => window.clearTimeout(t);
	}, []);

	const displayName = user?.name ?? "Usuário";
	const displayEmail = user?.email ?? "—";

	async function handlePassword(e: FormEvent) {
		e.preventDefault();
		setPwdError(null);
		if (newPassword.length < 6) {
			setPwdError("A nova senha deve ter pelo menos 6 caracteres.");
			return;
		}
		if (!isAuthenticated) return;
		setPwdLoading(true);
		try {
			await changePassword({ currentPassword, newPassword });
			setCurrentPassword("");
			setNewPassword("");
			toast.success("Senha alterada com sucesso.");
		} catch (err) {
			setPwdError(getFormErrorMessage(err, "Não foi possível alterar a senha."));
		} finally {
			setPwdLoading(false);
		}
	}

	if (loading) {
		return (
			<div className="mx-auto max-w-lg">
				<Skeleton className="mb-6 h-9 w-28" />
				<Skeleton className="mb-5 h-28 w-full rounded-xl" />
				<Skeleton className="h-56 w-full rounded-xl" />
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-lg">
			<h1 className="mb-7 text-2xl font-bold tracking-tight text-neutral-100 md:text-3xl">Perfil</h1>

			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				className="mb-6 flex items-center gap-4 rounded-xl border border-white/10 bg-gs-surface p-5 shadow-[0_3px_18px_rgba(0,0,0,0.32)]"
			>
				<div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--color-gs-accent)] text-white">
					<UserRound className="h-7 w-7" strokeWidth={1.5} />
				</div>
				<div className="min-w-0">
					<p className="truncate text-base font-bold text-neutral-100">{displayName}</p>
					<p className="truncate text-[13px] text-neutral-400">{displayEmail}</p>
				</div>
			</motion.div>

			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.05 }}
				className="rounded-xl border border-white/10 bg-gs-surface p-5 shadow-[0_3px_18px_rgba(0,0,0,0.32)]"
			>
				<div className="mb-5 flex items-center gap-2 text-[var(--color-gs-accent)]">
					<Lock className="h-4 w-4" strokeWidth={1.75} />
					<h2 className="text-base font-bold text-neutral-100">Alterar Senha</h2>
				</div>
				<form onSubmit={handlePassword} className="space-y-4">
					<PasswordField
						id="profile-current-pwd"
						label="Senha Atual"
						autoComplete="current-password"
						value={currentPassword}
						onChange={(e) => setCurrentPassword(e.target.value)}
						required
					/>
					<PasswordField
						id="profile-new-pwd"
						label="Nova Senha"
						autoComplete="new-password"
						value={newPassword}
						onChange={(e) => setNewPassword(e.target.value)}
						required
					/>
					{pwdError ? (
						<p
							className="rounded-xl border border-red-900/40 bg-red-950/50 px-3 py-2 text-[13px] text-red-300"
							role="alert"
							aria-live="polite"
						>
							{pwdError}
						</p>
					) : null}
					<AuthButton loading={pwdLoading}>Alterar Senha</AuthButton>
				</form>
			</motion.div>
		</div>
	);
}
