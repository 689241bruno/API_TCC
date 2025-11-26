class Simulado {
  constructor(id, titulo, questoes = [], data = new Date()) {
    this.id = id;
    this.titulo = titulo;
    this.questoes = questoes;
    this.data = data;
    this.nota = 0;
    this.tempo = 0;
  }

  gerarSimulado(adaptativo = false) {
    if (adaptativo) {
      return this.questoes.filter((q) => q.dificuldade <= 2);
    }
    return this.questoes;
  }

  corrigir(respostasAluno) {
    let acertos = 0;

    this.questoes.forEach((questao, i) => {
      if (
        questao.verificarResposta &&
        questao.verificarResposta(respostasAluno[i])
      ) {
        acertos++;
      }
    });

    if (this.questoes.length === 0) {
      this.nota = 0;
    } else {
      this.nota = (acertos / this.questoes.length) * 10;
    }

    return this.nota;
  }
}

module.exports = Simulado;
