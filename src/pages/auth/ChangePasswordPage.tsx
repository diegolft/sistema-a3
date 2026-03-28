import { type FormEvent, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { AuthButton } from "@/components/auth/AuthButton";
import { AuthCard } from "@/components/auth/AuthCard";
import { PasswordField } from "@/components/auth/PasswordField";
import { useAuth } from "@/contexts/AuthContext";
import { AuthLayout } from "@/pages/auth/AuthLayout";
import { getFormErrorMessage } from "@/lib/formErrors";

export function ChangePasswordPage() {
	const { isAuthenticated, changePassword } = useAuth();
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirm, setConfirm] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	async function handleSubmit(e: FormEvent) {
		e.preventDefault();
		setError(null);
		setSuccess(false);
		if (newPassword !== confirm) {
			setError("As novas senhas não coincidem.");
			return;
		}
		if (newPassword.length < 6) {
			setError("A nova senha deve ter pelo menos 6 caracteres.");
			return;
		}
		setLoading(true);
		try {
			await changePassword({ currentPassword, newPassword });
			setSuccess(true);
			setCurrentPassword("");
			setNewPassword("");
			setConfirm("");
		} catch (err) {
			setError(getFormErrorMessage(err, "Não foi possível alterar a senha."));
		} finally {
			setLoading(false);
		}
	}

	if (!isAuthenticated) {
		return <Navigate to="/login" replace state={{ next: "/alterar-senha" }} />;
	}

	return (
		<AuthLayout>
			<nav className="mb-6">
				<Link
					to="/jogos"
					className="inline-flex items-center gap-1 text-[15px] font-semibold text-[var(--color-gs-accent)] transition hover:text-[var(--color-gs-accent-hover)]"
				>
					<span className="text-lg leading-none" aria-hidden>
						‹
					</span>
					Início
				</Link>
			</nav>
			<AuthCard>
				<h2 className="mb-1 text-[20px] font-bold tracking-tight text-neutral-100">
					Alterar senha
				</h2>
				<p className="mb-6 text-[14px] text-neutral-400">
					Informe a senha atual e escolha uma nova senha.
				</p>
				<form onSubmit={handleSubmit} className="space-y-5">
					<PasswordField
						id="cp-current"
						label="Senha atual"
						autoComplete="current-password"
						value={currentPassword}
						onChange={(e) => setCurrentPassword(e.target.value)}
						required
					/>
					<PasswordField
						id="cp-new"
						label="Nova senha"
						autoComplete="new-password"
						value={newPassword}
						onChange={(e) => setNewPassword(e.target.value)}
						required
					/>
					<PasswordField
						id="cp-confirm"
						label="Confirmar nova senha"
						autoComplete="new-password"
						value={confirm}
						onChange={(e) => setConfirm(e.target.value)}
						required
					/>
					{error ? (
						<p
							className="rounded-xl border border-red-900/40 bg-red-950/50 px-3 py-2 text-[13px] text-red-300"
							role="alert"
							aria-live="polite"
						>
							{error}
						</p>
					) : null}
					{success ? (
						<p className="rounded-xl border border-emerald-900/40 bg-emerald-950/45 px-3 py-2 text-[13px] text-emerald-200">
							Senha atualizada com sucesso.
						</p>
					) : null}
					<AuthButton loading={loading}>Salvar</AuthButton>
				</form>
			</AuthCard>
		</AuthLayout>
	);
}
