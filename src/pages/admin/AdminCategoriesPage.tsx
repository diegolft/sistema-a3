import { useEffect, useState } from "react";
import { AdminSection } from "@/components/admin/AdminSection";
import { useAuth } from "@/contexts/AuthContext";
import { getFormErrorMessage } from "@/lib/formErrors";
import { getCategoryById, listCategories } from "@/services/api/categories";
import type { Category } from "@/types/domain";

export function AdminCategoriesPage() {
	const { token } = useAuth();
	const [categories, setCategories] = useState<Category[]>([]);
	const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!token) return;
		const authToken = token;
		let cancelled = false;

		async function load() {
			setLoading(true);
			setError(null);
			try {
				const nextCategories = await listCategories(authToken);
				if (!cancelled) {
					setCategories(nextCategories);
				}
			} catch (nextError) {
				if (!cancelled) {
					setError(getFormErrorMessage(nextError, "Nao foi possivel carregar as categorias."));
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

	async function handleInspect(id: number) {
		if (!token) return;
		try {
			const category = await getCategoryById(id, token);
			setSelectedCategory(category);
		} catch (nextError) {
			setError(getFormErrorMessage(nextError, "Nao foi possivel consultar a categoria."));
		}
	}

	return (
		<div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
			<AdminSection title="Categorias" description="CCategorias disponíveis.">
				{error ? <p className="mb-4 text-[13px] text-amber-300">{error}</p> : null}
				{loading ? (
					<p className="text-[14px] text-neutral-400">Carregando categorias...</p>
				) : (
					<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
						{categories.map((category) => (
							<button
								key={category.id}
								type="button"
								onClick={() => {
									void handleInspect(category.id);
								}}
								className="rounded-2xl border border-white/10 bg-gs-raised p-4 text-left transition hover:border-[var(--color-gs-accent)]/30 hover:bg-gs-surface"
							>
								<p className="text-[14px] font-semibold text-neutral-100">{category.nome}</p>
								<p className="mt-1 text-[12px] text-neutral-500">ID #{category.id}</p>
							</button>
						))}
					</div>
				)}
			</AdminSection>

			<AdminSection title="Detalhe" description="Inspecione uma categoria individual.">
				{selectedCategory ? (
					<div className="rounded-2xl border border-white/10 bg-gs-raised p-4">
						<p className="text-[12px] uppercase tracking-wide text-neutral-500">Categoria</p>
						<p className="mt-2 text-lg font-semibold text-neutral-100">{selectedCategory.nome}</p>
						<p className="mt-1 text-[13px] text-neutral-400">ID interno: {selectedCategory.id}</p>
					</div>
				) : (
					<p className="text-[14px] text-neutral-400">
						Selecione uma categoria na lista para consultar o endpoint individual.
					</p>
				)}
			</AdminSection>
		</div>
	);
}
