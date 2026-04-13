import { BarChart3, Building2, FolderKanban, Gamepad2, ShieldCheck, Users } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

const LINKS = [
	{
		to: "/admin/usuarios",
		label: "Usuarios",
		description: "Consulta e edicao de contas",
		Icon: Users,
	},
	{
		to: "/admin/empresas",
		label: "Empresas",
		description: "CRUD de publicadoras",
		Icon: Building2,
	},
	{
		to: "/admin/perfis",
		label: "Perfis",
		description: "Perfis e papeis disponiveis",
		Icon: ShieldCheck,
	},
	{
		to: "/admin/jogos",
		label: "Jogos",
		description: "Cadastro e manutencao do catalogo",
		Icon: Gamepad2,
	},
	{
		to: "/admin/categorias",
		label: "Categorias",
		description: "Consulta das categorias existentes",
		Icon: FolderKanban,
	},
	{
		to: "/admin/relatorios",
		label: "Relatorios",
		description: "Mais vendidos e filtros",
		Icon: BarChart3,
	},
] as const;

export function AdminLayout() {
	return (
		<div className="space-y-6">
			<header>
				<p className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[var(--color-gs-accent)]">
					Painel administrativo
				</p>
				<h1 className="mt-2 text-3xl font-bold tracking-tight text-neutral-100">Administracao da loja</h1>
				<p className="mt-2 max-w-3xl text-[14px] leading-relaxed text-neutral-400">
					Todas as telas abaixo consomem os endpoints administrativos existentes na API
					`api-vendas-jogos-digitais`.
				</p>
			</header>

			<nav className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
				{LINKS.map(({ to, label, description, Icon }) => (
					<NavLink
						key={to}
						to={to}
						className={({ isActive }) =>
							`rounded-2xl border p-4 transition ${
								isActive
									? "border-[var(--color-gs-accent)]/40 bg-[var(--color-gs-accent)]/10"
									: "border-white/10 bg-gs-surface hover:border-white/15 hover:bg-gs-raised"
							}`
						}
					>
						<div className="flex items-start gap-3">
							<div className="rounded-xl bg-black/20 p-2 text-[var(--color-gs-accent)]">
								<Icon className="h-5 w-5" strokeWidth={1.8} />
							</div>
							<div>
								<p className="text-[14px] font-semibold text-neutral-100">{label}</p>
								<p className="mt-1 text-[12px] leading-relaxed text-neutral-400">{description}</p>
							</div>
						</div>
					</NavLink>
				))}
			</nav>

			<section>
				<Outlet />
			</section>
		</div>
	);
}
