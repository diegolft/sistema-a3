import { type FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { AuthButton } from "@/components/auth/AuthButton";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthField } from "@/components/auth/AuthField";
import { AuthLayout } from "@/pages/auth/AuthLayout";
import { requestPasswordReset } from "@/services/api/auth";
import { getFormErrorMessage } from "@/lib/formErrors";

export function ForgotPasswordPage() {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [sent, setSent] = useState(false);

	async function handleSubmit(e: FormEvent) {
		e.preventDefault();
		setError(null);
		setLoading(true);
		try {
			await requestPasswordReset({ email: email.trim() });
			setSent(true);
		} catch (err) {
			setError(getFormErrorMessage(err, "Não foi possível enviar o e-mail."));
		} finally {
			setLoading(false);
		}
	}

	return (
		<AuthLayout>
			<nav className="mb-6">
				<Link
					to="/login"
					className="inline-flex items-center gap-1 text-[15px] font-semibold text-[var(--color-gs-accent)] transition hover:text-[var(--color-gs-accent-hover)]"
				>
					<span className="text-lg leading-none" aria-hidden>
						‹
					</span>
					Voltar ao login
				</Link>
			</nav>
			<AuthCard>
				<h2 className="mb-1 text-[20px] font-semibold tracking-tight text-neutral-100">
					Esqueci minha senha
				</h2>
				<p className="mb-6 text-[14px] leading-relaxed text-neutral-400">
					Informe o e-mail da sua conta. Se existir cadastro, enviaremos instruções para redefinir a
					senha.
				</p>
				{sent ? (
					<div className="space-y-4">
						<p className="rounded-xl border border-emerald-900/40 bg-emerald-950/45 px-3 py-3 text-[14px] leading-relaxed text-emerald-200">
							Se esse e-mail estiver cadastrado, você receberá um link em instantes. Verifique
							também o spam.
						</p>
						<Link
							to="/login"
							className="flex w-full items-center justify-center rounded-xl bg-[var(--color-gs-accent)] py-3.5 text-[15px] font-semibold text-white shadow-[0_6px_24px_rgba(255,140,51,0.35)] transition hover:bg-[var(--color-gs-accent-hover)]"
						>
							Voltar ao login
						</Link>
					</div>
				) : (
					<form onSubmit={handleSubmit} className="space-y-5">
						<AuthField
							id="forgot-email"
							label="E-mail"
							type="email"
							autoComplete="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
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
						<AuthButton loading={loading}>Enviar instruções</AuthButton>
					</form>
				)}
			</AuthCard>
		</AuthLayout>
	);
}
