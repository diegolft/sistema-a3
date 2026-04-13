import { motion } from "framer-motion";
import {
	BarChart3,
	Gamepad2,
	Heart,
	LogOut,
	Menu,
	ShoppingCart,
	User,
	X,
} from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

export function AppHeader() {
	const { isAuthenticated, isAdmin, logout } = useAuth();
	const { itemCount } = useCart();
	const navigate = useNavigate();
	const [logoutOpen, setLogoutOpen] = useState(false);
	const [mobileNavOpen, setMobileNavOpen] = useState(false);

	const navBase = "text-[15px] font-medium text-neutral-400 transition-colors hover:text-neutral-200";
	const navActive = "font-semibold text-neutral-100";
	const iconButton =
		"flex h-10 w-10 items-center justify-center rounded-full text-neutral-400 transition hover:bg-white/10";

	function confirmLogout() {
		logout();
		setLogoutOpen(false);
		setMobileNavOpen(false);
		navigate("/");
	}

	const closeMobileNav = () => setMobileNavOpen(false);

	return (
		<header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#121212]">
			<ConfirmDialog
				open={logoutOpen}
				title="Sair da conta?"
				description="Voce precisara entrar novamente para acessar biblioteca, perfil e painel administrativo."
				cancelLabel="Cancelar"
				confirmLabel="Sair"
				onCancel={() => setLogoutOpen(false)}
				onConfirm={confirmLogout}
			/>
			<div className="relative flex h-[60px] w-full max-w-none items-center justify-between gap-4 px-5 sm:px-10 md:px-14 lg:px-20 xl:px-24">
				<Link to={isAuthenticated ? "/jogos" : "/"} className="flex shrink-0 items-center gap-2">
					<Gamepad2 className="h-7 w-7 text-[var(--color-gs-accent)]" strokeWidth={1.75} />
					<span className="text-[17px] font-bold tracking-tight text-neutral-100">
						Game <span className="text-[var(--color-gs-accent)]">Store</span>
					</span>
				</Link>

				<nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
					{isAuthenticated ? null : (
						<NavLink to="/" end className={({ isActive }) => `${navBase} ${isActive ? navActive : ""}`}>
							Inicio
						</NavLink>
					)}
					<NavLink to="/jogos" className={({ isActive }) => `${navBase} ${isActive ? navActive : ""}`}>
						Jogos
					</NavLink>
					{isAuthenticated ? (
						<NavLink
							to="/biblioteca"
							className={({ isActive }) => `${navBase} ${isActive ? navActive : ""}`}
						>
							Biblioteca
						</NavLink>
					) : null}
					{isAdmin ? (
						<NavLink
							to="/admin/usuarios"
							className={({ isActive }) => `${navBase} ${isActive ? navActive : ""}`}
						>
							Admin
						</NavLink>
					) : null}
				</nav>

				<div className="flex shrink-0 items-center justify-end gap-1 sm:gap-2 md:gap-3">
					<button
						type="button"
						className={`${iconButton} md:hidden`}
						onClick={() => setMobileNavOpen((open) => !open)}
						aria-expanded={mobileNavOpen}
						aria-controls="mobile-main-nav"
						aria-label={mobileNavOpen ? "Fechar menu" : "Abrir menu"}
					>
						{mobileNavOpen ? (
							<X className="h-5 w-5" strokeWidth={1.75} />
						) : (
							<Menu className="h-5 w-5" strokeWidth={1.75} />
						)}
					</button>

					{isAuthenticated ? (
						<>
							{isAdmin ? (
								<motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }}>
									<Link to="/admin/usuarios" className={iconButton} aria-label="Painel admin">
										<BarChart3 className="h-5 w-5" strokeWidth={1.75} />
									</Link>
								</motion.div>
							) : null}
							<motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }}>
								<Link to="/lista-desejos" className={iconButton} aria-label="Lista de desejos">
									<Heart className="h-5 w-5" strokeWidth={1.75} />
								</Link>
							</motion.div>
							<motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }} className="relative">
								<Link to="/carrinho" className={iconButton} aria-label="Carrinho">
									<ShoppingCart className="h-5 w-5" strokeWidth={1.75} />
								</Link>
								{itemCount > 0 ? (
									<span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[var(--color-gs-accent)] px-1 text-[10px] font-bold text-white">
										{itemCount > 9 ? "9+" : itemCount}
									</span>
								) : null}
							</motion.div>
							<motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }}>
								<Link to="/perfil" className={iconButton} aria-label="Perfil">
									<User className="h-5 w-5" strokeWidth={1.75} />
								</Link>
							</motion.div>
							<motion.button
								type="button"
								whileHover={{ scale: 1.06 }}
								whileTap={{ scale: 0.96 }}
								onClick={() => setLogoutOpen(true)}
								className={iconButton}
								aria-label="Sair"
							>
								<LogOut className="h-5 w-5" strokeWidth={1.75} />
							</motion.button>
						</>
					) : (
						<>
							<Link
								to="/login"
								className="hidden text-[15px] font-bold text-neutral-100 transition hover:text-white sm:inline"
							>
								Entrar
							</Link>
							<Link
								to="/cadastro"
								className="rounded-[10px] bg-[var(--color-gs-accent)] px-5 py-2.5 text-[14px] font-bold text-white shadow-[0_4px_20px_rgba(255,122,0,0.35)] transition hover:bg-[var(--color-gs-accent-hover)]"
							>
								Criar Conta
							</Link>
						</>
					)}
				</div>
			</div>

			{mobileNavOpen ? (
				<nav
					id="mobile-main-nav"
					className="border-t border-white/10 bg-[#121212] px-5 py-4 md:hidden"
					aria-label="Navegacao principal"
				>
					<div className="mx-auto flex max-w-7xl flex-col gap-1">
						{isAuthenticated ? null : (
							<NavLink
								to="/"
								end
								onClick={closeMobileNav}
								className={({ isActive }) =>
									`rounded-lg px-3 py-2.5 ${navBase} ${isActive ? navActive : ""}`
								}
							>
								Inicio
							</NavLink>
						)}
						<NavLink
							to="/jogos"
							onClick={closeMobileNav}
							className={({ isActive }) =>
								`rounded-lg px-3 py-2.5 ${navBase} ${isActive ? navActive : ""}`
							}
						>
							Jogos
						</NavLink>
						{isAuthenticated ? (
							<NavLink
								to="/biblioteca"
								onClick={closeMobileNav}
								className={({ isActive }) =>
									`rounded-lg px-3 py-2.5 ${navBase} ${isActive ? navActive : ""}`
								}
							>
								Biblioteca
							</NavLink>
						) : null}
						{isAdmin ? (
							<NavLink
								to="/admin/usuarios"
								onClick={closeMobileNav}
								className={({ isActive }) =>
									`rounded-lg px-3 py-2.5 ${navBase} ${isActive ? navActive : ""}`
								}
							>
								Admin
							</NavLink>
						) : null}
					</div>
				</nav>
			) : null}
		</header>
	);
}
