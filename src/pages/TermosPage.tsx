export function TermosPage() {
	const title = "text-neutral-100";
	const body = "text-neutral-400";
	const card =
		"rounded-xl border border-white/10 bg-gs-surface p-6 shadow-[0_3px_16px_rgba(0,0,0,0.3)]";

	return (
		<div className="mx-auto max-w-2xl pb-6">
			<h1 className={`mb-5 text-2xl font-bold tracking-tight md:text-3xl ${title}`}>Termos de uso</h1>
			<div className={card}>
				<div className={card}>
	<p className={`text-[14px] leading-relaxed ${body}`}>
		Última atualização: 1º de junho de 2026
	</p>

	<p className={`mt-3 text-[14px] leading-relaxed ${body}`}>
		Bem-vindo à Game Store. Ao criar uma conta e utilizar nossa plataforma, você concorda
		com os termos descritos abaixo. Recomendamos a leitura atenta antes de realizar
		qualquer compra.
	</p>

	<h2 className={`mt-6 text-base font-bold tracking-tight ${title}`}>1. Cadastro e conta</h2>
	<p className={`mt-3 text-[14px] leading-relaxed ${body}`}>
		Para comprar jogos, é necessário criar uma conta com e-mail e senha válidos. Você é
		responsável por manter a confidencialidade dos seus dados de acesso e por todas as
		atividades realizadas em sua conta.
	</p>
	<p className={`mt-3 text-[14px] leading-relaxed ${body}`}>
		Caso suspeite de uso não autorizado da sua conta, altere sua senha imediatamente e
		entre em contato com o nosso suporte.
	</p>

	<h2 className={`mt-6 text-base font-bold tracking-tight ${title}`}>
		2. Produtos e licenças digitais
	</h2>
	<p className={`mt-3 text-[14px] leading-relaxed ${body}`}>
		Os itens vendidos na Game Store são licenças digitais de uso de jogos, ativadas por
		meio de chaves enviadas à sua biblioteca após a confirmação do pagamento.
	</p>
	<p className={`mt-3 text-[14px] leading-relaxed ${body}`}>
		A compra não transfere a propriedade do software — apenas o direito de uso, conforme os
		termos do próprio desenvolvedor ou distribuidor do jogo.
	</p>

	<h2 className={`mt-6 text-base font-bold tracking-tight ${title}`}>3. Pagamentos</h2>
	<p className={`mt-3 text-[14px] leading-relaxed ${body}`}>
		Aceitamos pagamento via Pix, cartão de crédito e boleto bancário. Os valores exibidos já
		incluem os tributos aplicáveis.
	</p>
	<p className={`mt-3 text-[14px] leading-relaxed ${body}`}>
		A confirmação da compra ocorre somente após a aprovação do pagamento pela instituição
		financeira responsável.
	</p>

	<h2 className={`mt-6 text-base font-bold tracking-tight ${title}`}>
		4. Reembolsos e cancelamentos
	</h2>
	<p className={`mt-3 text-[14px] leading-relaxed ${body}`}>
		Solicitações de reembolso podem ser feitas em até 7 dias após a compra, desde que o
		jogo não tenha sido ativado ou que o tempo de uso acumulado não ultrapasse 2 horas.
	</p>
	<p className={`mt-3 text-[14px] leading-relaxed ${body}`}>
		Consulte nossa página de Perguntas frequentes para mais detalhes sobre o processo de
		reembolso.
	</p>

	<h2 className={`mt-6 text-base font-bold tracking-tight ${title}`}>5. Conduta do usuário</h2>
	<p className={`mt-3 text-[14px] leading-relaxed ${body}`}>
		Você se compromete a não utilizar a plataforma para fins ilícitos, não compartilhar
		suas chaves de ativação com terceiros e não tentar acessar áreas restritas do sistema.
	</p>
	<p className={`mt-3 text-[14px] leading-relaxed ${body}`}>
		O descumprimento destas regras pode resultar em suspensão ou encerramento da conta, sem
		prejuízo de outras medidas cabíveis.
	</p>

	<h2 className={`mt-6 text-base font-bold tracking-tight ${title}`}>
		6. Propriedade intelectual
	</h2>
	<p className={`mt-3 text-[14px] leading-relaxed ${body}`}>
		Marcas, logotipos, imagens e demais conteúdos exibidos na Game Store pertencem aos seus
		respectivos proprietários e estão protegidos por leis de direitos autorais e
		propriedade industrial.
	</p>

	<h2 className={`mt-6 text-base font-bold tracking-tight ${title}`}>
		7. Limitação de responsabilidade
	</h2>
	<p className={`mt-3 text-[14px] leading-relaxed ${body}`}>
		A Game Store não se responsabiliza por instabilidades fora de seu controle, como falhas
		de conexão, indisponibilidade temporária dos servidores dos desenvolvedores dos jogos ou
		problemas no dispositivo do usuário.
	</p>
	<p className={`mt-3 text-[14px] leading-relaxed ${body}`}>
		Sempre que possível, comunicaremos manutenções programadas com antecedência.
	</p>

	<h2 className={`mt-6 text-base font-bold tracking-tight ${title}`}>
		8. Alterações nestes termos
	</h2>
	<p className={`mt-3 text-[14px] leading-relaxed ${body}`}>
		Podemos atualizar estes termos periodicamente. Alterações relevantes serão comunicadas
		por e-mail ou por aviso na plataforma, com a data da última atualização sempre
		disponível no topo desta página.
	</p>

	<h2 className={`mt-6 text-base font-bold tracking-tight ${title}`}>
		9. Lei aplicável e foro
	</h2>
	<p className={`mt-3 text-[14px] leading-relaxed ${body}`}>
		Estes termos são regidos pelas leis brasileiras. Eventuais conflitos serão resolvidos no
		foro da comarca de São Paulo, SP, salvo disposição legal em contrário.
	</p>

	<h2 className={`mt-6 text-base font-bold tracking-tight ${title}`}>10. Contato</h2>
	<p className={`mt-3 text-[14px] leading-relaxed ${body}`}>
		Em caso de dúvidas sobre estes termos, entre em contato pelo e-mail
		suporte@gamesstore.com.br.
	</p>
</div>
				<p className={`mt-3 text-[14px] leading-relaxed ${body}`}>
					Em produção, recomenda-se revisão jurídica e data de última atualização visível no topo ou rodapé
					desta página.
				</p>
			</div>
		</div>
	);
}
