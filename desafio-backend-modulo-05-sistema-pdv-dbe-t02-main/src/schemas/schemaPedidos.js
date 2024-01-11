const Joi = require("joi");

const pedidoSchema = Joi.object({
  cliente_id: Joi.number().integer().required().messages({
    "any.required": "O id do cliente é obrigatório.",
    "number.base": "O id do cliente não é valido.",
  }),
  observacao: Joi.string().trim().messages({
    "string.empty": "O campo observacao não pode estar vazio.",
  }),
  pedido_produtos: Joi.array()
    .items(
      Joi.object({
        produto_id: Joi.number().integer().required().messages({
          "any.required": "O id do produto é obrigatório.",
          "number.base": "O id do produto não é valido.",
        }),
        quantidade_produto: Joi.number().integer().required().messages({
          "any.required": "O campo quantidade é obrigatório.",
          "number.base": "O campo quantidade deve ser um numero válido.",
        }),
      })
    )
    .min(1)
    .required()
    .messages({
      "any.required": "Pelo menos um produto deve ser informado no pedido,.",
      "array.min": "Pelo menos um produto deve ser informado no pedido.",
    }),
});

module.exports = { pedidoSchema };
