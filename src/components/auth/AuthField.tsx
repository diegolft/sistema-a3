import type { InputHTMLAttributes, ReactNode } from "react";

type Props = {
	label: string;
	id: string;
	error?: string;
	/** Conteúdo abaixo do campo (ex.: link “Esqueci minha senha”). */
	belowInput?: ReactNode;
} & InputHTMLAttributes<HTMLInputElement>;

export function AuthField({ label, id, error, belowInput, className = "", ...props }: Props) {
	const labelClass = "block text-[13px] font-bold text-neutral-100";
	return (
		<div className="space-y-1">
			<label htmlFor={id} className={labelClass}>
				{label}
			</label>
			<input
				id={id}
				className={[
					"w-full rounded-xl border border-neutral-600 bg-gs-raised px-3.5 py-2.5 text-[15px] text-neutral-100",
					"placeholder:text-neutral-500",
					"outline-none transition-shadow duration-200",
					"focus:border-[var(--color-gs-accent)]/40 focus:ring-2 focus:ring-[var(--color-gs-accent)]/20",
					error ? "ring-2 ring-red-400/30" : "",
					className,
				].join(" ")}
				{...props}
			/>
			{belowInput ? <div className="flex justify-end pt-0.5">{belowInput}</div> : null}
			{error ? <p className="text-[13px] text-red-400">{error}</p> : null}
		</div>
	);
}
