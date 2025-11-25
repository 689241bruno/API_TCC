class Notificacao {
  constructor(
    id,
    destinatario,
    mensagem,
    titulo // 💡 CORREÇÃO: Adicionando 'titulo' aos argumentos
  ) {
    this.id = id;
    this.destinatario = destinatario;
    this.mensagem = mensagem;
    this.titulo = titulo; // Atribuição correta
    this.lida = false;
  }

  enviar() {
    console.log(
      `Notificação enviada para ${this.destinatario.nome} (${this.titulo}): ${this.mensagem}`
    );
  }
}

module.exports = Notificacao;
