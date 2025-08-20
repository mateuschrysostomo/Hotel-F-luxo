const prompt = require('prompt-sync')();
const Sistema = require('./Sistema.js');
const meuHotel = new Sistema();
const Funcionario = require('./Funcionario.js');
const Quartos = require('./Quartos.js');

//Convencionalmente o cadastro do funcionário é feito pelo sistema, logo siga o código

meuHotel.funcionarios.push(new Funcionario(meuHotel.proximoIdFuncionario++, 'admin', '000.000.000-00', 'admin@hotel.com', '123'));
meuHotel.quartos.push(new Quartos(2, 150, 5, 'Padrão', 'Quarto com duas camas de solteiro e vista para a cidade.'));
meuHotel.quartos.push(new Quartos(1, 250, 3, 'Luxo', 'Quarto com uma cama de casal, banheira e varanda.'));
meuHotel.quartos.push(new Quartos(4, 350, 2, 'Familia', 'Dois quartos conjugados, ideal para famílias.'));
meuHotel.funcionarios.push(new Funcionario(meuHotel.proximoIdFuncionario++, 'gerente', '000.000.000-00', 'gerente@hotel.com', 'gerente123'));

// MENU 1: Para quando ninguém está logado
function menuPrincipal() {
    console.log("\n--- BEM-VINDO AO HOTEL F-LUXO ---");
    console.log("1. Fazer Login");
    console.log("2. Fazer Cadastro de Cliente");
    console.log("3. Sair do Programa");

    const opcao = prompt(">> Escolha uma opção: ");
    switch (opcao) {
        case '1':
            console.log("\n--- Login ---");
            const email = prompt("Email: ");
            const senha = prompt("Senha: ");
            const resultadoLogin = meuHotel.login(email, senha);
            if (!resultadoLogin) {
                console.log("Falha no login. Email ou senha incorretos.");
            }
            break;
        case '2':
            console.log("\n--- Cadastro de Novo Cliente ---");
            const nome = prompt("Nome completo: ");
            const dataNasc = prompt("Data de Nascimento (dd/mm/aaaa): ");
            const cpf = prompt("CPF: ");
            const emailCadastro = prompt("Email: ");
            const senhaCadastro = prompt("Senha: ");
            meuHotel.cadastroCliente(nome, dataNasc, cpf, emailCadastro, senhaCadastro);
            break;
        case '3':
            console.log("Obrigado por utilizar nosso sistema. Até logo!");
            process.exit(0);
        default:
            console.log("Opção inválida. Tente novamente.");
            break;
    }
}

// MENU 2: Para quando um CLIENTE está logado
function menuCliente() {
    console.log(`\n--- MENU DO CLIENTE: ${meuHotel.usuarioLogado.nome} ---`);
    console.log("1. Ver meus Dados");
    console.log("2. Ver Lista de Quartos");
    console.log("3. Fazer reserva");
    console.log("4. Cancelar reserva");
    console.log("5. Ver minhas reservas");
    console.log("6. Avaliar Estadia");
    console.log("7. Logout")

    const opcao = prompt(">> Escolha uma opção: ");
    switch (opcao) {
        case '1':
            console.log(meuHotel.verMeusDados());
            break;
        case '2':
            console.log("\n--- Quartos Disponíveis ---");
            console.table(meuHotel.verListaDeQuartos());
            break;
        case '3':
            const nomeQuarto = prompt("Digite o nome do quarto desejado (ex: Luxo): ");
            const dataEntrada = prompt("Data de Check-in (dd/mm/aaaa): ");
            const dataSaida = prompt("Data de Check-out (dd/mm/aaaa): ");
            meuHotel.fazerReserva(nomeQuarto, dataEntrada, dataSaida);
            break;
        case '4':
            const idReservaCancelar = parseInt(prompt("Digite o ID da reserva que deseja cancelar: "));
            meuHotel.cancelarReserva(idReservaCancelar);
            break;
        case '5':
            console.log("\n--- Minhas Reservas ---");
            console.table(meuHotel.verMinhasReservas());
            break;
        case '7':
            meuHotel.logout();
            break;
        case '6':
            const idReserva = prompt("Digite o ID da sua Reserva: ");
            const nota = prompt("Qual a nota para sua estadia: ");
            const comentario = prompt("Faça um comentário sobre sua estadia: ");
            meuHotel.avaliarEstadia(idReserva, nota, comentario);
        default:
            console.log("Opção inválida.");
            break;
    }
}

// MENU 3: Para quando um FUNCIONÁRIO está logado
function menuFuncionario() {
    console.log(`\n--- PAINEL DO FUNCIONÁRIO: ${meuHotel.usuarioLogado.nomeUsuario} ---`);
    console.log("1. Ver Meus Dados");
    console.log("2. Ver Lista de Todas as Reservas");
    console.log("3. Ver Lista de Todos os Quartos");
    console.log("4. Ver Lista de Clientes");
    console.log("5. Mudar status da reserva");
    console.log("6. Adicionar Quarto");
    console.log("7. Logout");

    const opcao = prompt(">> Escolha uma opção: ");

    switch (opcao) {
        case '1':
            console.log(meuHotel.verMeusDados());
            break;
        case '2':
            console.log("\n--- Todas as Reservas no Sistema ---");
            console.table(meuHotel.verListaDeReservas());
            break;
        case '3':
            console.log("\n--- Todos os Quartos no Sistema ---");
            console.table(meuHotel.verListaDeQuartos());
            break;
        case '4':
            console.log("\n--- Todos os Clientes Cadastrados ---");
            console.table(meuHotel.verListaDeClientes());
            break;
        case '5':
            const idReserva = parseInt(prompt("Digite o ID da reserva para alterar o status: "));
            const novoStatus = prompt("Digite o novo status (pendente, adiada, realizada, cancelada): ");
            meuHotel.statusReserva(idReserva, novoStatus);
            break;
        case '6':
            console.log("\n--- Adicionar Novo Quarto ---");
            const nome = prompt("Nome do tipo de quarto: ");
            const qtdCamas = parseInt(prompt("Quantidade de camas: "));
            const precoPorNoite = parseFloat(prompt("Preço por noite: "));
            const qtdDisponivel = parseInt(prompt("Quantidade de quartos disponíveis: "));
            const descricao = prompt("Descrição: ");
            meuHotel.addQuarto(qtdCamas, precoPorNoite, qtdDisponivel, nome, descricao);
            break;
        case '7':
            meuHotel.logout();
            break;
        default:
            console.log("Opção inválida.");
            break;
    }
}

function main() {
    while (true) {
        if (!meuHotel.usuarioLogado) {
            menuPrincipal();
        } else {
            if (meuHotel.usuarioLogado.nomeUsuario) {
                menuFuncionario();
            } else {
                menuCliente();
            }
        }
    }
}

main();