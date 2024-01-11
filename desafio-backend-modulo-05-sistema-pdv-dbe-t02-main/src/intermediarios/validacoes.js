const jwt = require('jsonwebtoken')
require("dotenv").config();

const validarCorpoRequisicao = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      Mensagem: error.message,
    });
  }
};

const verificarToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        'mensagem':
          "Para acessar este recurso, um token de autenticação válido deve ser enviado.",
      });
    }

    const JWTPass = process.env.JWT_SECRET;

    jwt.verify(token, JWTPass, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          'mensagem': "Token de autenticação inválido ou expirado.",
        });
      }

      req.usuario = decoded;
      next();
    });
  } catch (error) {
    return res.status(500).json({
      'mensagem': "Ocorreu um erro interno ao verificar o token.",
    });
  }
};


module.exports = { verificarToken, validarCorpoRequisicao };