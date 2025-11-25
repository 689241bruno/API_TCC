class Simulado {
  constructor(id, titulo, questoes = [], data = new Date()) {
    this.id = id;
    this.titulo = titulo; // 💡 Adicionando 'titulo' ao construtor
    this.questoes = questoes; // 💡 Usando 'questoes'
    this.data = data;
    this.nota = 0;
    this.tempo = 0;
  }

  gerarSimulado(adaptativo = false) {
    // 💡 CORREÇÃO: Usando this.questoes em vez de this.perguntas
    if (adaptativo) {
      // Supondo que as questões no array tenham uma propriedade 'dificuldade'
      return this.questoes.filter((q) => q.dificuldade <= 2);
    }
    return this.questoes;
  }

  corrigir(respostasAluno) {
    let acertos = 0;

    // 💡 CORREÇÃO: Iterando corretamente sobre this.questoes
    this.questoes.forEach((questao, i) => {
      // Este método depende que cada objeto 'questao' tenha o método 'verificarResposta'
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
