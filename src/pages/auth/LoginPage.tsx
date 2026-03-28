import { type FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthButton } from "@/components/auth/AuthButton";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthField } from "@/components/auth/AuthField";
import { PasswordField } from "@/components/auth/PasswordField";
import { useAuth } from "@/contexts/AuthContext";
import { AuthLayout } from "@/pages/auth/AuthLayout";
import { getFormErrorMessage } from "@/lib/formErrors";

export function LoginPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const { login } = useAuth();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const state = location.state as { registered?: boolean; next?: string } | null;
	const welcome = Boolean(state?.registered);
	const rawNext = state?.next;
	const returnTo = rawNext?.startsWith("/") && !rawNext.startsWith("//") ? rawNext : null;

	async function handleSubmit(e: FormEvent) {
		e.preventDefault();
		setError(null);
		setLoading(true);
		try {
			await login({ email: email.trim(), password });
			navigate(returnTo ?? "/jogos", { replace: true });
		} catch (err) {
			setError(getFormErrorMessage(err, "Não foi possível entrar."));
		} finally {
			setLoading(false);
		}
	}

	return (
		<AuthLayout subtitle="Entre na sua conta">
			<AuthCard>
				{welcome ? (
					<p className="mb-3 rounded-xl border border-emerald-900/40 bg-emerald-950/45 px-3 py-2 text-[13px] text-emerald-200">
						Cadastro concluído. Faça login com sua nova conta.
					</p>
				) : null}
				{returnTo && !welcome ? (
					<p className="mb-3 rounded-xl border border-white/10 bg-gs-raised px-3 py-2 text-[13px] text-neutral-300">
						Faça login para continuar.
					</p>
				) : null}
				<form onSubmit={handleSubmit} className="space-y-3.5">
					<AuthField
						id="login-email"
						label="E-mail"
						type="email"
						autoComplete="email"
						placeholder="seu@email.com"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
					<PasswordField
						id="login-password"
						label="Senha"
						belowInput={
							<Link
								to="/esqueci-senha"
								className="text-[13px] font-semibold text-[var(--color-gs-accent)] hover:text-[var(--color-gs-accent-hover)]"
							>
								Esqueci minha senha
							</Link>
						}
						autoComplete="current-password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
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
					<AuthButton loading={loading}>Entrar</AuthButton>
				</form>
				<p className="mt-5 text-center text-[14px] text-neutral-400">
					Não tem uma conta?{" "}
					<Link
						to="/cadastro"
						className="font-semibold text-[var(--color-gs-accent)] hover:text-[var(--color-gs-accent-hover)]"
					>
						Criar conta
					</Link>
				</p>
			</AuthCard>
		</AuthLayout>
	);
}
