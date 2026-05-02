import { type FormEvent, useEffect, useState } from "react";
import { AdminSection } from "@/components/admin/AdminSection";
import { adminButtonClass, adminInputClass } from "@/components/admin/styles";
import { useAuth } from "@/contexts/AuthContext";
import { toInputDate } from "@/lib/date";
import { getFormErrorMessage } from "@/lib/formErrors";
import { listProfiles } from "@/services/api/profiles";
import { getUserById, listUsers, updateUser } from "@/services/api/users";
import type { Profile, User } from "@/types/domain";

export function AdminUsersPage() {
	const { token } = useAuth();
	const [users, setUsers] = useState<User[]>([]);
	const [profiles, setProfiles] = useState<Profile[]>([]);
	const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [nome, setNome] = useState("");
	const [dataNascimento, setDataNascimento] = useState("");
	const [fkPerfil, setFkPerfil] = useState("");
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!token) return;
		const authToken = token;
		let cancelled = false;

		async function load() {
			setLoading(true);
			setError(null);
			try {
				const [nextUsers, nextProfiles] = await Promise.all([
					listUsers(authToken),
					listProfiles(authToken),
				]);
				if (!cancelled) {
					setUsers(nextUsers);
					setProfiles(nextProfiles);
				}
			} catch (nextError) {
				if (!cancelled) {
					setError(getFormErrorMessage(nextError, "Nao foi possivel carregar os usuarios."));
				}
			} finally {
				if (!cancelled) {
					setLoading(false);
				}
			}
		}

		void load();
		return () => {
			cancelled = true;
		};
	}, [token]);

	async function reloadUsers() {
		if (!token) return;
		const nextUsers = await listUsers(token);
		setUsers(nextUsers);
	}

	async function handleSelectUser(id: number) {
		if (!token) return;
		try {
			const user = await getUserById(id, token);
			if (!user) return;
			setSelectedUserId(id);
			setSelectedUser(user);
			setNome(user.nome);
			setDataNascimento(toInputDate(user.dataNascimento));
			setFkPerfil(String(user.fkPerfil));
		} catch (nextError) {
			setError(getFormErrorMessage(nextError, "Nao foi possivel carregar o usuario selecionado."));
		}
	}

	async function handleSubmit(event: FormEvent) {
		event.preventDefault();
		if (!token || !selectedUser) return;
		setSaving(true);
		setError(null);
		try {
			await updateUser(
				selectedUser.id,
				{
					nome: nome.trim(),
					dataNascimento: dataNascimento || undefined,
					fkPerfil: Number(fkPerfil),
				},
				token,
			);
			await reloadUsers();
			await handleSelectUser(selectedUser.id);
		} catch (nextError) {
			setError(getFormErrorMessage(nextError, "Nao foi possivel salvar o usuario."));
		} finally {
			setSaving(false);
		}
	}

	return (
		<div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
			<AdminSection title="Usuarios" description="Usuários cadastrados.">
				{error ? <p className="mb-4 text-[13px] text-amber-300">{error}</p> : null}
				{loading ? (
					<p className="text-[14px] text-neutral-400">Carregando usuarios...</p>
				) : (
					<div className="overflow-x-auto">
						<table className="min-w-full text-left text-[14px]">
							<thead className="text-[12px] uppercase tracking-wide text-neutral-500">
								<tr>
									<th className="pb-3 pr-4">ID</th>
									<th className="pb-3 pr-4">Nome</th>
									<th className="pb-3 pr-4">E-mail</th>
									<th className="pb-3 pr-4">Perfil</th>
									<th className="pb-3">Acao</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-white/10">
								{users.map((user) => (
									<tr
										key={user.id}
										className={selectedUserId === user.id ? "bg-[var(--color-gs-accent)]/5" : ""}
									>
										<td className="py-3 pr-4 text-neutral-400">#{user.id}</td>
										<td className="py-3 pr-4 text-neutral-100">{user.nome}</td>
										<td className="py-3 pr-4 text-neutral-400">{user.email}</td>
										<td className="py-3 pr-4 text-neutral-400">
											{profiles.find((profile) => profile.id === user.fkPerfil)?.nome ?? `Perfil #${user.fkPerfil}`}
										</td>
										<td className="py-3">
										<button
											type="button"
											onClick={() => {
												void handleSelectUser(user.id);
											}}
											className="text-[var(--color-gs-accent)] hover:text-[var(--color-gs-accent-hover)]"
										>
											Editar
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</AdminSection>

			<AdminSection title="Editar usuario" description="Consome PUT /usuarios/:id.">
				{selectedUser ? (
					<form onSubmit={handleSubmit} className="space-y-4">
						<label className="block text-[13px] font-semibold text-neutral-200">
							Nome
							<input
								className={`${adminInputClass} mt-2`}
								value={nome}
								onChange={(event) => setNome(event.target.value)}
								required
							/>
						</label>
						<label className="block text-[13px] font-semibold text-neutral-200">
							E-mail
							<input className={`${adminInputClass} mt-2`} value={selectedUser.email} disabled />
						</label>
						<label className="block text-[13px] font-semibold text-neutral-200">
							Data de nascimento
							<input
								type="date"
								className={`${adminInputClass} mt-2`}
								value={dataNascimento}
								onChange={(event) => setDataNascimento(event.target.value)}
							/>
						</label>
						<label className="block text-[13px] font-semibold text-neutral-200">
							Perfil
							<select
								className={`${adminInputClass} mt-2`}
								value={fkPerfil}
								onChange={(event) => setFkPerfil(event.target.value)}
								required
							>
								<option value="" disabled>
									Selecione um perfil
								</option>
								{profiles.map((profile) => (
									<option key={profile.id} value={profile.id}>
										{profile.nome}
									</option>
								))}
							</select>
						</label>
						<button type="submit" className={adminButtonClass} disabled={saving}>
							{saving ? "Salvando..." : "Salvar usuario"}
						</button>
					</form>
				) : (
					<p className="text-[14px] text-neutral-400">Selecione um usuario na tabela para editar.</p>
				)}
			</AdminSection>
		</div>
	);
}
