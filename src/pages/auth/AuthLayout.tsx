import { motion } from "framer-motion";
import { Gamepad2 } from "lucide-react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

type Props = {
	children: React.ReactNode;
	/** Subtítulo abaixo do nome da loja (ex.: “Entre na sua conta”). */
	subtitle?: string;
};

export function AuthLayout({ children, subtitle }: Props) {
	const navigate = useNavigate();

	useEffect(() => {
		function onKeyDown(e: KeyboardEvent) {
			if (!e.altKey || e.key.toLowerCase() !== "h") return;
			const el = e.target as HTMLElement | null;
			if (el?.closest("input, textarea, select, [contenteditable='true']")) return;
			e.preventDefault();
			navigate("/faq");
		}
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [navigate]);

	return (
		<div className="min-h-screen bg-gs-cream font-sans text-neutral-100 antialiased">
			<div className="mx-auto flex min-h-screen max-w-[400px] flex-col px-5 py-6 sm:px-6 sm:py-8">
				<div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
					<div className="my-auto flex w-full flex-col">
						<header className="mb-4 shrink-0 text-center">
							<motion.div
								initial={{ opacity: 0, y: 8 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ type: "spring", stiffness: 320, damping: 28 }}
							>
								<Link to="/" className="inline-flex flex-col items-center gap-2">
									<Gamepad2 className="h-9 w-9 text-[var(--color-gs-accent)] sm:h-10 sm:w-10" strokeWidth={1.5} />
									<span className="text-[20px] font-bold tracking-tight sm:text-[22px]">
										<span className="text-neutral-100">Game </span>
										<span className="text-[var(--color-gs-accent)]">Store</span>
									</span>
								</Link>
								{subtitle ? <p className="mt-1.5 text-[13px] text-neutral-400">{subtitle}</p> : null}
							</motion.div>
						</header>
						<main>{children}</main>
					</div>
				</div>
				<footer className="shrink-0 pt-6 text-center text-[12px] text-neutral-400 sm:pt-8">
					© {new Date().getFullYear()} Game Store
				</footer>
			</div>
		</div>
	);
}
