export function PrivacidadePage() {
	const title = "text-neutral-100";
	const body = "text-neutral-400";
	const card =
		"rounded-xl border border-white/10 bg-gs-surface p-6 shadow-[0_3px_16px_rgba(0,0,0,0.3)]";
	const h2 = "mt-6 text-base font-bold text-neutral-100";

	return (
		<div className="mx-auto max-w-2xl pb-6">
			<h1 className={`mb-5 text-2xl font-bold tracking-tight md:text-3xl ${title}`}>
				Política de privacidade
			</h1>
			<div className={card}>
				<p className={`text-[14px] leading-relaxed ${body}`}>
					Este projeto demonstrativo de Game Store coleta apenas dados básicos fornecidos voluntariamente pelo usuário (como nome, e-mail e informações de login) para fins de autenticação e simulação de funcionalidades. Os dados são utilizados exclusivamente dentro do ambiente acadêmico, não sendo compartilhados com terceiros.

					Por se tratar de um projeto acadêmico, não há um encarregado formal (DPO). Para dúvidas, entre em contato com os desenvolvedores responsáveis pelo projeto.
				</p>
				<h2 id="cookies" className={h2}>
					Cookies e dados
				</h2>
				<p className={`text-[14px] leading-relaxed ${body}`}>
					Este projeto demonstrativo de Game Store utiliza cookies de forma limitada, apenas para simulação de funcionalidades.
				</p>
			</div>
		</div>
	);
}
