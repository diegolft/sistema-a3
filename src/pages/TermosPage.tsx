export function TermosPage() {
	const title = "text-neutral-100";
	const body = "text-neutral-400";
	const card =
		"rounded-xl border border-white/10 bg-gs-surface p-6 shadow-[0_3px_16px_rgba(0,0,0,0.3)]";

	return (
		<div className="mx-auto max-w-2xl pb-6">
			<h1 className={`mb-5 text-2xl font-bold tracking-tight md:text-3xl ${title}`}>Termos de uso</h1>
			<div className={card}>
				<p className={`text-[14px] leading-relaxed ${body}`}>
					Este é um ambiente de demonstração. Substitua este texto pelos termos reais do seu serviço: uso
					do site, restrições de idade, licenças de software, limitação de responsabilidade e lei aplicável.
				</p>
				<p className={`mt-3 text-[14px] leading-relaxed ${body}`}>
					Em produção, recomenda-se revisão jurídica e data de última atualização visível no topo ou rodapé
					desta página.
				</p>
			</div>
		</div>
	);
}
