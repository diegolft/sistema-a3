import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = {
	loading?: boolean;
	children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function AuthButton({ loading, children, className = "", disabled, ...props }: Props) {
	return (
		<button
			type="submit"
			disabled={disabled || loading}
			className={[
				"w-full rounded-xl bg-[var(--color-gs-accent)] py-3 text-[15px] font-semibold text-white",
				"shadow-[0_6px_24px_rgba(255,140,51,0.35)] transition",
				"hover:bg-[var(--color-gs-accent-hover)] active:scale-[0.99]",
				"disabled:pointer-events-none disabled:opacity-50",
				className,
			].join(" ")}
			{...props}
		>
			{loading ? (
				<span className="inline-flex items-center justify-center gap-2">
					<span
						className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
						aria-hidden
					/>
					Aguarde…
				</span>
			) : (
				children
			)}
		</button>
	);
}
