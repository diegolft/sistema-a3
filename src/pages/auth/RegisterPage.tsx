import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthButton } from "@/components/auth/AuthButton";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthField } from "@/components/auth/AuthField";
import { PasswordField } from "@/components/auth/PasswordField";
import { useAuth } from "@/contexts/AuthContext";
import { AuthLayout } from "@/pages/auth/AuthLayout";
import { getFormErrorMessage } from "@/lib/formErrors";

export function RegisterPage() {
	const navigate = useNavigate();
	const { register } = useAuth();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirm, setConfirm] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function handleSubmit(e: FormEvent) {
		e.preventDefault();
		setError(null);
		if (password !== confirm) {
			setError("As senhas não coincidem.");
			return;
		}
		if (password.length < 6) {
			setError("Use uma senha com pelo menos 6 caracteres.");
			return;
		}
		setLoading(true);
		try {
			await register({
				email: email.trim(),
				password,
				name: name.trim() || undefined,
			});
			navigate("/login", { replace: true, state: { registered: true } });
		} catch (err) {
			setError(getFormErrorMessage(err, "Não foi possível cadastrar."));
		} finally {
			setLoading(false);
		}
	}

	return (
		<AuthLayout subtitle="Crie sua conta gratuita">
			<AuthCard>
				<form onSubmit={handleSubmit} className="space-y-3.5">
					<AuthField
						id="reg-name"
						label="Nome"
						type="text"
						autoComplete="name"
						placeholder="Seu nome"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>
					<AuthField
						id="reg-email"
						label="E-mail"
						type="email"
						autoComplete="email"
						placeholder="seu@email.com"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
					<PasswordField
						id="reg-password"
						label="Senha"
						autoComplete="new-password"
						placeholder="••••••••"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
					<PasswordField
						id="reg-confirm"
						label="Confirmar senha"
						autoComplete="new-password"
						placeholder="••••••••"
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
					<AuthButton loading={loading}>Criar Conta</AuthButton>
				</form>
				<p className="mt-5 text-center text-[14px] text-neutral-400">
					Já tem uma conta?{" "}
					<Link
						to="/login"
						className="font-semibold text-[var(--color-gs-accent)] hover:text-[var(--color-gs-accent-hover)]"
					>
						Entrar
					</Link>
				</p>
			</AuthCard>
		</AuthLayout>
	);
}
