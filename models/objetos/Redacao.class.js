class Redacao {
  constructor(
    id,
    texto,
    notaIA = null, // 💡 CORREÇÃO: Adicionando 'notaIA' como argumento (antes era 'todaIA')
    notaProfessor = null,
    feedback = ""
  ) {
    this.id = id;
    this.texto = texto;
    this.notaIA = notaIA; // 💡 CORREÇÃO: Inicializa com o valor passado ou null
    this.notaProfessor = notaProfessor;
    this.feedback = feedback;
    this.corrigidaPorProfessor = false;
    this.corrigidaPorIA = false;
    this.respostaIA = ""; // Inicializa a resposta da IA
  }

  enviarParaCorrecaoIA() {
    this.corrigidaPorIA = true;
    this.notaIA = Math.floor(Math.random() * 10) + 1;
    this.respostaIA =
      "Feedback da IA gerado (Este deve ser preenchido por uma chamada de API real)."; // Exemplo
  }

  enviarParaProfessor(professor) {
    // Isso assume que o professor tem um método para processar a redação
    this.corrigidaPorProfessor = true;
    professor.corrigirRedacao(this);
  }

  isCorrigida() {
    return this.corrigidaPorIA || this.corrigidaPorProfessor;
  }

  // Métodos de Banco de Dados (Adicionar aqui se necessário)
}

module.exports = Redacao;
