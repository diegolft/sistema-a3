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
					Este projeto demonstrativo de Game Store é destinado exclusivamente para fins educacionais e não possui caráter comercial.
				</p>
				<p className={`mt-3 text-[14px] leading-relaxed ${body}`}>
					Por se tratar de um projeto acadêmico, não há garantias de segurança, disponibilidade ou proteção de dados em nível de produção.
				</p>
			</div>
		</div>
	);
}
