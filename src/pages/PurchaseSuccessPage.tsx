import { motion } from "framer-motion";
import { Link, Navigate, useLocation } from "react-router-dom";

type LocationState = { items: string[]; total: number } | null;

export function PurchaseSuccessPage() {
	const location = useLocation();
	const state = location.state as LocationState;

	if (!state?.items?.length) return <Navigate to="/jogos" replace />;

	return (
		<div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
			<motion.div
				initial={{ scale: 0, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ type: "spring", stiffness: 300, damping: 22 }}
				className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--color-gs-accent)]/15 text-5xl"
				role="img"
				aria-label="Controle de jogo"
			>
				🎮
			</motion.div>

			<motion.h1
				initial={{ opacity: 0, y: 12 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 26 }}
				className="text-2xl font-bold tracking-tight text-neutral-100"
			>
				Compra concluída!
			</motion.h1>

			<motion.p
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.2 }}
				className="mt-2 text-[14px] text-neutral-400"
			>
				{state.items.length === 1
					? "1 jogo adicionado"
					: `${state.items.length} jogos adicionados`}{" "}
				à sua biblioteca
			</motion.p>

			<motion.ul
				role="list"
				initial={{ opacity: 0, y: 8 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.25 }}
				className="mt-5 w-full rounded-xl border border-white/10 bg-gs-surface p-4 text-left"
			>
				{state.items.map((name) => (
					<li key={name} className="flex items-center gap-2 py-1 text-[13px] text-neutral-300">
						<span className="font-bold text-[var(--color-gs-accent)]">✓</span>
						{name}
					</li>
				))}
			</motion.ul>

			<motion.div
				initial={{ opacity: 0, y: 8 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.35 }}
				className="mt-7 flex gap-3"
			>
				<Link
					to="/biblioteca"
					className="rounded-full bg-[var(--color-gs-accent)] px-6 py-3 text-[14px] font-semibold text-white shadow-[0_4px_18px_rgba(255,140,51,0.32)] transition hover:bg-[var(--color-gs-accent-hover)]"
				>
					Ir para Biblioteca
				</Link>
				<Link
					to="/jogos"
					className="rounded-full border border-white/15 bg-gs-surface px-5 py-3 text-[14px] font-semibold text-neutral-200 transition hover:bg-gs-raised"
				>
					Ver Jogos
				</Link>
			</motion.div>
		</div>
	);
}
