class Cliente {
    constructor(id, nome, dataNascimento, cpf, email, senha) {
        this.id = id;
        this.nome = nome;
        this.dataNascimento = dataNascimento;
        this.cpf = cpf;
        this.email = email;
        this.senha = senha;
    }
}
module.exports = Cliente;