class Redacao {
  constructor(id, texto, notaIA = null, notaProfessor = null, feedback = "") {
    this.id = id;
    this.texto = texto;
    this.notaIA = notaIA;
    this.notaProfessor = notaProfessor;
    this.feedback = feedback;
    this.corrigidaPorProfessor = false;
    this.corrigidaPorIA = false;
    this.respostaIA = "";
  }

  enviarParaCorrecaoIA() {
    this.corrigidaPorIA = true;
    this.notaIA = Math.floor(Math.random() * 10) + 1;
    this.respostaIA =
      "Feedback da IA gerado (Este deve ser preenchido por uma chamada de API real).";
  }

  enviarParaProfessor(professor) {
    this.corrigidaPorProfessor = true;
    professor.corrigirRedacao(this);
  }

  isCorrigida() {
    return this.corrigidaPorIA || this.corrigidaPorProfessor;
  }
}

module.exports = Redacao;
