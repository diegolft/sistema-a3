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
					Descreva aqui como você coleta, usa e armazena dados pessoais (LGPD/GDPR), bases legais, direitos
					do titular e contato do encarregado. Este conteúdo é placeholder para o projeto demonstrativo Game
					Store.
				</p>
				<h2 id="cookies" className={h2}>
					Cookies e dados
				</h2>
				<p className={`text-[14px] leading-relaxed ${body}`}>
					Explique quais cookies são utilizados (essenciais, analíticos, marketing), como o usuário pode
					gerenciar preferências e por quanto tempo os dados são retidos.
				</p>
			</div>
		</div>
	);
}
