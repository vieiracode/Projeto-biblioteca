// projeto biblioteca com tratamento de erros personalizado em TypeScript ok 


class LivroNaoEncontrado extends Error {
    constructor(titulo: string) {
        super(`ERRO: Livro '${titulo}' não encontrado no catálogo.`);
        this.name = "LivroNaoEncontrado";
    }
}

class LivroIndisponivel extends Error {
    constructor(titulo: string) {
        super(`ERRO: Livro '${titulo}' já está emprestado.`);
        this.name = "LivroIndisponivel";
    }
}

class LivroJaDisponivel extends Error {
    constructor(titulo: string) {
        super(`ERRO: Livro '${titulo}' já está disponível para devolução.`);
        this.name = "LivroJaDisponivel";
    }
}


class Livro {
    public titulo: string;
    public autor: string;
    private disponivel: boolean;

    constructor(titulo: string, autor: string) {
        this.titulo = titulo;
        this.autor = autor;
        this.disponivel = true; 
    }

    public isDisponivel(): boolean {
        return this.disponivel;
    }

    public setDisponivel(status: boolean): void {
        this.disponivel = status;
    }

    public toString(): string {
        const status = this.disponivel ? "Disponível" : "Emprestado";
        return `-> '${this.titulo}' por ${this.autor} (${status})`;
    }
}

class Biblioteca {
    
    private catalogo: Map<string, Livro>;

    constructor() {
        this.catalogo = new Map();
    }

    public adicionarLivro(livro: Livro): void {
        this.catalogo.set(livro.titulo, livro);
        console.log(`Livro '${livro.titulo}' adicionado.`);
    }

    public async emprestarLivro(titulo: string): Promise<string> {
        const livro = this.catalogo.get(titulo);

        
        if (!livro) {
            throw new LivroNaoEncontrado(titulo);
        }

        
        if (!livro.isDisponivel()) {
            throw new LivroIndisponivel(titulo);
        }

        
        await new Promise(resolve => setTimeout(resolve, 100));

        
        livro.setDisponivel(false);
        return `SUCESSO: Livro '${titulo}' emprestado.`;
    }

    public async devolverLivro(titulo: string): Promise<string> {
        const livro = this.catalogo.get(titulo);

        
        if (!livro) {
            throw new LivroNaoEncontrado(titulo);
        }

        
        if (livro.isDisponivel()) {
            throw new LivroJaDisponivel(titulo);
        }

        
        await new Promise(resolve => setTimeout(resolve, 100));

        
        livro.setDisponivel(true);
        return `SUCESSO: Livro '${titulo}' devolvido.`;
    }

    public listarLivros(): void {
        console.log("\n--- Catálogo Atual ---");
        if (this.catalogo.size === 0) {
            console.log("O catálogo está vazio.");
            return;
        }
        this.catalogo.forEach(livro => console.log(livro.toString()));
        console.log("----------------------");
    }
}




async function main(): Promise<void> {
    const biblioteca = new Biblioteca();

    
    biblioteca.adicionarLivro(new Livro("Clean Code", "Robert C. Martin"));
    biblioteca.adicionarLivro(new Livro("The Pragmatic Programmer", "Andrew Hunt"));
    
    const livroSucesso = "Clean Code";
    const livroAusente = "O Conto do Hacker";

    biblioteca.listarLivros();

    console.log("\n[INÍCIO DA SIMULAÇÃO]");

    
    console.log(`\n[Ação 1] Tentando emprestar '${livroSucesso}'...`);
    try {
        const resultado = await biblioteca.emprestarLivro(livroSucesso);
        console.log(resultado);
    } catch (e) {
        if (e instanceof Error) {
            console.error(`FALHA na Ação 1: ${e.message}`);
        }
    }

    
    console.log(`\n[Ação 2] Tentando emprestar '${livroSucesso}' NOVAMENTE...`);
    try {
        const resultado = await biblioteca.emprestarLivro(livroSucesso);
        console.log(resultado);
    } catch (e) {
        if (e instanceof LivroIndisponivel) {
            console.error(`CAPTURA ESPECÍFICA: ${e.message}`);
        } else if (e instanceof Error) {
            console.error(`FALHA na Ação 2: ${e.message}`);
        }
    }

    
    console.log(`\n[Ação 3] Tentando emprestar '${livroAusente}'...`);
    try {
        const resultado = await biblioteca.emprestarLivro(livroAusente);
        console.log(resultado);
    } catch (e) {
        if (e instanceof LivroNaoEncontrado) {
            console.error(`CAPTURA ESPECÍFICA: ${e.message}`);
        } else if (e instanceof Error) {
            console.error(`FALHA na Ação 3: ${e.message}`);
        }
    }
    
    
    console.log(`\n[Ação 4] Tentando devolver '${livroSucesso}'...`);
    try {
        const resultado = await biblioteca.devolverLivro(livroSucesso);
        console.log(resultado);
    } catch (e) {
        if (e instanceof Error) {
            console.error(`FALHA na Ação 4: ${e.message}`);
        }
    }

    
    console.log(`\n[Ação 5] Tentando devolver '${livroSucesso}' NOVAMENTE...`);
    try {
        const resultado = await biblioteca.devolverLivro(livroSucesso);
        console.log(resultado);
    } catch (e) {
        if (e instanceof LivroJaDisponivel) {
            console.error(`CAPTURA ESPECÍFICA: ${e.message}`);
        } else if (e instanceof Error) {
            console.error(`FALHA na Ação 5: ${e.message}`);
        }
    }

    biblioteca.listarLivros();
    console.log("\n[FIM DA SIMULAÇÃO]");
}


main();