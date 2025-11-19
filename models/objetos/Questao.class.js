class Questao {
    constructor( id, enunciado, alternativas = [], respostaCorreta, materia, dificuldade ) {
        this.id = id;
        this.enunciado = enunciado;
        this.alternativas = alternativas;
        this.respostaCorreta = respostaCorreta;
        this.materia = materia;
        this.dificuldade = dificuldade;
    }

    verificarResposta( resposta ) {
        return resposta === this.respostaCorreta;
    }
}

module.exports = Questao;