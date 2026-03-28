import { ApiError } from "@/services/api/errors";

/** Mensagem amigável para catch de formulários (ApiError, Error ou fallback). */
export function getFormErrorMessage(err: unknown, fallback: string): string {
	return err instanceof ApiError
		? err.message
		: err instanceof Error
			? err.message
			: fallback;
}
