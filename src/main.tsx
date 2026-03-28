import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "@/app/App";
import "@/styles/global.css";

const rootEl = document.getElementById("root");
if (!rootEl) {
	throw new Error('Elemento "#root" não encontrado.');
}

createRoot(rootEl).render(
	<StrictMode>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</StrictMode>,
);
