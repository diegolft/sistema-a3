import { motion } from "framer-motion";
import { Lock, Save, UserRound } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { AuthButton } from "@/components/auth/AuthButton";
import { AuthField } from "@/components/auth/AuthField";
import { PasswordField } from "@/components/auth/PasswordField";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useSales } from "@/contexts/SalesContext";
import { formatBRL } from "@/lib/currency";
import { formatDisplayDateTime, toInputDate } from "@/lib/date";
import { getFormErrorMessage } from "@/lib/formErrors";

export function ProfilePage() {
	const { user, changePassword, isAuthenticated, isLoadingUser, updateProfile } = useAuth();
	const { sales, isLoading: salesLoading } = useSales();
	const [name, setName] = useState("");
	const [birthDate, setBirthDate] = useState("");
	const [savingProfile, setSavingProfile] = useState(false);
	const [profileError, setProfileError] = useState<string | null>(null);
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [pwdLoading, setPwdLoading] = useState(false);
	const [pwdError, setPwdError] = useState<string | null>(null);

	useEffect(() => {
		setName(user?.nome ?? "");
		setBirthDate(toInputDate(user?.dataNascimento));
	}, [user]);

	async function handleProfileSubmit(event: FormEvent) {
		event.preventDefault();
		if (!user) return;
		setProfileError(null);
		if (!name.trim()) {
			setProfileError("Informe seu nome.");
			return;
		}
		setSavingProfile(true);
		try {
			await updateProfile({
				nome: name.trim(),
				dataNascimento: birthDate || undefined,
				fkPerfil: user.fkPerfil,
			});
			toast.success("Perfil atualizado com sucesso.");
		} catch (error) {
			setProfileError(getFormErrorMessage(error, "Nao foi possivel atualizar o perfil."));
		} finally {
			setSavingProfile(false);
		}
	}

	async function handlePassword(event: FormEvent) {
		event.preventDefault();
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
		} catch (error) {
			setPwdError(getFormErrorMessage(error, "Nao foi possivel alterar a senha."));
		} finally {
			setPwdLoading(false);
		}
	}

	if (isLoadingUser || !user) {
		return (
			<div className="mx-auto max-w-4xl">
				<Skeleton className="mb-6 h-9 w-28" />
				<Skeleton className="mb-5 h-28 w-full rounded-xl" />
				<Skeleton className="h-56 w-full rounded-xl" />
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-4xl">
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
					<p className="truncate text-base font-bold text-neutral-100">{user.nome}</p>
					<p className="truncate text-[13px] text-neutral-400">{user.email}</p>
					<p className="mt-1 text-[12px] text-neutral-500">Perfil: {user.perfil}</p>
				</div>
			</motion.div>

			<div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.05 }}
					className="rounded-xl border border-white/10 bg-gs-surface p-5 shadow-[0_3px_18px_rgba(0,0,0,0.32)]"
				>
					<div className="mb-5 flex items-center gap-2 text-[var(--color-gs-accent)]">
						<Save className="h-4 w-4" strokeWidth={1.75} />
						<h2 className="text-base font-bold text-neutral-100">Dados da conta</h2>
					</div>
					<form onSubmit={handleProfileSubmit} className="space-y-4">
						<AuthField
							id="profile-name"
							label="Nome"
							value={name}
							onChange={(event) => setName(event.target.value)}
							required
						/>
						<AuthField id="profile-email" label="E-mail" value={user.email} disabled />
						<AuthField
							id="profile-birth-date"
							label="Data de nascimento"
							type="date"
							value={birthDate}
							onChange={(event) => setBirthDate(event.target.value)}
						/>
						{profileError ? (
							<p
								className="rounded-xl border border-red-900/40 bg-red-950/50 px-3 py-2 text-[13px] text-red-300"
								role="alert"
								aria-live="polite"
							>
								{profileError}
							</p>
						) : null}
						<AuthButton loading={savingProfile}>Salvar dados</AuthButton>
					</form>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.08 }}
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
							onChange={(event) => setCurrentPassword(event.target.value)}
							required
						/>
						<PasswordField
							id="profile-new-pwd"
							label="Nova Senha"
							autoComplete="new-password"
							value={newPassword}
							onChange={(event) => setNewPassword(event.target.value)}
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

			<motion.section
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.1 }}
				className="mt-6 rounded-xl border border-white/10 bg-gs-surface p-5 shadow-[0_3px_18px_rgba(0,0,0,0.32)]"
			>
				<h2 className="text-base font-bold text-neutral-100">Historico de compras</h2>
				<p className="mt-1 text-[13px] text-neutral-400">
					As compras abaixo sao carregadas a partir do endpoint real de vendas.
				</p>
				<div className="mt-4 space-y-3">
					{salesLoading ? (
						<>
							<Skeleton className="h-20 rounded-2xl" />
							<Skeleton className="h-20 rounded-2xl" />
						</>
					) : sales.length === 0 ? (
						<p className="rounded-2xl border border-white/10 bg-gs-raised p-4 text-[14px] text-neutral-400">
							Voce ainda nao concluiu nenhuma compra.
						</p>
					) : (
						sales.map((sale) => (
							<div
								key={sale.id}
								className="rounded-2xl border border-white/10 bg-gs-raised p-4"
							>
								<div className="flex flex-wrap items-center justify-between gap-3">
									<div>
										<p className="text-[14px] font-semibold text-neutral-100">Venda #{sale.id}</p>
										<p className="mt-1 text-[12px] text-neutral-400">
											{sale.quantidade} {sale.quantidade === 1 ? "item" : "itens"} •{" "}
											{formatDisplayDateTime(sale.data)}
										</p>
									</div>
									<p className="text-[15px] font-bold text-[var(--color-gs-accent)]">
										{formatBRL(sale.valorTotal)}
									</p>
								</div>
							</div>
						))
					)}
				</div>
			</motion.section>
		</div>
	);
}
