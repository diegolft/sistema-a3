export type AuthRole = "Administrador" | "Cliente" | string;

export type PaymentMethod = "cartao" | "boleto" | "pix";

export type Category = {
	id: number;
	nome: string;
};

export type Company = {
	id: number;
	nome: string;
};

export type Profile = {
	id: number;
	nome: string;
};

export type User = {
	id: number;
	nome: string;
	email: string;
	dataNascimento: string | null;
	fkPerfil: number;
};

export type AuthUser = User & {
	perfil: AuthRole;
};

export type GameBase = {
	nome: string;
	descricao: string;
	ano: number;
	preco: number;
	desconto: number;
	precoFinal: number;
	categoriaNome: string;
	empresaNome: string;
	imageUrl: string;
};

export type ExhibitionGame = GameBase;

export type GameSummary = GameBase & {
	id: number;
	fkEmpresa: number;
	fkCategoria: number;
};

export type GameDetail = GameSummary;

export type WishlistGame = GameSummary;

export type CartItem = {
	id: number;
	fkCarrinho: number;
	fkJogo: number;
	chaveAtivacao: string | null;
	jogo: GameSummary;
};

export type Cart = {
	id: number;
	fkUsuario: number;
	fkVenda: number | null;
	status: string;
	items: CartItem[];
	quantidade: number;
	total: number;
};

export type OwnedGame = {
	chaveAtivacao: string | null;
	jogo: GameSummary;
};

export type Sale = {
	id: number;
	fkUsuario: number;
	valorTotal: number;
	quantidade: number;
	data: string;
};

export type Review = {
	id: number;
	fkUsuario: number;
	fkJogo: number;
	nota: number;
	comentario: string;
	data: string;
};

export type ReviewAverage = {
	media: number;
	totalAvaliacoes: number;
	avaliacoes: Review[];
};

export type MostSoldGameReportItem = {
	nome: string;
	empresa: string;
	total: number;
};
