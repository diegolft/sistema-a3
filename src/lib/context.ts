/** Garante contexto React não nulo (mensagem igual à que cada hook já usava). */
export function requireContext<T>(value: T | null, message: string): T {
	if (!value) throw new Error(message);
	return value;
}
