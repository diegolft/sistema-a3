import { buildGameImage } from "@/lib/gameMedia";
import { applyDiscount } from "@/lib/currency";
import type {
	AuthUser,
	Cart,
	CartItem,
	Category,
	Company,
	ExhibitionGame,
	GameSummary,
	OwnedGame,
	Profile,
	Review,
	ReviewAverage,
	Sale,
	User,
} from "@/types/domain";

export type ApiCategory = {
	id: number;
	nome: string;
};

export type ApiCompany = {
	id: number;
	nome: string;
};

export type ApiProfile = {
	id: number;
	nome: string;
};

export type ApiUser = {
	id: number;
	nome: string;
	email: string;
	dataNascimento: string | null;
	fkPerfil: number;
};

export type ApiGame = {
	id: number;
	nome: string;
	ano: number;
	preco: number;
	desconto: number | null;
	descricao: string | null;
	fkEmpresa: number;
	fkCategoria: number;
};

export type ApiExhibitionGame = {
	nome: string;
	descricao: string | null;
	ano: number;
	preco: number;
	desconto: number | null;
	categoria: string;
	empresa_nome: string;
};

export type ApiCartItem = {
	id: number;
	fkJogo: number;
	fkCarrinho: number;
	chaveAtivacao: string | null;
};

export type ApiCartShape = {
	id: number;
	fkUsuario: number;
	fkVenda: number | null;
	status: string;
	itens: ApiCartItem[];
};

export type ApiReview = {
	id: number;
	fkUsuario: number;
	fkJogo: number;
	nota: number;
	comentario: string | null;
	data: string;
};

export type ApiReviewAverage = {
	media: number;
	totalAvaliacoes: number;
	avaliacoes: ApiReview[];
};

export type ApiOwnedGame = {
	chaveAtivacao: string | null;
	jogo: ApiGame;
};

export type ApiSale = {
	id: number;
	fkUsuario: number;
	valorTotal: number;
	quantidade: number;
	data: string;
};

export type LookupMaps = {
	categoriesById?: Map<number, string>;
	companiesById?: Map<number, string>;
};

function safeDiscount(value: number | null | undefined): number {
	return Number(value ?? 0);
}

function safeDescription(value: string | null | undefined): string {
	return value?.trim() || "Sem descricao cadastrada.";
}

function safeCategoryName(game: ApiGame, maps?: LookupMaps): string {
	return maps?.categoriesById?.get(game.fkCategoria) ?? `Categoria #${game.fkCategoria}`;
}

function safeCompanyName(game: ApiGame, maps?: LookupMaps): string {
	return maps?.companiesById?.get(game.fkEmpresa) ?? `Empresa #${game.fkEmpresa}`;
}

export function toCategory(category: ApiCategory): Category {
	return {
		id: category.id,
		nome: category.nome,
	};
}

export function toCompany(company: ApiCompany): Company {
	return {
		id: company.id,
		nome: company.nome,
	};
}

export function toProfile(profile: ApiProfile): Profile {
	return {
		id: profile.id,
		nome: profile.nome,
	};
}

export function toUser(user: ApiUser): User {
	return {
		id: user.id,
		nome: user.nome,
		email: user.email,
		dataNascimento: user.dataNascimento,
		fkPerfil: user.fkPerfil,
	};
}

export function toAuthUser(user: ApiUser, perfil: string): AuthUser {
	return {
		...toUser(user),
		perfil,
	};
}

export function toExhibitionGame(game: ApiExhibitionGame): ExhibitionGame {
	const desconto = safeDiscount(game.desconto);
	return {
		nome: game.nome,
		descricao: safeDescription(game.descricao),
		ano: game.ano,
		preco: Number(game.preco),
		desconto,
		precoFinal: applyDiscount(Number(game.preco), desconto),
		categoriaNome: game.categoria,
		empresaNome: game.empresa_nome,
		imageUrl: buildGameImage(game.nome, game.categoria),
	};
}

export function toGameSummary(game: ApiGame, maps?: LookupMaps): GameSummary {
	const desconto = safeDiscount(game.desconto);
	const categoriaNome = safeCategoryName(game, maps);
	const empresaNome = safeCompanyName(game, maps);
	return {
		id: game.id,
		nome: game.nome,
		descricao: safeDescription(game.descricao),
		ano: game.ano,
		preco: Number(game.preco),
		desconto,
		precoFinal: applyDiscount(Number(game.preco), desconto),
		fkEmpresa: game.fkEmpresa,
		fkCategoria: game.fkCategoria,
		categoriaNome,
		empresaNome,
		imageUrl: buildGameImage(game.nome, categoriaNome),
	};
}

export function toReview(review: ApiReview): Review {
	return {
		id: review.id,
		fkUsuario: review.fkUsuario,
		fkJogo: review.fkJogo,
		nota: review.nota,
		comentario: review.comentario?.trim() || "",
		data: review.data,
	};
}

export function toReviewAverage(reviewAverage: ApiReviewAverage): ReviewAverage {
	return {
		media: Number(reviewAverage.media),
		totalAvaliacoes: reviewAverage.totalAvaliacoes,
		avaliacoes: reviewAverage.avaliacoes.map(toReview),
	};
}

export function toSale(sale: ApiSale): Sale {
	return {
		id: sale.id,
		fkUsuario: sale.fkUsuario,
		valorTotal: Number(sale.valorTotal),
		quantidade: sale.quantidade,
		data: sale.data,
	};
}

export function toOwnedGame(owned: ApiOwnedGame, maps?: LookupMaps): OwnedGame {
	return {
		chaveAtivacao: owned.chaveAtivacao,
		jogo: toGameSummary(owned.jogo, maps),
	};
}

export function toCartItem(item: ApiCartItem, game: GameSummary): CartItem {
	return {
		id: item.id,
		fkCarrinho: item.fkCarrinho,
		fkJogo: item.fkJogo,
		chaveAtivacao: item.chaveAtivacao,
		jogo: game,
	};
}

export function toCart(cart: ApiCartShape, games: GameSummary[]): Cart {
	const gamesById = new Map(games.map((game) => [game.id, game]));
	const items = cart.itens.flatMap((item) => {
		const game = gamesById.get(item.fkJogo);
		return game ? [toCartItem(item, game)] : [];
	});

	return {
		id: cart.id,
		fkUsuario: cart.fkUsuario,
		fkVenda: cart.fkVenda,
		status: cart.status,
		items,
		quantidade: items.length,
		total: items.reduce((sum, item) => sum + item.jogo.precoFinal, 0),
	};
}
