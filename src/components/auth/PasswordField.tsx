import { Eye, EyeOff } from "lucide-react";
import { type InputHTMLAttributes, type ReactNode, useState } from "react";

type Props = {
	label: string;
	id: string;
	error?: string;
	belowInput?: ReactNode;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export function PasswordField({ label, id, error, belowInput, className = "", ...props }: Props) {
	const [show, setShow] = useState(false);
	const labelClass = "block text-[13px] font-bold text-neutral-100";
	return (
		<div className="space-y-1">
			<label htmlFor={id} className={labelClass}>
				{label}
			</label>
			<div className="relative">
				<input
					id={id}
					type={show ? "text" : "password"}
					className={[
						"w-full rounded-xl border border-neutral-600 bg-gs-raised py-2.5 pl-3.5 pr-12 text-[15px] text-neutral-100",
						"placeholder:text-neutral-500",
						"outline-none transition-shadow duration-200",
						"focus:border-[var(--color-gs-accent)]/40 focus:ring-2 focus:ring-[var(--color-gs-accent)]/20",
						error ? "ring-2 ring-red-400/30" : "",
						className,
					].join(" ")}
					{...props}
				/>
				<button
					type="button"
					tabIndex={-1}
					onClick={() => setShow((s) => !s)}
					className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-neutral-500 transition hover:bg-white/10 hover:text-neutral-300"
					aria-label={show ? "Ocultar senha" : "Mostrar senha"}
				>
					{show ? (
						<EyeOff className="h-5 w-5" strokeWidth={1.75} />
					) : (
						<Eye className="h-5 w-5" strokeWidth={1.75} />
					)}
				</button>
			</div>
			{belowInput ? <div className="flex justify-end pt-0.5">{belowInput}</div> : null}
			{error ? <p className="text-[13px] text-red-400">{error}</p> : null}
		</div>
	);
}
