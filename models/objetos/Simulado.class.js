class Simulado {
    constructor( id, titulo, questoes = [], data = new Date()) {
        this.id = id;
        this.questoes = questoes;
        this.data = data;
        this.nota = 0;
        this.tempo = 0;
    }

    gerarSimulado( adaptativo = false ) {
        if (adaptativo) {
            return this.perguntas.filter(q => q.dificuldade <= 2);
        }
        return this.perguntas;
    }

    corrigir( respostasAluno ) {
        let acertos = 0;
        this.perguntas.array.forEach((questao, i) => {
            if (questao.verificarResposta(respostasAluno[i])) acertos++;
        });
        this.pontuacao = (acertos / this.perguntas.length) * 10;
        return this.pontuacao;
    } 
}

module.exports = Simulado;