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


	<p className={`mt-3 text-[14px] leading-relaxed ${body}`}>
		Esta política descreve como a Game Store coleta, usa, armazena e protege os dados
		pessoais dos usuários, em conformidade com a Lei Geral de Proteção de Dados (Lei nº
		13.709/2018 — LGPD).
	</p>

	<h2 className={`mt-6 text-base font-bold tracking-tight ${title}`}>1. Dados que coletamos</h2>
	<p className={`mt-3 text-[14px] leading-relaxed ${body}`}>
		Coletamos os dados fornecidos no cadastro — nome, e-mail, data de nascimento e senha
		criptografada — além de informações sobre o uso da plataforma.
	</p>
	<p className={`mt-3 text-[14px] leading-relaxed ${body}`}>
		Isso inclui seu histórico de compras, os jogos da sua biblioteca, avaliações feitas e
		itens salvos na sua lista de desejos.
	</p>

	<h2 className={`mt-6 text-base font-bold tracking-tight ${title}`}>
		2. Finalidade do tratamento
	</h2>
	<p className={`mt-3 text-[14px] leading-relaxed ${body}`}>
		Utilizamos seus dados para criar e gerenciar sua conta, processar pagamentos e entregar
		as chaves de ativação dos jogos comprados.
	</p>
	<p className={`mt-3 text-[14px] leading-relaxed ${body}`}>
		Também usamos essas informações para exibir recomendações e histórico personalizado,
		enviar comunicações sobre sua conta e melhorar continuamente a experiência da
		plataforma.
	</p>

	<h2 className={`mt-6 text-base font-bold tracking-tight ${title}`}>3. Base legal</h2>
	<p className={`mt-3 text-[14px] leading-relaxed ${body}`}>
		O tratamento de dados é realizado com base na execução do contrato firmado ao criar sua
		conta, no cumprimento de obrigações legais e regulatórias e, quando aplicável, no seu
		consentimento.
	</p>

	<h2 className={`mt-6 text-base font-bold tracking-tight ${title}`}>
		4. Cookies e dados de navegação
	</h2>
	<p className={`mt-3 text-[14px] leading-relaxed ${body}`}>
		Utilizamos cookies essenciais para manter sua sessão ativa e garantir o funcionamento
		do carrinho e da autenticação.
	</p>
	<p className={`mt-3 text-[14px] leading-relaxed ${body}`}>
		Também podemos utilizar cookies analíticos, que ajudam a entender como a plataforma é
		utilizada e a melhorar nossos serviços. Você pode gerenciar essas preferências
		diretamente nas configurações do seu navegador.
	</p>

	<h2 className={`mt-6 text-base font-bold tracking-tight ${title}`}>
		5. Compartilhamento de dados
	</h2>
	<p className={`mt-3 text-[14px] leading-relaxed ${body}`}>
		Seus dados não são vendidos a terceiros. Podemos compartilhar informações estritamente
		necessárias com processadores de pagamento, para confirmação de transações.
	</p>
	<p className={`mt-3 text-[14px] leading-relaxed ${body}`}>
		Também compartilhamos dados com prestadores de serviços de infraestrutura, sempre sob
		obrigações contratuais de confidencialidade.
	</p>

	<h2 className={`mt-6 text-base font-bold tracking-tight ${title}`}>6. Retenção de dados</h2>
	<p className={`mt-3 text-[14px] leading-relaxed ${body}`}>
		Mantemos seus dados enquanto sua conta estiver ativa ou conforme necessário para
		cumprir obrigações legais, fiscais ou contratuais.
	</p>
	<p className={`mt-3 text-[14px] leading-relaxed ${body}`}>
		Você pode solicitar a exclusão da sua conta e dos dados associados a qualquer momento,
		observadas as exceções previstas em lei.
	</p>

	<h2 className={`mt-6 text-base font-bold tracking-tight ${title}`}>7. Seus direitos</h2>
	<p className={`mt-3 text-[14px] leading-relaxed ${body}`}>
		Nos termos da LGPD, você pode solicitar a confirmação da existência de tratamento,
		acesso, correção, anonimização, portabilidade ou exclusão dos seus dados pessoais.
	</p>
	<p className={`mt-3 text-[14px] leading-relaxed ${body}`}>
		Você também pode pedir informações sobre com quem compartilhamos esses dados.
	</p>

	<h2 className={`mt-6 text-base font-bold tracking-tight ${title}`}>8. Segurança</h2>
	<p className={`mt-3 text-[14px] leading-relaxed ${body}`}>
		Adotamos medidas técnicas e administrativas para proteger seus dados contra acessos não
		autorizados, perda, alteração ou divulgação indevida, incluindo criptografia de senhas
		e controle de acesso às informações.
	</p>

	<h2 className={`mt-6 text-base font-bold tracking-tight ${title}`}>
		9. Alterações nesta política
	</h2>
	<p className={`mt-3 text-[14px] leading-relaxed ${body}`}>
		Esta política pode ser atualizada periodicamente para refletir melhorias na plataforma
		ou mudanças na legislação. A data da última atualização está sempre indicada no topo
		desta página.
	</p>

	<h2 className={`mt-6 text-base font-bold tracking-tight ${title}`}>
		10. Contato do encarregado (DPO)
	</h2>
	<p className={`mt-3 text-[14px] leading-relaxed ${body}`}>
		Para exercer seus direitos ou tirar dúvidas sobre o tratamento de seus dados, entre em
		contato com nosso encarregado de proteção de dados pelo e-mail
		privacidade@gamesstore.com.br.
	</p>
</div>
			</div>
	);
}
