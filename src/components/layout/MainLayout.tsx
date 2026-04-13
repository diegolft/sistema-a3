import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AppFooter } from "@/components/layout/AppFooter";
import { AppHeader } from "@/components/layout/AppHeader";

export function MainLayout() {
	const location = useLocation();
	const navigate = useNavigate();
	const isLanding = location.pathname === "/";

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
		<div className="flex min-h-screen flex-col overflow-x-hidden font-sans text-neutral-100 antialiased">
			<AppHeader />
			<main
				className={`w-full flex-1 px-5 pb-9 pt-5 md:px-6 md:pb-12 md:pt-7 ${isLanding ? "" : "mx-auto max-w-7xl"}`}
			>
			{/*
			 * Nao use mode="wait" nem opacity:0 no enter: com React 19 + StrictMode o exit/enter
			 * do Outlet pode travar e a tela nova ficar invisivel ate uma segunda navegacao.
			 */}
			<AnimatePresence initial={false}>
				<motion.div
					key={location.pathname}
					initial={{ y: 10 }}
					animate={{ y: 0, opacity: 1 }}
					exit={{ y: -6, opacity: 1 }}
					transition={{ type: "spring", stiffness: 420, damping: 34 }}
				>
					<Outlet />
				</motion.div>
			</AnimatePresence>
			</main>
			<AppFooter />
		</div>
	);
}
