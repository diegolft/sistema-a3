import type { ReactNode } from "react";

type Props = {
	title: string;
	description?: string;
	children: ReactNode;
};

export function AdminSection({ title, description, children }: Props) {
	return (
		<section className="rounded-2xl border border-white/10 bg-gs-surface p-5 shadow-[0_3px_18px_rgba(0,0,0,0.25)]">
			<div className="mb-4">
				<h2 className="text-lg font-bold text-neutral-100">{title}</h2>
				{description ? <p className="mt-1 text-[13px] text-neutral-400">{description}</p> : null}
			</div>
			{children}
		</section>
	);
}
