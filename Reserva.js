class Reserva {
    constructor(id, idCliente, nomeQuarto, status, dataEntrada, dataSaida) {
        this.id = id;
        this.idCliente = idCliente;
        this.nomeQuarto = nomeQuarto;
        this.status = status;
        this.dataEntrada = dataEntrada;
        this.dataSaida = dataSaida;
    }
}
module.exports = Reserva;