import { useState } from "react";

import { ChevronDown, HelpCircle } from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";



const ITEMS = [

	{

		q: "Como recebo o jogo depois da compra?",

		a: "As chaves e instruções de ativação são enviadas para o e-mail cadastrado assim que o pagamento for confirmado. Você também encontra tudo na sua biblioteca, na área logada.",

	},

	{

		q: "Quais formas de pagamento são aceitas?",

		a: "Nesta demonstração, o fluxo de pagamento é simulado. Em produção, costuma-se integrar cartão, Pix e carteiras digitais conforme o gateway escolhido.",

	},

	{

		q: "Posso pedir reembolso?",

		a: "Políticas de reembolso dependem do tipo de produto e da legislação local. Em ambiente real, descreva prazos e condições aqui e mantenha o canal de suporte visível.",

	},

	{

		q: "Esqueci minha senha. E agora?",

		a: "Use a opção “Esqueci a senha” na tela de login. Você receberá instruções por e-mail para redefinir o acesso.",

	},

	{

		q: "Os jogos funcionam em qual plataforma?",

		a: "Cada página de produto indica a plataforma (PC, console, etc.) e o launcher necessário. Confira sempre os requisitos antes de comprar.",

	},

] as const;



export function FaqPage() {

	const [open, setOpen] = useState<number | null>(0);



	const card =
		"rounded-xl border border-white/10 bg-gs-surface shadow-[0_3px_16px_rgba(0,0,0,0.3)]";

	const title = "text-neutral-100";

	const muted = "text-neutral-400";



	return (

		<div className="mx-auto max-w-2xl pb-6">

			<div className="mb-7 text-center">

				<div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-gs-accent)]/15 text-[var(--color-gs-accent)]">

					<HelpCircle className="h-6 w-6" strokeWidth={1.75} />

				</div>

				<h1 className={`text-2xl font-bold tracking-tight md:text-3xl ${title}`}>

					Perguntas frequentes

				</h1>

				<p className={`mx-auto mt-2 max-w-md text-[14px] leading-relaxed ${muted}`}>

					Respostas objetivas sobre compras, entrega digital e conta. Em dúvida, fale com o suporte pelo

					footer do site.

				</p>

			</div>



			<div className="space-y-2.5">

				{ITEMS.map((item, i) => {

					const isOpen = open === i;

					return (

						<div key={item.q} className={`overflow-hidden ${card}`}>

							<button

								type="button"

								onClick={() => setOpen(isOpen ? null : i)}

								className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-[14px] font-semibold text-neutral-100 transition hover:bg-white/[0.04]"

								aria-expanded={isOpen}

							>

								{item.q}

								<ChevronDown

									className={`h-5 w-5 shrink-0 text-[var(--color-gs-accent)] transition-transform ${

										isOpen ? "rotate-180" : ""

									}`}

									strokeWidth={2}

								/>

							</button>

							<AnimatePresence initial={false}>

								{isOpen ? (

									<motion.div

										initial={{ height: 0, opacity: 0 }}

										animate={{ height: "auto", opacity: 1 }}

										exit={{ height: 0, opacity: 0 }}

										transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}

										className="overflow-hidden"

									>

										<p className="border-t border-white/10 px-4 py-3 text-[14px] leading-relaxed text-neutral-400">

											{item.a}

										</p>

									</motion.div>

								) : null}

							</AnimatePresence>

						</div>

					);

				})}

			</div>

			<p className="mt-10 text-center text-[13px] text-neutral-500">
				Atalho: <kbd className="rounded border border-white/15 bg-gs-raised px-1.5 py-0.5 font-mono text-[12px] text-neutral-400">Alt</kbd>{" "}
				+{" "}
				<kbd className="rounded border border-white/15 bg-gs-raised px-1.5 py-0.5 font-mono text-[12px] text-neutral-400">H</kbd>{" "}
				abre esta página a partir de qualquer lugar do site.
			</p>

		</div>

	);

}

