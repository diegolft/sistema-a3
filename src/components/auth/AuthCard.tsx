import type { ReactNode } from "react";

/** Conteúdo do formulário sem caixa pesada, alinhado ao mock “flutuante”. */
export function AuthCard({ children }: { children: ReactNode }) {
	return <div className="mx-auto w-full max-w-[400px]">{children}</div>;
}
