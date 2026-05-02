import {

	Headphones,

	HelpCircle,

	Mail,

	MapPin,

	MessageCircle,

	Phone,

	Play,

	Share2,

	Shield,

} from "lucide-react";

import { Link } from "react-router-dom";

import { useAuth } from "@/contexts/AuthContext";



const SOCIAL = [

	{

		href: "https://www.instagram.com",

		label: "Instagram",

		Icon: Share2,

	},

	{

		href: "https://twitter.com",

		label: "X (Twitter)",

		Icon: MessageCircle,

	},

	{

		href: "https://www.youtube.com",

		label: "YouTube",

		Icon: Play,

	},

] as const;



export function AppFooter() {

	const { isAuthenticated } = useAuth();

	const lojaInicioTo = isAuthenticated ? "/jogos" : "/";



	const shell = "border-t border-white/10 bg-[#121212]";

	const heading = "text-neutral-100";

	const muted = "text-neutral-500";

	const link = "text-neutral-400 transition hover:text-neutral-200";

	const iconWrap =

		"rounded-full border border-white/10 bg-white/5 text-neutral-300 transition hover:bg-white/10 hover:text-white";



	return (

		<footer className={`mt-auto ${shell}`}>

			<div className="mx-auto w-full max-w-7xl px-5 py-11 md:px-6 md:py-14">

				<div className="mb-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">

					<div>

						<p className={`text-sm font-semibold ${heading}`}>Precisa de ajuda?</p>

						<p className={`mt-1 max-w-md text-sm ${muted}`}>

							Respostas rápidas sobre compras, chaves e biblioteca.

						</p>

					</div>

					<Link

						to="/faq"

						className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--color-gs-accent)]/40 bg-[var(--color-gs-accent)]/10 px-5 py-2.5 text-[14px] font-semibold text-[var(--color-gs-accent)] transition hover:bg-[var(--color-gs-accent)]/20"

					>

						<HelpCircle className="h-5 w-5" strokeWidth={2} />

						Perguntas frequentes

					</Link>

				</div>



				<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-7">

					<div>

						<h3 className={`mb-4 text-[13px] font-bold uppercase tracking-wider ${heading}`}>

							Contato

						</h3>

						<ul className={`space-y-3 text-sm ${muted}`}>

							<li className="flex gap-3">

								<Mail className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-gs-accent)]" />

								<a href="mailto:contato@gamesstore.com.br" className={link}>

									contato@gamesstore.com.br

								</a>

							</li>

							<li className="flex gap-3">

								<Phone className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-gs-accent)]" />

								<a href="tel:+551140000000" className={link}>

									(71) 4000-0000

								</a>

							</li>

							<li className="flex gap-3">

								<MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-gs-accent)]" />

								<span>Av. Tancredo Neves, 231, Caminho das Árvores, Salvador - BA, 41820-021</span>

							</li>

						</ul>

					</div>



					<div>

						<h3 className={`mb-4 text-[13px] font-bold uppercase tracking-wider ${heading}`}>

							Suporte

						</h3>

						<ul className={`space-y-3 text-sm ${muted}`}>

							<li className="flex gap-3">

								<Headphones className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-gs-accent)]" />

								<span>Segunda a sexta, 9h às 18h (horário de Brasília)</span>

							</li>

							<li>

								<a href="mailto:suporte@gamesstore.com.br" className={link}>

									suporte@gamesstore.com.br

								</a>

							</li>

							<li>

								<Link to="/faq" className={`inline-flex items-center gap-1.5 font-medium ${link}`}>

									<HelpCircle className="h-4 w-4 text-[var(--color-gs-accent)]" />

									Central de ajuda / FAQ

								</Link>

							</li>

						</ul>

					</div>



					<div>

						<h3 className={`mb-4 text-[13px] font-bold uppercase tracking-wider ${heading}`}>

							Loja

						</h3>

						<ul className="space-y-2.5 text-sm">

							<li>

								<Link to={lojaInicioTo} className={link}>

									Início

								</Link>

							</li>

							<li>

								<Link to="/jogos" className={link}>

									Catálogo de jogos

								</Link>

							</li>

							<li>

								<Link to="/carrinho" className={link}>

									Carrinho

								</Link>

							</li>

							<li>

								<Link to="/lista-desejos" className={link}>

									Lista de desejos

								</Link>

							</li>

						</ul>

					</div>



					<div>

						<h3 className={`mb-4 text-[13px] font-bold uppercase tracking-wider ${heading}`}>

							Informações

						</h3>

						<ul className="space-y-2.5 text-sm">

							<li>

								<Link to="/termos" className={link}>

									Termos de uso

								</Link>

							</li>

							<li>

								<Link to="/privacidade" className={link}>

									Política de privacidade

								</Link>

							</li>

							<li>

								<Link to="/privacidade#cookies" className={`inline-flex items-center gap-1.5 ${link}`}>

									<Shield className="h-4 w-4 text-[var(--color-gs-accent)]" />

									Cookies e dados

								</Link>

							</li>

						</ul>

						<p className={`mt-4 text-xs leading-relaxed ${muted}`}>

							Game Store é um projeto para a A3. Dados de contato e endereço são fictícios.

						</p>

					</div>

				</div>



				<div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-10 md:flex-row">

					<div className="flex flex-wrap items-center justify-center gap-3">

						{SOCIAL.map(({ href, label, Icon }) => (

							<a

								key={label}

								href={href}

								target="_blank"

								rel="noopener noreferrer"

								className={`flex h-11 w-11 items-center justify-center ${iconWrap}`}

								aria-label={label}

							>

								<Icon className="h-5 w-5" strokeWidth={1.75} />

							</a>

						))}

					</div>

					<p className={`text-center text-xs ${muted}`}>

						© {new Date().getFullYear()} Game Store. Todos os direitos reservados.

					</p>

				</div>

			</div>

		</footer>

	);

}

