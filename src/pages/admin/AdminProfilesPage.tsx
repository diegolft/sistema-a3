import { type FormEvent, useEffect, useState } from "react";
import { AdminSection } from "@/components/admin/AdminSection";
import { adminButtonClass, adminInputClass } from "@/components/admin/styles";
import { useAuth } from "@/contexts/AuthContext";
import { getFormErrorMessage } from "@/lib/formErrors";
import { createProfile, listProfiles } from "@/services/api/profiles";
import type { Profile } from "@/types/domain";

export function AdminProfilesPage() {
	const { token } = useAuth();
	const [profiles, setProfiles] = useState<Profile[]>([]);
	const [nome, setNome] = useState("");
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
				const nextProfiles = await listProfiles(authToken);
				if (!cancelled) {
					setProfiles(nextProfiles);
				}
			} catch (nextError) {
				if (!cancelled) {
					setError(getFormErrorMessage(nextError, "Nao foi possivel carregar os perfis."));
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

	async function handleSubmit(event: FormEvent) {
		event.preventDefault();
		if (!token) return;
		setSaving(true);
		setError(null);
		try {
			await createProfile({ nome: nome.trim() }, token);
			setNome("");
			setProfiles(await listProfiles(token));
		} catch (nextError) {
			setError(getFormErrorMessage(nextError, "Nao foi possivel criar o perfil."));
		} finally {
			setSaving(false);
		}
	}

	return (
		<div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
			<AdminSection title="Perfis cadastrados" description="Consome GET /profiles.">
				{error ? <p className="mb-4 text-[13px] text-amber-300">{error}</p> : null}
				{loading ? (
					<p className="text-[14px] text-neutral-400">Carregando perfis...</p>
				) : (
					<div className="space-y-3">
						{profiles.map((profile) => (
							<div
								key={profile.id}
								className="rounded-2xl border border-white/10 bg-gs-raised p-4"
							>
								<p className="text-[14px] font-semibold text-neutral-100">{profile.nome}</p>
								<p className="mt-1 text-[12px] text-neutral-500">ID #{profile.id}</p>
							</div>
						))}
					</div>
				)}
			</AdminSection>

			<AdminSection title="Novo perfil" description="Consome POST /profiles.">
				<form onSubmit={handleSubmit} className="space-y-4">
					<label className="block text-[13px] font-semibold text-neutral-200">
						Nome do perfil
						<input
							className={`${adminInputClass} mt-2`}
							value={nome}
							onChange={(event) => setNome(event.target.value)}
							placeholder="Ex.: Operador"
							required
						/>
					</label>
					<button type="submit" className={adminButtonClass} disabled={saving}>
						{saving ? "Salvando..." : "Criar perfil"}
					</button>
				</form>
			</AdminSection>
		</div>
	);
}
