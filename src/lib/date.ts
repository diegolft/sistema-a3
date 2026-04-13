export function toInputDate(value: string | null | undefined): string {
	if (!value) return "";

	if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
		const [day, month, year] = value.split("/");
		return `${year}-${month}-${day}`;
	}

	const parsed = new Date(value);
	if (Number.isNaN(parsed.getTime())) return "";

	const year = parsed.getUTCFullYear();
	const month = String(parsed.getUTCMonth() + 1).padStart(2, "0");
	const day = String(parsed.getUTCDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

export function formatDisplayDate(value: string | null | undefined): string {
	if (!value) return "Nao informado";
	const parsed = new Date(value);
	if (Number.isNaN(parsed.getTime())) return value;
	return new Intl.DateTimeFormat("pt-BR", {
		dateStyle: "medium",
	}).format(parsed);
}

export function formatDisplayDateTime(value: string | null | undefined): string {
	if (!value) return "Nao informado";
	const parsed = new Date(value);
	if (Number.isNaN(parsed.getTime())) return value;
	return new Intl.DateTimeFormat("pt-BR", {
		dateStyle: "medium",
		timeStyle: "short",
	}).format(parsed);
}
