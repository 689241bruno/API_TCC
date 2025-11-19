class Notificacao {
    constructor( 
        id, 
        destinatario, 
        mensagem 
    ) {
        this.id = id;
        this.destinatario = destinatario;
        this.mensagem = mensagem;
        this.titulo = titulo;
        this.lida = false;
    }

    enviar() {
        console.log(`Notificação enviada para ${this.destinatario.nome}: ${this.mensagem}`);
    }
}

module.exports = Notificacao;