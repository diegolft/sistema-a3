import { type FormEvent, useEffect, useState } from "react";
import { AdminSection } from "@/components/admin/AdminSection";
import { adminButtonClass, adminInputClass } from "@/components/admin/styles";
import { useAuth } from "@/contexts/AuthContext";
import { getFormErrorMessage } from "@/lib/formErrors";
import { listCategories } from "@/services/api/categories";
import { listCompanies } from "@/services/api/companies";
import {
	createGame,
	deleteGame,
	getGameById,
	listGames,
	updateGame,
} from "@/services/api/games";
import type { Category, Company, GameSummary } from "@/types/domain";

type GameFormState = {
	nome: string;
	descricao: string;
	preco: string;
	ano: string;
	fkCategoria: string;
	fkEmpresa: string;
	desconto: string;
};

const EMPTY_FORM: GameFormState = {
	nome: "",
	descricao: "",
	preco: "",
	ano: "",
	fkCategoria: "",
	fkEmpresa: "",
	desconto: "0",
};

export function AdminGamesPage() {
	const { token } = useAuth();
	const [games, setGames] = useState<GameSummary[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [companies, setCompanies] = useState<Company[]>([]);
	const [selectedGameId, setSelectedGameId] = useState<number | null>(null);
	const [selectedGame, setSelectedGame] = useState<GameSummary | null>(null);
	const [form, setForm] = useState<GameFormState>(EMPTY_FORM);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function reloadAll() {
		if (!token) return;
		const [nextGames, nextCategories, nextCompanies] = await Promise.all([
			listGames(token),
			listCategories(token),
			listCompanies(token),
		]);
		setGames(nextGames);
		setCategories(nextCategories);
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
				const [nextGames, nextCategories, nextCompanies] = await Promise.all([
					listGames(authToken),
					listCategories(authToken),
					listCompanies(authToken),
				]);
				if (!cancelled) {
					setGames(nextGames);
					setCategories(nextCategories);
					setCompanies(nextCompanies);
				}
			} catch (nextError) {
				if (!cancelled) {
					setError(getFormErrorMessage(nextError, "Nao foi possivel carregar os jogos."));
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

	useEffect(() => {
		if (!selectedGame) {
			setForm(EMPTY_FORM);
			return;
		}

		setForm({
			nome: selectedGame.nome,
			descricao: selectedGame.descricao,
			preco: String(selectedGame.preco),
			ano: String(selectedGame.ano),
			fkCategoria: String(selectedGame.fkCategoria),
			fkEmpresa: String(selectedGame.fkEmpresa),
			desconto: String(selectedGame.desconto),
		});
	}, [selectedGame]);

	async function handleSelectGame(id: number) {
		if (!token) return;
		try {
			const game = await getGameById(id, token);
			if (!game) return;
			setSelectedGameId(id);
			setSelectedGame(game);
		} catch (nextError) {
			setError(getFormErrorMessage(nextError, "Nao foi possivel carregar o jogo selecionado."));
		}
	}

	function updateForm<K extends keyof GameFormState>(key: K, value: GameFormState[K]) {
		setForm((current) => ({ ...current, [key]: value }));
	}

	async function handleSubmit(event: FormEvent) {
		event.preventDefault();
		if (!token) return;
		setSaving(true);
		setError(null);
		try {
			const payload = {
				nome: form.nome.trim(),
				descricao: form.descricao.trim() || undefined,
				preco: Number(form.preco),
				ano: Number(form.ano),
				fkCategoria: Number(form.fkCategoria),
				fkEmpresa: Number(form.fkEmpresa),
				desconto: Number(form.desconto || 0),
			};

			if (selectedGame) {
				await updateGame(selectedGame.id, payload, token);
			} else {
				await createGame(payload, token);
			}

			setSelectedGameId(null);
			setSelectedGame(null);
			setForm(EMPTY_FORM);
			await reloadAll();
		} catch (nextError) {
			setError(getFormErrorMessage(nextError, "Nao foi possivel salvar o jogo."));
		} finally {
			setSaving(false);
		}
	}

	async function handleDelete(id: number) {
		if (!token) return;
		setError(null);
		try {
			await deleteGame(id, token);
			if (selectedGameId === id) {
				setSelectedGameId(null);
				setSelectedGame(null);
				setForm(EMPTY_FORM);
			}
			await reloadAll();
		} catch (nextError) {
			setError(getFormErrorMessage(nextError, "Nao foi possivel remover o jogo."));
		}
	}

	return (
		<div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)]">
			<AdminSection title="Catalogo" description="Consome GET, POST, PUT e DELETE em /jogos.">
				{error ? <p className="mb-4 text-[13px] text-amber-300">{error}</p> : null}
				{loading ? (
					<p className="text-[14px] text-neutral-400">Carregando jogos...</p>
				) : (
					<div className="space-y-3">
						{games.map((game) => (
							<div
								key={game.id}
								className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4 ${
									selectedGameId === game.id
										? "border-[var(--color-gs-accent)]/35 bg-[var(--color-gs-accent)]/8"
										: "border-white/10 bg-gs-raised"
								}`}
							>
								<div className="min-w-0">
									<p className="text-[14px] font-semibold text-neutral-100">{game.nome}</p>
									<p className="mt-1 text-[12px] text-neutral-400">
										{game.empresaNome} - {game.categoriaNome} - {game.ano}
									</p>
								</div>
								<div className="flex gap-3 text-[13px]">
									<button
										type="button"
										onClick={() => {
											void handleSelectGame(game.id);
										}}
										className="text-[var(--color-gs-accent)] hover:text-[var(--color-gs-accent-hover)]"
									>
										Editar
									</button>
									<button
										type="button"
										onClick={() => {
											void handleDelete(game.id);
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
				title={selectedGame ? "Editar jogo" : "Novo jogo"}
				description="Formulario conectado ao contrato de UpsertGameDto."
			>
				<form onSubmit={handleSubmit} className="space-y-4">
					<label className="block text-[13px] font-semibold text-neutral-200">
						Nome
						<input
							className={`${adminInputClass} mt-2`}
							value={form.nome}
							onChange={(event) => updateForm("nome", event.target.value)}
							required
						/>
					</label>
					<label className="block text-[13px] font-semibold text-neutral-200">
						Descricao
						<textarea
							className={`${adminInputClass} mt-2 min-h-28`}
							value={form.descricao}
							onChange={(event) => updateForm("descricao", event.target.value)}
						/>
					</label>
					<div className="grid gap-4 md:grid-cols-2">
						<label className="block text-[13px] font-semibold text-neutral-200">
							Preco
							<input
								type="number"
								step="0.01"
								min="0"
								className={`${adminInputClass} mt-2`}
								value={form.preco}
								onChange={(event) => updateForm("preco", event.target.value)}
								required
							/>
						</label>
						<label className="block text-[13px] font-semibold text-neutral-200">
							Desconto (%)
							<input
								type="number"
								step="0.01"
								min="0"
								className={`${adminInputClass} mt-2`}
								value={form.desconto}
								onChange={(event) => updateForm("desconto", event.target.value)}
							/>
						</label>
					</div>
					<div className="grid gap-4 md:grid-cols-2">
						<label className="block text-[13px] font-semibold text-neutral-200">
							Ano
							<input
								type="number"
								min="1970"
								className={`${adminInputClass} mt-2`}
								value={form.ano}
								onChange={(event) => updateForm("ano", event.target.value)}
								required
							/>
						</label>
						<label className="block text-[13px] font-semibold text-neutral-200">
							Categoria
							<select
								className={`${adminInputClass} mt-2`}
								value={form.fkCategoria}
								onChange={(event) => updateForm("fkCategoria", event.target.value)}
								required
							>
								<option value="" disabled>
									Selecione
								</option>
								{categories.map((category) => (
									<option key={category.id} value={category.id}>
										{category.nome}
									</option>
								))}
							</select>
						</label>
					</div>
					<label className="block text-[13px] font-semibold text-neutral-200">
						Empresa
						<select
							className={`${adminInputClass} mt-2`}
							value={form.fkEmpresa}
							onChange={(event) => updateForm("fkEmpresa", event.target.value)}
							required
						>
							<option value="" disabled>
								Selecione
							</option>
							{companies.map((company) => (
								<option key={company.id} value={company.id}>
									{company.nome}
								</option>
							))}
						</select>
					</label>
					<div className="flex gap-3">
						<button type="submit" className={adminButtonClass} disabled={saving}>
							{saving ? "Salvando..." : selectedGame ? "Atualizar jogo" : "Criar jogo"}
						</button>
						{selectedGame ? (
							<button
								type="button"
								onClick={() => {
									setSelectedGameId(null);
									setSelectedGame(null);
									setForm(EMPTY_FORM);
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
