import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { GameCard } from "@/components/games/GameCard";
import { useWishlist } from "@/contexts/WishlistContext";
import { MOCK_GAMES } from "@/data/mockGames";

export function WishlistPage() {
	const { wishlistIds } = useWishlist();

	const games = useMemo(() => MOCK_GAMES.filter((g) => wishlistIds.includes(g.id)), [wishlistIds]);

	return (
		<div>
			<header className="mb-7 md:mb-8">
				<h1 className="text-2xl font-bold tracking-tight text-neutral-100 md:text-3xl">
					Lista de Desejos
				</h1>
			</header>

			{games.length === 0 ? (
				<motion.div
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					className="flex flex-col items-center justify-center py-20 text-center"
				>
					<Heart className="mb-5 h-16 w-16 text-neutral-600" strokeWidth={1} />
					<p className="text-[14px] text-neutral-400">Sua lista de desejos está vazia.</p>
					<Link
						to="/jogos"
						className="mt-6 rounded-full bg-[var(--color-gs-accent)] px-6 py-3 text-[14px] font-semibold text-white shadow-[0_4px_18px_rgba(255,140,51,0.32)] transition hover:bg-[var(--color-gs-accent-hover)]"
					>
						Explorar Jogos
					</Link>
				</motion.div>
			) : (
				<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{games.map((game) => (
						<GameCard key={game.id} game={game} />
					))}
				</div>
			)}
		</div>
	);
}
