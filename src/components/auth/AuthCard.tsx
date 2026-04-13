import type { ReactNode } from "react";

/** Container leve para os formularios de autenticacao. */
export function AuthCard({ children }: { children: ReactNode }) {
	return <div className="mx-auto w-full max-w-[400px]">{children}</div>;
}
