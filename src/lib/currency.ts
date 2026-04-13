export function applyDiscount(preco: number, desconto: number): number {
	const nextValue = preco - preco * (desconto / 100);
	return Number(Math.max(nextValue, 0).toFixed(2));
}

export function formatBRL(value: number): string {
	return new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	}).format(value);
}
