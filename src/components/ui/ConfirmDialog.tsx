import { type ReactNode, useEffect, useId, useRef } from "react";

type Props = {
	open: boolean;
	title: string;
	description?: ReactNode;
	confirmLabel?: string;
	cancelLabel?: string;
	onConfirm: () => void;
	onCancel: () => void;
	/** Desabilita o botão de confirmação (ex.: durante submit) */
	confirmLoading?: boolean;
	confirmLoadingLabel?: string;
};

export function ConfirmDialog({
	open,
	title,
	description,
	confirmLabel = "Confirmar",
	cancelLabel = "Cancelar",
	onConfirm,
	onCancel,
	confirmLoading = false,
	confirmLoadingLabel = "Aguarde…",
}: Props) {
	const titleId = useId();
	const descId = useId();
	const confirmRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		if (!open) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") onCancel();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open, onCancel]);

	useEffect(() => {
		if (open) {
			confirmRef.current?.focus();
		}
	}, [open]);

	if (!open) return null;

	return (
		<div
			className="fixed inset-0 z-[100] flex items-center justify-center p-4"
			role="presentation"
		>
			<button
				type="button"
				className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
				aria-label="Fechar diálogo"
				onClick={onCancel}
			/>
			<div
				role="dialog"
				aria-modal="true"
				aria-labelledby={titleId}
				aria-describedby={description ? descId : undefined}
				className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-gs-surface p-6 shadow-[0_8px_40px_rgba(0,0,0,0.55)]"
			>
				<h2 id={titleId} className="text-lg font-bold tracking-tight text-neutral-100">
					{title}
				</h2>
				{description ? (
					<div id={descId} className="mt-3 text-[15px] leading-relaxed text-neutral-400">
						{description}
					</div>
				) : null}
				<div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
					<button
						type="button"
						onClick={onCancel}
						disabled={confirmLoading}
						className="rounded-full border border-white/15 bg-transparent px-5 py-3 text-[15px] font-semibold text-neutral-200 transition hover:bg-white/5 disabled:pointer-events-none disabled:opacity-50"
					>
						{cancelLabel}
					</button>
					<button
						ref={confirmRef}
						type="button"
						onClick={onConfirm}
						disabled={confirmLoading}
						aria-busy={confirmLoading}
						className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-gs-accent)] px-5 py-3 text-[15px] font-semibold text-white shadow-[0_4px_20px_rgba(255,122,0,0.35)] transition hover:bg-[var(--color-gs-accent-hover)] disabled:pointer-events-none disabled:opacity-60"
					>
						{confirmLoading ? (
							<>
								<span
									className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
									aria-hidden
								/>
								{confirmLoadingLabel}
							</>
						) : (
							confirmLabel
						)}
					</button>
				</div>
			</div>
		</div>
	);
}
