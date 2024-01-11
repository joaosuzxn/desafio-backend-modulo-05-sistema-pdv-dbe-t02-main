const joi = require('joi');

const schemaCliente = joi.object({
    nome: joi.string().trim().required().messages({
        'any.required': 'O campo nome é obrigatório!',
        'string.empty': 'O campo nome é obrigatório!'
    }),

    email: joi.string().email().required().messages({
        'any.required': 'O campo email é obrigatório!',
        'string.empty': 'O campo email é obrigatório!',
        'string.email': 'O campo email deve ser válido!'
    }),

    cpf: joi.number().positive().integer().required().messages({
        'any.required': 'O campo CPF é obrigatório!',
        'number.positive': 'CPF inválido',
        'number.base': 'CPF inválido!',
        'number.precision': 'CPF inválido'
    }),

    cep: joi.number().positive().integer().precision(8).messages({
        'number.positive': 'CEP inválido',
        'number.base': 'CEP inválido!',
        'number.precision': 'CEP inválido'
    }),

    rua: joi.string().messages({
        'string.empty': 'Você precisa preencher o endereço para atualizar',
    }),

    numero: joi.number().positive().integer().messages({
        'number.positive': 'Número inválido',
        'number.base': 'Número inválido!'
    }),

    bairro: joi.string().messages({
        'string.empty': 'Você precisa preencher o endereço para atualizar',
    }),

    cidade: joi.string().messages({
        'string.empty': 'Você precisa preencher o endereço para atualizar',
    }),

    estado: joi.string().messages({
        'string.empty': 'Você precisa preencher o endereço para atualizar',
    }),

});

module.exports = { schemaCliente };