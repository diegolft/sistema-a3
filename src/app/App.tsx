import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { MainLayout } from "@/components/layout/MainLayout";
import { PublicHomeRoute } from "@/components/routing/PublicHomeRoute";
import { RequireAuth } from "@/components/routing/RequireAuth";
import { RequireRole } from "@/components/routing/RequireRole";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { LibraryProvider } from "@/contexts/LibraryContext";
import { SalesProvider } from "@/contexts/SalesContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { ChangePasswordPage } from "@/pages/auth/ChangePasswordPage";
import { ForgotPasswordPage } from "@/pages/auth/ForgotPasswordPage";
import { LoginPage } from "@/pages/auth/LoginPage";
import { RegisterPage } from "@/pages/auth/RegisterPage";
import { CartPage } from "@/pages/CartPage";
import { FaqPage } from "@/pages/FaqPage";
import { GameDetailPage } from "@/pages/GameDetailPage";
import { GamesPage } from "@/pages/GamesPage";
import { PrivacidadePage } from "@/pages/PrivacidadePage";
import { TermosPage } from "@/pages/TermosPage";
import { LibraryPage } from "@/pages/LibraryPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { WishlistPage } from "@/pages/WishlistPage";
import { AdminCategoriesPage } from "@/pages/admin/AdminCategoriesPage";
import { AdminCompaniesPage } from "@/pages/admin/AdminCompaniesPage";
import { AdminGamesPage } from "@/pages/admin/AdminGamesPage";
import { AdminProfilesPage } from "@/pages/admin/AdminProfilesPage";
import { AdminReportsPage } from "@/pages/admin/AdminReportsPage";
import { AdminUsersPage } from "@/pages/admin/AdminUsersPage";

export function App() {
	return (
		<AuthProvider>
			<LibraryProvider>
				<SalesProvider>
					<CartProvider>
						<WishlistProvider>
							<Toaster
								position="bottom-right"
								toastOptions={{
									classNames: {
										toast:
											"backdrop-blur-md bg-gs-surface/95 border border-white/10 shadow-lg rounded-2xl text-neutral-100",
										title: "font-medium",
										description: "text-neutral-400",
									},
								}}
								richColors
							/>
							<Routes>
								<Route path="/" element={<MainLayout />}>
									<Route index element={<PublicHomeRoute />} />
									<Route path="jogos" element={<GamesPage />} />
									<Route path="faq" element={<FaqPage />} />
									<Route path="termos" element={<TermosPage />} />
									<Route path="privacidade" element={<PrivacidadePage />} />

									<Route element={<RequireAuth />}>
										<Route path="jogos/:id" element={<GameDetailPage />} />
										<Route path="carrinho" element={<CartPage />} />
										<Route path="lista-desejos" element={<WishlistPage />} />
										<Route path="biblioteca" element={<LibraryPage />} />
										<Route path="perfil" element={<ProfilePage />} />
									</Route>

									<Route element={<RequireRole role="Administrador" />}>
										<Route path="admin" element={<AdminLayout />}>
											<Route index element={<Navigate to="/admin/usuarios" replace />} />
											<Route path="usuarios" element={<AdminUsersPage />} />
											<Route path="empresas" element={<AdminCompaniesPage />} />
											<Route path="perfis" element={<AdminProfilesPage />} />
											<Route path="jogos" element={<AdminGamesPage />} />
											<Route path="categorias" element={<AdminCategoriesPage />} />
											<Route path="relatorios" element={<AdminReportsPage />} />
										</Route>
									</Route>
								</Route>
								<Route path="/login" element={<LoginPage />} />
								<Route path="/esqueci-senha" element={<ForgotPasswordPage />} />
								<Route path="/cadastro" element={<RegisterPage />} />
								<Route path="/alterar-senha" element={<ChangePasswordPage />} />
								<Route path="*" element={<Navigate to="/" replace />} />
							</Routes>
						</WishlistProvider>
					</CartProvider>
				</SalesProvider>
			</LibraryProvider>
		</AuthProvider>
	);
}
