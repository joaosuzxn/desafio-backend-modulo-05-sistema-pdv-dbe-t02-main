const joi = require('joi');

const schemaProduto = joi.object({
    descricao: joi.string().trim().required().messages({
        'any.required': 'O campo descrição é obrigatório!',
        'string.empty': 'O campo descrição é obrigatório!',
    }),

    quantidade_estoque: joi.number().required().min(0).messages({
        'any.required': 'A quantidade do estoque deve ser informada!',
        'number.base': 'A quantidade do estoque deve um número válido!',
        'number.min': 'A quantidade do estoque deve ser um número válido!',
    }),

    valor: joi.number().required().min(1).messages({
        'any.required': 'O valor deve ser informado!',
        'number.base': 'O valor deve um número válido!',
        'number.min': 'O valor deve ser um número válido!',
    }),

    categoria_id: joi.number().required().messages({
        'any.required': 'O Id da categoria deve ser informado!',
        'number.base': 'O Id da categoria deve um número válido!',
    }),

    produto_imagem: joi.string().trim().messages({
        'string.empty': 'Insira um valor valido a URL!'
    })
});

module.exports = { schemaProduto };
