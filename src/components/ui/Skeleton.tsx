type Props = {
	className?: string;
};

/** Bloco com shimmer; use classes Tailwind para tamanho e `rounded-*`. */
export function Skeleton({ className = "" }: Props) {
	return <div className={`gs-skeleton ${className}`} aria-hidden />;
}
