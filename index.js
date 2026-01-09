import inquirer from "inquirer";

// Banco de dados em memoria
let inventario = []


async function menuPrincipal(){
    const resposta = await inquirer.prompt([
        {
            type: 'rawlist',
            name: 'opcao',
            message: 'O que você deseja fazer?',
            choices: [
                'Adicionar Produto',
                'Listar Produtos',
                'Atualizar Produto',
                'Excluir Produto',
                'Buscar Produto',
                'Sair'
            ]
        }
    ]);

    switch (resposta.opcao){
        case 'Adicionar Produto':
            await adicionarProduto();
            menuPrincipal();
            break;
        case 'Listar Produtos':
            listarProdutos();
            menuPrincipal();
            break;
        case 'Atualizar Produto':
            await atualizarProduto();
            menuPrincipal();
            break;
        case 'Excluir Produto':
            await excluirProduto();
            menuPrincipal();
            break;
        case 'Buscar Produto':
            await buscarProduto();
            menuPrincipal();
            break;
        case 'Sair':
            console.log("Saindo do sistema...")
            process.exit()
            break;
            default:
                menuPrincipal();
    }
}

async function adicionarProduto() {
    console.log('\n--- Adicionar Novo Porduto ---');


    // Perguntas feitas para o usuario
    const dadosProduto = await inquirer.prompt([

        // Primeira inserção
        {
            type: 'input',
            name: 'nome',
            message: 'Nome do Produto:'
        },
        // Segunda inserção
        {
            type: 'input',
            name: 'categoria',
            message: 'Categoria:'
        },
        // Terceira inserção
        {
            type: 'number',
            name: 'quantidade',
            message: 'Quantidade em Estoque:'
        },
        // Quarta inserção
        {
            type: 'number',
            name: 'preco',
            message: 'Preço:'
        },
    ]);

    // A logica para gerar um id unico de acordo com o produto.
    const idUnico = Date.now();
    const novoItem = {
        id: idUnico, 
        ...dadosProduto
    };
    
    // Empurramos o novo item dentro do array.
    inventario.push(novoItem);

    console.log("Dados capturados:", dadosProduto);
}

function listarProdutos(){
    console.log('\n--- Lista de Produtos ---');

    if (inventario.length === 0){
            console.log("Nenhum produto cadastrado ainda.")
    } else {
        console.table(inventario);
    }
}


async function atualizarProduto(){
    if ( inventario.length === 0) {
        console.log("---------------------------------")
        console.log("O Inventario está vázio! Não há o que atualizar")
        console.log("---------------------------------")
        return;
    }

    const produtoEscolhido = await inquirer.prompt([
        {
            type: 'rawlist',
            name: 'id',
            message: 'Qual produto deseja atualizar?',
            choices: inventario.map(p => ({
                name: `${p.nome} (Categoria atual: ${p.categoria}, Quantidade no estoque: ${p.quantidade}, Preço atual: ${p.preco})`,
                value: p.id
            }))
        }
    ]);

    const produtoAtual = inventario.find(p => p.id === produtoEscolhido.id);

    const novosDados = await inquirer.prompt([{

        // Primeira inserção
            type: 'input',
            name: 'nome',
            message: `Novo nome (Atual: ${produtoAtual.nome}):`,
            default: produtoAtual.nome
        },

        // Segunda inserção
        {
            type: 'input',
            name: 'categoria',
            message: `Nova categoria (Atual: ${produtoAtual.categoria}):`,
            default: produtoAtual.categoria
        },

        // Terceira inserção
        {
            type: 'number',
            name: 'quantidade',
            message: `Nova quantidade (Atual: ${produtoAtual.quantidade}):`,
            default: produtoAtual.quantidade,
            filter: Number // Garante que mostre como numero
        },

        // Quarta inserção
        {
            type: 'number',
            name: 'preco',
            message: `Novo preço (Atual: ${produtoAtual.preco}):`,
            default: produtoAtual.preco,
            filter: Number // Garante que mostre como numero

        },

    ]);

    produtoAtual.nome = novosDados.nome;
    produtoAtual.categoria = novosDados.categoria;
    produtoAtual.quantidade = novosDados.quantidade;
    produtoAtual.preco = novosDados.preco;


    console.log("---------------------------------");
    console.log("✅ Produto atualizado com sucesso!");
    console.log("---------------------------------");

}

async function excluirProduto() {
    if (inventario.length === 0){
    console.log("---------------------------------");
    console.log("⚠ O inventário está vazio!");
    console.log("---------------------------------");
    return;
    }

    const produtoEscolhido = await inquirer.prompt([
        {
            type: 'rawlist',
            name: 'id',
            message: 'Qual produto você deseja EXCLUIR',
            choices: inventario.map(p => ({
                name: `${p.nome} (Categoria: ${p.categoria}, Quantidade: ${p.quantidade}, Preço ${p.preco})`,
                value: p.id
            }))
        }
    ]);

    const produtoParaRemover = inventario.find(p => p.id === produtoEscolhido.id);

    const confirmacao = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'certeza',
            message: `Tem certeza que deseja excluir "${produtoParaRemover.nome}" permanentemente?`,
            default: false
        }
    ]);

    if (confirmacao.certeza){
        // localiza a posição do item no array (findIndex)
        const index = inventario.findIndex(p => p.id === produtoEscolhido.id);
        // remove item do array (posição, quantidade)
        inventario.splice(index, 1);

        console.log("---------------------------------");
        console.log("🗑 Produto removido com sucesso!");
        console.log("---------------------------------");
    } else {
        console.log("---------------------------------");
        console.log("✖ Operação cancelada.");
        console.log("---------------------------------");
    }
}

async function buscarProduto(){
    if (inventario.length === 0){
    console.log("---------------------------------");
    console.log("⚠ Nenhum produto cadastrado!");
    console.log("---------------------------------");
    return;
    }

    const busca = await inquirer.prompt([
        {
            type: 'input',
            name: 'termo',
            message: 'Digite o nome (ou parte dele) para buscar'
        }
    ]);

    const resultados = inventario.filter(p => p.nome.toLowerCase().includes(busca.termo.toLowerCase()));

    if (resultados.length > 0) {
        console.log(`\n--- Produtos encontrados: ${resultados.length} ---\n`)
        console.table(resultados);
    } else {
        console.log("---------------------------------");
        console.log("🔍 Nenhum produto encontrado com esse nome.");
        console.log("---------------------------------");
    }
}


// Inicia o programa
menuPrincipal();