import { LANDING_BANNER_IMAGES } from "@/data/mockGames";

function rotateUrls(urls: string[], start: number): string[] {
	if (urls.length === 0) return [];
	const s = start % urls.length;
	return [...urls.slice(s), ...urls.slice(0, s)];
}

function BannerColumn({
	urls,
	direction,
	durationSec,
}: {
	urls: string[];
	direction: "up" | "down";
	durationSec: number;
}) {
	const animClass = direction === "up" ? "gs-landing-col-up" : "gs-landing-col-down";

	return (
		<div className="h-full min-h-[100vh] w-full min-w-0 flex-1 overflow-hidden">
			<div
				className={`flex flex-col gap-3 ${animClass}`}
				style={{ animationDuration: `${durationSec}s` }}
			>
				<div className="flex flex-col gap-3">
					{urls.map((src) => (
						<div
							key={`a-${src}`}
							className="aspect-[16/10] w-full shrink-0 overflow-hidden rounded-2xl bg-neutral-800/50"
						>
							<img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
						</div>
					))}
				</div>
				<div className="flex flex-col gap-3">
					{urls.map((src) => (
						<div
							key={`b-${src}`}
							className="aspect-[16/10] w-full shrink-0 overflow-hidden rounded-2xl bg-neutral-800/50"
						>
							<img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export function LandingBackgroundCarousel() {
	const base = LANDING_BANNER_IMAGES;
	const left = rotateUrls(base, 0);
	const mid = rotateUrls(base, Math.max(1, Math.floor(base.length / 3)));
	const right = rotateUrls(base, Math.max(2, Math.floor((2 * base.length) / 3)));

	return (
		<div
			className="pointer-events-none absolute inset-y-0 left-1/2 z-0 w-screen max-w-[100vw] -translate-x-1/2 overflow-hidden"
			aria-hidden
		>
			<div className="absolute -inset-[5%] blur-[6px]">
				<div className="flex h-full min-h-[120vh] items-stretch justify-center">
					<div
						className="flex h-full min-h-[120vh] w-full gap-2 sm:gap-3 md:gap-4"
						style={{ transform: "rotate(-5deg) scale(1.03)" }}
					>
						<BannerColumn urls={left} direction="up" durationSec={72} />
						<BannerColumn urls={mid} direction="down" durationSec={84} />
						<BannerColumn urls={right} direction="up" durationSec={78} />
					</div>
				</div>
			</div>
			<div className="absolute inset-0 bg-gradient-to-b from-gs-cream/92 via-gs-cream/58 to-gs-cream/93" />
		</div>
	);
}
