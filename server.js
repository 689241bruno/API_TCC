require("dotenv").config();
console.log("Variável DATABASE_URL carregada:", !!process.env.DATABASE_URL);
const dbPool = require("./config/db");
const express = require("express");
const cors = require("cors");
const usuariosRoutes = require("./routes/usuariosRoutes");
const alunoRoutes = require("./routes/AlunoRoutes");
const professorRoutes = require("./routes/ProfessorRoutes");
const adminRoutes = require("./routes/AdminRoutes");
const materiaRoutes = require("./routes/MateriaRoutes");
const desafioRoutes = require("./routes/DesafioRoutes");
const flashcardRoutes = require("./routes/FlashcardRoutes");
const planoRoutes = require("./routes/PlanoDeEstudosRoutes");

const app = express();
app.use(cors());

// Aumenta o limite de payload para JSON e form-data
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Rotas
app.use("/", usuariosRoutes);
app.use("/alunos", alunoRoutes);
app.use("/", professorRoutes);
app.use("/", adminRoutes);

app.use("/", desafioRoutes);
app.use("/", materiaRoutes);
app.use("/", planoRoutes);
app.use("/flashcards", flashcardRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
