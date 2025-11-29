// Localização: utils/CloudinaryUploader.js

// 💡 1. Importa a configuração do Cloudinary que contém as chaves e o objeto 'cloudinary'
// Ajuste o caminho se necessário (ex: se o config estiver em outro lugar)
const cloudinary = require("../config/cloudinaryConfig");

/**
 * Envia uma imagem para o Cloudinary e retorna a URL segura.
 * * @param {string} base64Data - A string Base64 (data URI) da imagem enviada pelo frontend.
 * @param {number} usuarioId - O ID do usuário, usado para criar um identificador único (public_id).
 * @returns {Promise<string>} A secure_url (URL segura) da imagem hospedada.
 */
async function uploadFotoPerfil(base64Data, usuarioId) {
  // É importante validar se o dado Base64 existe
  if (!base64Data) {
    throw new Error("Dados da imagem (Base64) ausentes na requisição.");
  }

  try {
    const result = await cloudinary.uploader.upload(base64Data, {
      // Pasta no Cloudinary para organização
      folder: "users_img_perfil",

      // Cria um ID público único e fácil de gerenciar (ex: 'perfil_123')
      public_id: `perfil_${usuarioId}`,

      // Garante que o Base64 seja interpretado corretamente
      resource_type: "image",

      // Sobrescreve a imagem anterior do usuário, se houver
      overwrite: true,
    });

    // Retorna a URL completa (incluindo o ID de versão) que será salva no DB
    return result.secure_url;
  } catch (error) {
    console.error(
      `Erro no upload para o Cloudinary para o usuário ${usuarioId}:`,
      error
    );

    // Lança o erro para ser capturado no Controller
    throw new Error(
      "Falha ao salvar a imagem no Cloudinary. Verifique as credenciais."
    );
  }
}

// 💡 2. Exporta a função para que seu Controller possa usá-la
module.exports = {
  uploadFotoPerfil,
};
