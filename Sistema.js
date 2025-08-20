const Cliente = require('./Cliente.js');
const Funcionario = require('./Funcionario.js');
const Quartos = require('./Quartos.js');
const Reserva = require('./Reserva.js');
const Avaliacao = require('./Avaliacao.js');

class Sistema {
    constructor() {
        this.clientes = [];
        this.funcionarios = [];
        this.quartos = [];
        this.reservas = [];
        this.avaliacoes = [];
        this.usuarioLogado = null;
        this.proximoIdCliente = 1;
        this.proximoIdFuncionario = 1;
        this.proximoIdReserva = 1;
        this.proximoIdAvaliacao = 1;
    }
    // Processos

    cadastroCliente(nome, dataNascimento, cpf, email, senha) {
        const clienteExistente = this.clientes.find(c => c.cpf === cpf || c.email === email);
        if (clienteExistente) {
            console.log("Erro: CPF ou E-mail já cadastrado.");
            return null;
        }
        const novoCliente = new Cliente(this.proximoIdCliente, nome, dataNascimento, cpf, email, senha);

        this.clientes.push(novoCliente);

        this.proximoIdCliente++;

        console.log("Cadastro realizado com sucesso");
        return novoCliente;
    }


    login(email, senha) {
        let usuario = this.funcionarios.find(f => f.email === email && f.senha === senha);
        if (usuario) {
            this.usuarioLogado = usuario;
            return { tipo: 'funcionario', dados: usuario };
        }

        usuario = this.clientes.find(c => c.email === email && c.senha === senha);
        if (usuario) {
            this.usuarioLogado = usuario;
            return { tipo: 'cliente', dados: usuario };
        }

        this.usuarioLogado = null;
        return null;
    }

    logout() {
        this.usuarioLogado = null;
        console.log("Logout realizado com sucesso.");
    }

    addQuarto(qtdCamas, precoPorNoite, qtdDisponivel, nome, descricao) {
        if (!this.usuarioLogado || !(this.usuarioLogado instanceof Funcionario)) {
            console.log("Acesso negado. Apenas funcionários podem adicionar quartos.");
            return;
        }

        const novoQuarto = new Quartos(qtdCamas, precoPorNoite, qtdDisponivel, nome, descricao);
        this.quartos.push(novoQuarto);
        console.log(`Quarto "${nome}" adicionado com sucesso!`);
    }

    verListaDeReservas() {
        return this.reservas;
    }

    verListaDeQuartos() {
        return this.quartos;
    }

    verListaDeClientes() {
        return this.clientes;
    }

    statusReserva(idReserva, novoStatus) {
        const reserva = this.reservas.find(r => r.id === idReserva);
        if (reserva) {
            reserva.status = novoStatus;
            console.log(`Status da reserva ${idReserva} alterado para "${novoStatus}".`);
        } else {
            console.log("Erro: Reserva não encontrada.");
        }
    }

    fazerReserva(nomeQuarto, dataEntrada, dataSaida) {
        if (!this.usuarioLogado || !(this.usuarioLogado instanceof Cliente)) {
            console.log("Acesso negado. Apenas clientes podem fazer reservas.");
            return null;
        }

        const quarto = this.quartos.find(q => q.nome === nomeQuarto && q.qtdDisponivel > 0);

        if (quarto) {
            const novaReserva = new Reserva(this.proximoIdReserva, this.usuarioLogado.id, quarto.nome, 'pendente', dataEntrada, dataSaida);
            this.reservas.push(novaReserva);
            this.proximoIdReserva++;

            quarto.qtdDisponivel--;

            console.log("Reserva realizada com sucesso!");
            return novaReserva;
        } else {
            console.log("Quarto não Disponível ou não encontrado.");
            return null;
        }
    }

    verMinhasReservas() {
        if (!this.usuarioLogado || !(this.usuarioLogado instanceof Cliente)) {
            console.log("Acesso negado.");
            return [];
        }
        return this.reservas.filter(r => r.idCliente === this.usuarioLogado.id);
    }

    verMeusDados() {
        if (this.usuarioLogado) {
            return this.usuarioLogado;
        } else {
            console.log("Nenhum usuário está logado.");
            return null;
        }
    }

    cancelarReserva(idReserva) {
        if (!this.usuarioLogado || !(this.usuarioLogado instanceof Cliente)) {
            console.log("Acesso negado. Apenas clientes podem cancelar suas reservas.");
            return false;
        }

        const reservaParaCancelar = this.reservas.find(r => r.id === idReserva);

        if (!reservaParaCancelar) {
            console.log("Erro: Reserva com o ID fornecido não foi encontrada.");
            return false;
        }
        if (reservaParaCancelar.idCliente !== this.usuarioLogado.id) {
            console.log("Erro: Você não tem permissão para cancelar esta reserva.");
            return false;
        }
        if (reservaParaCancelar.status === 'cancelada') {
            console.log("Atenção: Esta reserva já está cancelada.");
            return false;
        }

        const nomeQuartoDevolvido = reservaParaCancelar.nomeQuarto;

        const quarto = this.quartos.find(q => q.nome === nomeQuartoDevolvido);

        if (quarto) {
            quarto.qtdDisponivel++;
            console.log(`Um quarto do tipo "${quarto.nome}" foi devolvido ao estoque.`);
        }

        reservaParaCancelar.status = 'cancelada';

        console.log(`Reserva ID ${idReserva} foi cancelada com sucesso.`);
        return true;
    }


    avaliarEstadia(idReserva, nota, comentario) {
        if (!this.usuarioLogado || !(this.usuarioLogado instanceof Cliente)) {
            console.log("Acesso negado. Apenas clientes podem avaliar estadias.");
            return;
        }

        const reserva = this.reservas.find(r => r.id === idReserva && r.idCliente === this.usuarioLogado.id);

        if (!reserva) {
            console.log("Erro: Reserva não encontrada ou não pertence a você.");
            return;
        }
        if (reserva.status !== 'realizada') {
            console.log("Erro: Você só pode avaliar estadias com status 'realizada'.");
            return;
        }
        // Verifica se esta reserva já foi avaliada
        const avaliacaoExistente = this.avaliacoes.find(a => a.idReserva === idReserva);
        if (avaliacaoExistente) {
            console.log("Erro: Esta estadia já foi avaliada.");
            return;
        }

        const novaAvaliacao = new Avaliacao(this.proximoIdAvaliacao, this.usuarioLogado.id, reserva.nomeQuarto, nota, comentario);
        this.avaliacoes.push(novaAvaliacao);
        this.proximoIdAvaliacao++;

        console.log("Obrigado pela sua avaliação!");
    }

    visualizarAvaliacoes(nomeQuarto) {
        const avaliacoesDoQuarto = this.avaliacoes.filter(a => a.nomeQuarto === nomeQuarto);

        if (avaliacoesDoQuarto.length === 0) {
            console.log(`Ainda não há avaliações para o quarto "${nomeQuarto}".`);
            return [];
        }

        return avaliacoesDoQuarto;
    }

    modificarMeusDados(novosDados) {
        if (!this.usuarioLogado) {
            console.log("Erro: Nenhum usuário logado.");
            return false;
        }
        if (novosDados.nome) {
            this.usuarioLogado.nome = novosDados.nome;
        }
        if (novosDados.email) {
            this.usuarioLogado.email = novosDados.email;
        }
        if (novosDados.senha) {
            this.usuarioLogado.senha = novosDados.senha;
        }
        console.log("Seus dados foram atualizados com sucesso.");
        return true;
    }

    editarQuarto(nomeQuarto, novosDados) {
        if (!this.usuarioLogado || !(this.usuarioLogado instanceof Funcionario)) {
            console.log("Acesso negado. Apenas funcionários podem editar quartos.");
            return false;
        }
        const quarto = this.quartos.find(q => q.nome === nomeQuarto);
        if (!quarto) {
            console.log("Erro: Quarto não encontrado.");
            return false;
        }
        // Atualiza os dados fornecidos
        if (novosDados.precoPorNoite) {
            quarto.precoPorNoite = novosDados.precoPorNoite;
        }
        if (novosDados.descricao) {
            quarto.descricao = novosDados.descricao;
        }
        if (novosDados.qtdDisponivel) {
            quarto.qtdDisponivel = novosDados.qtdDisponivel;
        }

        console.log(`Os dados do quarto "${nomeQuarto}" foram atualizados.`);
        return true;
    }

    excluirQuarto(nomeQuarto) {
        if (!this.usuarioLogado || !(this.usuarioLogado instanceof Funcionario)) {
            console.log("Acesso negado. Apenas funcionários podem excluir quartos.");
            return false;
        }
        // Checar reservas ativas para este quarto
        const reservaAtiva = this.reservas.find(r => r.nomeQuarto === nomeQuarto && (r.status === 'pendente' || r.status === 'realizada'));
        if (reservaAtiva) {
            console.log(`Erro: Não é possível excluir o quarto "${nomeQuarto}", pois ele possui reservas ativas.`);
            return false;
        }
        const indiceQuarto = this.quartos.findIndex(q => q.nome === nomeQuarto);
        if (indiceQuarto === -1) {
            console.log("Erro: Quarto não encontrado.");
            return false;
        }
        // Remove o quarto do array
        this.quartos.splice(indiceQuarto, 1);
        console.log(`Quarto "${nomeQuarto}" excluído com sucesso.`);
        return true;
    }
}
module.exports = Sistema;