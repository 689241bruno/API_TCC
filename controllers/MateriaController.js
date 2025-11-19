const Material = require("../models/objetos/Material.class");
const Professor = require("../models/usuarios/Professor.class");

exports.listar = async (req, res) => {
    console.log("[ROTA] GET /materias chamada");
    try {
        const materiais = await Material.listar();
        console.log("[LISTAR] Materiais encontrados:", materiais.length);
        res.json(materiais);
    } catch (error) {
        console.error("[ERRO LISTAR]", error);
        res.status(500).send("Erro ao listar materiais didáticos!");
    }
};

exports.listarMaterias = async (req, res) => {
    try {
        const materia = req.params.materia;
        console.log("Requisição listarMaterias: ", { materia });
        const materiais = await Material.listarMaterial(materia);
        console.log("Materiais encontrados: ", materiais);
        res.json(materiais);
    } catch (err) {
        console.error("Erro no listar matérias: ", err);
        res.status(500).json({ erro: "Erro ao listar matérias!" });
    }
};

exports.publicarMateria = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ erro: "Nenhum arquivo enviado."});
        }

        const { tema, subtema, titulo, materia, criado_por} = req.body;
        const arquivo = req.file ? req.file.buffer : null;

        if (!tema || !subtema || !titulo || !materia || !criado_por || !arquivo) {
            return res.status(400).json({ erro: "Preencha todos os campos e selecione um arquivo." });
        }

        await Professor.publicarMaterial(tema, subtema, titulo, materia, arquivo, criado_por);
        res.status(201).json({ mensagem: "Material publicado com sucesso!" });

    } catch (err) {
        console.error("Erro ao publicar material:", err);
        res.status(500).json({ erro: "Erro ao publicar material." });
    }
};

exports.atualizarProgresso = async (req, res) => {
    const { idUsuario, atividadeId} = req.body;

    if (!idUsuario || !atividadeId) {
        return res.status(400).json({ erro: "Campos obrigatórios ausentes!" });
    }

    try {
        await Material.atualizarProgresso(idUsuario, atividadeId);
        res.json({ sucesso: true });
    } catch (err) {
        console.error("Erro ao atualizar progresso: ", err);
        res.status(500).json({ erro: "Erro ao atualizar progresso" });
    }
};

exports.listarProgressoUsuario = async (req, res) => {
    const { idUsuario } = req.params;
    console.log("ID do usuário recebido no backend:", idUsuario);
    try {
        const rows = await Material.listarProgresso(idUsuario)
        res.json(rows);
    } catch (err) {
        console.error("Erro ao listar progresso: ", err);
        res.status(500).json({ erro: "Erro ao listar progresso" });
    }
};

exports.verPDF = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await Material.verPDF(id);

        if (!rows.length) return res.status(404).send("Arquivo não encontrado");

        res.setHeader("Content-Type", "application/pdf");
        res.send(rows[0].arquivo);
    } catch (err) {
        console.error("Erro ao abrir PDF:", err);
        res.status(500).send("Erro ao abrir PDF");
    }
};
