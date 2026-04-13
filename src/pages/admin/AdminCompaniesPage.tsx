import { type FormEvent, useEffect, useState } from "react";
import { AdminSection } from "@/components/admin/AdminSection";
import { adminButtonClass, adminInputClass } from "@/components/admin/styles";
import { useAuth } from "@/contexts/AuthContext";
import { getFormErrorMessage } from "@/lib/formErrors";
import {
	createCompany,
	deleteCompany,
	getCompanyById,
	listCompanies,
	updateCompany,
} from "@/services/api/companies";
import type { Company } from "@/types/domain";

export function AdminCompaniesPage() {
	const { token } = useAuth();
	const [companies, setCompanies] = useState<Company[]>([]);
	const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
	const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
	const [nome, setNome] = useState("");
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function reloadCompanies() {
		if (!token) return;
		const nextCompanies = await listCompanies(token);
		setCompanies(nextCompanies);
	}

	useEffect(() => {
		if (!token) return;
		const authToken = token;
		let cancelled = false;

		async function load() {
			setLoading(true);
			setError(null);
			try {
				const nextCompanies = await listCompanies(authToken);
				if (!cancelled) {
					setCompanies(nextCompanies);
				}
			} catch (nextError) {
				if (!cancelled) {
					setError(getFormErrorMessage(nextError, "Nao foi possivel carregar as empresas."));
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
			if (selectedCompany) {
				await updateCompany(selectedCompany.id, { nome: nome.trim() }, token);
			} else {
				await createCompany({ nome: nome.trim() }, token);
			}
			setSelectedCompanyId(null);
			setSelectedCompany(null);
			setNome("");
			await reloadCompanies();
		} catch (nextError) {
			setError(getFormErrorMessage(nextError, "Nao foi possivel salvar a empresa."));
		} finally {
			setSaving(false);
		}
	}

	async function handleDelete(id: number) {
		if (!token) return;
		setError(null);
		try {
			await deleteCompany(id, token);
			if (selectedCompanyId === id) {
				setSelectedCompanyId(null);
				setSelectedCompany(null);
				setNome("");
			}
			await reloadCompanies();
		} catch (nextError) {
			setError(getFormErrorMessage(nextError, "Nao foi possivel remover a empresa."));
		}
	}

	async function handleSelectCompany(id: number) {
		if (!token) return;
		try {
			const company = await getCompanyById(id, token);
			if (!company) return;
			setSelectedCompanyId(id);
			setSelectedCompany(company);
			setNome(company.nome);
		} catch (nextError) {
			setError(getFormErrorMessage(nextError, "Nao foi possivel carregar a empresa selecionada."));
		}
	}

	return (
		<div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
			<AdminSection title="Empresas" description="CRUD de empresas via /empresas.">
				{error ? <p className="mb-4 text-[13px] text-amber-300">{error}</p> : null}
				{loading ? (
					<p className="text-[14px] text-neutral-400">Carregando empresas...</p>
				) : (
					<div className="space-y-3">
						{companies.map((company) => (
							<div
								key={company.id}
								className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4 ${
									selectedCompanyId === company.id
										? "border-[var(--color-gs-accent)]/35 bg-[var(--color-gs-accent)]/8"
										: "border-white/10 bg-gs-raised"
								}`}
							>
								<div>
									<p className="text-[14px] font-semibold text-neutral-100">{company.nome}</p>
									<p className="text-[12px] text-neutral-500">ID #{company.id}</p>
								</div>
								<div className="flex gap-3 text-[13px]">
									<button
										type="button"
										onClick={() => {
											void handleSelectCompany(company.id);
										}}
										className="text-[var(--color-gs-accent)] hover:text-[var(--color-gs-accent-hover)]"
									>
										Editar
									</button>
									<button
										type="button"
										onClick={() => {
											void handleDelete(company.id);
										}}
										className="text-red-300 hover:text-red-200"
									>
										Excluir
									</button>
								</div>
							</div>
						))}
					</div>
				)}
			</AdminSection>

			<AdminSection
				title={selectedCompany ? "Editar empresa" : "Nova empresa"}
				description="Consome POST /empresas e PUT /empresas/:id."
			>
				<form onSubmit={handleSubmit} className="space-y-4">
					<label className="block text-[13px] font-semibold text-neutral-200">
						Nome da empresa
						<input
							className={`${adminInputClass} mt-2`}
							value={nome}
							onChange={(event) => setNome(event.target.value)}
							placeholder="Ex.: Valve"
							required
						/>
					</label>
					<div className="flex gap-3">
						<button type="submit" className={adminButtonClass} disabled={saving}>
							{saving ? "Salvando..." : selectedCompany ? "Atualizar empresa" : "Criar empresa"}
						</button>
						{selectedCompany ? (
							<button
								type="button"
								onClick={() => {
									setSelectedCompanyId(null);
									setSelectedCompany(null);
									setNome("");
								}}
								className="rounded-full border border-white/10 px-5 py-2.5 text-[13px] font-semibold text-neutral-200 transition hover:bg-white/5"
							>
								Cancelar
							</button>
						) : null}
					</div>
				</form>
			</AdminSection>
		</div>
	);
}
