export type Game = {
	id: string;
	title: string;
	category: string;
	rating: number;
	/** Preço em reais (número decimal). */
	price: number;
	image: string;
	description: string;
};

export const GAME_CATEGORIES = ["Todos", "Ação", "Aventura", "RPG", "Esportes", "Indie"] as const;

export type GameCategory = (typeof GAME_CATEGORIES)[number];

export const MOCK_GAMES: Game[] = [
	{
		id: "1",
		title: "Horizon: Dawn Rising",
		category: "Ação",
		rating: 9.2,
		price: 199.9,
		image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=640&h=400&fit=crop&q=80",
		description:
			"Explore um mundo aberto vasto onde máquinas colossais e natureza selvagem definem cada amanhecer. Uma jornada épica de sobrevivência e descoberta.",
	},
	{
		id: "2",
		title: "Stellar Odyssey",
		category: "Aventura",
		rating: 8.7,
		price: 249.9,
		image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=640&h=400&fit=crop&q=80",
		description:
			"Viaje entre constelações, desvende ruínas alienígenas e forje alianças em uma odisséia espacial cinematográfica.",
	},
	{
		id: "3",
		title: "Shadow Realms",
		category: "RPG",
		rating: 9.5,
		price: 179.9,
		image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=640&h=400&fit=crop&q=80",
		description:
			"Mergulhe em reinos sombrios, personalize seu herói e enfrente escolhas que moldam o destino do mundo.",
	},
	{
		id: "4",
		title: "Velocity Grand Prix",
		category: "Esportes",
		rating: 8.1,
		price: 149.9,
		image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=640&h=400&fit=crop&q=80",
		description:
			"Corridas de alta velocidade, física realista e pistas icônicas. Domine cada curva e suba no pódio.",
	},
	{
		id: "5",
		title: "Pixel Dreams",
		category: "Indie",
		rating: 9.0,
		price: 49.9,
		image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=640&h=400&fit=crop&q=80",
		description:
			"Uma aventura retrô com estética neon e narrativa tocante. Perfeito para quem ama pixels e nostalgia.",
	},
	{
		id: "6",
		title: "Neon District",
		category: "Ação",
		rating: 8.4,
		price: 89.9,
		image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=640&h=400&fit=crop&q=80",
		description:
			"Infiltre-se na cidade do futuro, combate corporativo e decisões morais em um thriller cyberpunk.",
	},
	{
		id: "7",
		title: "Crystal Chronicles",
		category: "RPG",
		rating: 8.9,
		price: 219.9,
		image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=640&h=400&fit=crop&q=80",
		description:
			"Magia, reinos flutuantes e um elenco memorável. Coop online para até quatro jogadores.",
	},
	{
		id: "8",
		title: "Forest Whispers",
		category: "Aventura",
		rating: 8.3,
		price: 69.9,
		image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=640&h=400&fit=crop&q=80",
		description:
			"Explore florestas místicas, resolva enigmas naturais e descubra segredos ancestrais.",
	},
];

/** URLs para banners decorativos no fundo da landing (catálogo + imagens extras). */
const EXTRA_LANDING_BANNERS = [
	"https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=480&h=300&fit=crop&q=80",
	"https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=480&h=300&fit=crop&q=80",
	"https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=480&h=300&fit=crop&q=80",
	"https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=480&h=300&fit=crop&q=80",
	"https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=480&h=300&fit=crop&q=80",
	"https://images.unsplash.com/photo-1625805866449-3589fe3f71a3?w=480&h=300&fit=crop&q=80",
] as const;

export const LANDING_BANNER_IMAGES: string[] = [
	...new Set([...MOCK_GAMES.map((g) => g.image), ...EXTRA_LANDING_BANNERS]),
];

export function getGameById(id: string): Game | undefined {
	return MOCK_GAMES.find((g) => g.id === id);
}

export function formatBRL(value: number): string {
	return new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	}).format(value);
}
