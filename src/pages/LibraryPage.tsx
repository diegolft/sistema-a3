import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/Skeleton";
import { useLibrary } from "@/contexts/LibraryContext";
import { formatBRL } from "@/lib/currency";

export function LibraryPage() {
	const { ownedGames, isLoading } = useLibrary();

	return (
		<div>
			<header className="mb-7 md:mb-8">
				<h1 className="text-2xl font-bold tracking-tight text-neutral-100 md:text-3xl">
					Minha Biblioteca
				</h1>
				<p className="mt-1.5 text-[14px] text-neutral-400">Jogos que voce adquiriu</p>
			</header>

			{isLoading ? (
				<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
					{(["l1", "l2", "l3"] as const).map((key) => (
						<Skeleton key={key} className="aspect-[16/13] rounded-2xl" />
					))}
				</div>
			) : ownedGames.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-16 text-center">
					<p className="max-w-sm text-[14px] text-neutral-400">
						Voce ainda nao tem jogos na biblioteca. Finalize uma compra no carrinho para ve-los aqui.
					</p>
					<Link
						to="/jogos"
						className="mt-6 rounded-full bg-[var(--color-gs-accent)] px-6 py-3 text-[14px] font-semibold text-white shadow-[0_4px_18px_rgba(255,140,51,0.32)] transition hover:bg-[var(--color-gs-accent-hover)]"
					>
						Explorar Jogos
					</Link>
				</div>
			) : (
				<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{ownedGames.map(({ chaveAtivacao, jogo }) => (
						<motion.div
							key={`${jogo.id}-${chaveAtivacao ?? "no-key"}`}
							layout
							whileHover={{ scale: 1.02, y: -2 }}
							transition={{ type: "spring", stiffness: 400, damping: 25 }}
							className="overflow-hidden rounded-xl bg-gs-surface shadow-[0_3px_18px_rgba(0,0,0,0.4)] ring-1 ring-white/[0.06]"
						>
							<Link to={`/jogos/${jogo.id}`}>
								<div className="relative aspect-[16/10] overflow-hidden">
									<img
										src={jogo.imageUrl}
										alt={`Arte de ${jogo.nome}`}
										className="h-full w-full object-cover transition duration-500 hover:scale-[1.03]"
									/>
									<span className="absolute left-3 top-3 rounded-full bg-black/65 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-neutral-100 backdrop-blur-sm">
										{jogo.categoriaNome}
									</span>
								</div>
							</Link>
							<div className="space-y-2 p-3.5">
								<h3 className="text-[15px] font-bold text-neutral-100">{jogo.nome}</h3>
								<p className="text-[13px] text-neutral-400">
									{jogo.empresaNome} • {formatBRL(jogo.precoFinal)}
								</p>
								<div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2">
									<p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-200">
										Chave de ativacao
									</p>
									<p className="mt-1 break-all text-[12px] text-emerald-50">
										{chaveAtivacao ?? "Aguardando emissao da chave"}
									</p>
								</div>
							</div>
						</motion.div>
					))}
				</div>
			)}
		</div>
	);
}
