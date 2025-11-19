const Aluno = require("../models/usuarios/Aluno.class");

exports.listarAlunos = async (req, res) => {
    try {
        console.log("Requisição listarAlunos recebida");
        const alunos = await Aluno.listar();
        res.json(alunos);
    } catch (err) {
        console.error("Erro ao listar alunos:", err);
        res.status(500).json({ erro: "Erro ao listar alunos." });
    }
};

exports.cadastrarAluno = async (req, res) => {
    try {
        const { usuario_id, modoIntensivo, diagnostico, planoEstudosId } = req.body;
        console.log("Requisição cadastrarAluno:", req.body);

        if (!usuario_id) {
            return res.status(400).json({ erro: "O campo usuario_id é obrigatório." });
        }

        const novoAluno = await Aluno.cadastrar(usuario_id, modoIntensivo, diagnostico, planoEstudosId);
        res.status(201).json({ mensagem: "Aluno cadastrado com sucesso!", aluno: novoAluno });
    } catch (err) {
        console.error("Erro ao cadastrar aluno:", err);
        res.status(500).json({ erro: "Erro ao cadastrar aluno." });
    }
};

exports.editarAluno = async (req, res) => {
    try {
        const { usuario_id } = req.params;
        const dados = req.body;
        console.log("Requisição editarAluno:", { usuario_id, dados });

        await Aluno.editar(usuario_id, dados);
        res.json({ mensagem: "Aluno atualizado com sucesso!" });
    } catch (err) {
        console.error("Erro ao editar aluno:", err);
        res.status(500).json({ erro: "Erro ao editar aluno." });
    }
};

exports.deletarAluno = async (req, res) => {
    try {
        const { usuario_id } = req.params;
        console.log("Requisição deletarAluno:", { usuario_id });

        await Aluno.deletar(usuario_id);
        res.json({ mensagem: "Aluno deletado com sucesso!" });
    } catch (err) {
        console.error("Erro ao deletar aluno:", err);
        res.status(500).json({ erro: "Erro ao deletar aluno." });
    }
};

exports.buscarAlunoPorId = async (req, res) => {
    try {
        const { usuario_id } = req.params;
        const aluno = await Aluno.buscarPorId(usuario_id);

        if (!aluno) {
            return res.status(404).json({ erro: "Aluno não encontrado." });
        }

        res.json({ data: aluno });
    } catch (err) {
        console.error("Erro ao buscar aluno:", err);
        res.status(500).json({ erro: "Erro ao buscar aluno." });
    }
};

exports.ativarModoIntensivo = async (req, res) => {
    try {
        const { usuario_id } = req.params;
        const { modoIntensivo } = req.body;
        console.log("Requisição ativarModoIntensivo:", { usuario_id, modoIntensivo });

        await Aluno.ativarModoIntensivo(usuario_id, modoIntensivo);
        res.json({ mensagem: "Modo intensivo atualizado com sucesso!" });
    } catch (err) {
        console.error("Erro ao ativar modo intensivo:", err);
        res.status(500).json({ erro: "Erro ao ativar modo intensivo." });
    }
};

exports.checkRanking = async (req, res) => {
    try {
        const { usuario_id } = req.params;
        console.log("Requisição checkRanking:", { usuario_id });

        const ranking = await Aluno.checkRanking(usuario_id);
        res.json(ranking);
    } catch (err) {
        console.error("Erro ao verificar ranking:", err);
        res.status(500).json({ erro: "Erro ao verificar ranking." });
    }
};

exports.addXp = async (req, res) => {
    try {
        const { usuario_id } = req.params;
        const { xp } = req.body;

        if (!xp || isNaN(xp)) {
            return res.status(400).json({ message: "XP inválido." });
        }

        const resultado = await Aluno.addXp(usuario_id, xp);

        return res.status(200).json({
            message: "XP adicionado com sucesso!",
            novoXp: resultado.xp,
        });
    } catch (err) {
        console.error("Erro no controller ao adicionar XP:", err);
        return res.status(500).json({ message: "Erro interno ao adicionar XP." });
    }
};
