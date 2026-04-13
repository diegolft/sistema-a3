function hashText(value: string): number {
	let hash = 0;
	for (const char of value) {
		hash = (hash << 5) - hash + char.charCodeAt(0);
		hash |= 0;
	}
	return Math.abs(hash);
}

function encodeSvg(value: string): string {
	return encodeURIComponent(value)
		.replace(/%20/g, " ")
		.replace(/%3D/g, "=")
		.replace(/%3A/g, ":")
		.replace(/%2F/g, "/");
}

function pickPalette(seed: number) {
	const palettes = [
		["#fb923c", "#7c2d12", "#1f2937"],
		["#22c55e", "#14532d", "#111827"],
		["#38bdf8", "#0c4a6e", "#0f172a"],
		["#e879f9", "#701a75", "#111827"],
		["#facc15", "#713f12", "#1f2937"],
		["#f87171", "#7f1d1d", "#111827"],
	];
	return palettes[seed % palettes.length];
}

export function buildGameImage(title: string, subtitle?: string): string {
	const seed = hashText(`${title}:${subtitle ?? ""}`);
	const [accent, mid, base] = pickPalette(seed);
	const safeTitle = title.slice(0, 28);
	const safeSubtitle = (subtitle ?? "Game Store").slice(0, 24);

	const svg = `
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" role="img" aria-label="${safeTitle}">
			<defs>
				<linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
					<stop offset="0%" stop-color="${base}" />
					<stop offset="55%" stop-color="${mid}" />
					<stop offset="100%" stop-color="${accent}" />
				</linearGradient>
			</defs>
			<rect width="1200" height="675" fill="url(#bg)" />
			<circle cx="1030" cy="110" r="190" fill="rgba(255,255,255,0.08)" />
			<circle cx="160" cy="570" r="230" fill="rgba(255,255,255,0.06)" />
			<path d="M0 510 C190 420 350 640 560 560 C760 485 915 300 1200 370 L1200 675 L0 675 Z" fill="rgba(15,23,42,0.38)" />
			<text x="72" y="104" fill="rgba(255,255,255,0.78)" font-family="Verdana,Segoe UI,sans-serif" font-size="28" font-weight="700" letter-spacing="6">GAME STORE</text>
			<text x="72" y="548" fill="#ffffff" font-family="Verdana,Segoe UI,sans-serif" font-size="72" font-weight="700">${safeTitle}</text>
			<text x="72" y="600" fill="rgba(255,255,255,0.82)" font-family="Verdana,Segoe UI,sans-serif" font-size="30">${safeSubtitle}</text>
		</svg>
	`;

	return `data:image/svg+xml;charset=UTF-8,${encodeSvg(svg)}`;
}
