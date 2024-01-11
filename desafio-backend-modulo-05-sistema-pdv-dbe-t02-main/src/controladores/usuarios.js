const bcrypt = require('bcrypt')
const knex = require('../conexao')
const jwt = require("jsonwebtoken");

const loginUsuario = async (req, res) => {
    const { email, senha } = req.body;

    try {
        const usuario = await knex("usuarios").where({ email }).first();

        if (!usuario)
            return res
                .status(401)
                .json({ 'mensagem': "Usuário e/ou senha inválido(s)." });

        const senhaValida = await bcrypt.compare(senha, usuario.senha);

        if (!senhaValida)
            return res
                .status(401)
                .json({ 'mensagem': "Usuário e/ou senha inválido(s)." });


        const JWTPass = process.env.JWT_SECRET;
        const token = jwt.sign({ id: usuario.id }, JWTPass, { expiresIn: "1h" });

        res.status(200).json({ token });
    } catch (error) {
        return res
            .status(500)
            .json({ 'mensagem': "Ocorreu um erro durante o login." });
    }
};




const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body

    try {
        const senhaCriptografada = await bcrypt.hash(senha, 10)

        await knex('usuarios').insert({ nome, email, senha: senhaCriptografada })
        return res.status(201).json({ 'mensagem': "Usuario criado" })

    } catch (err) {
        if (err.message == "insert into \"usuarios\" (\"email\", \"nome\", \"senha\") values ($1, $2, $3) - duplicate key value violates unique constraint \"usuarios_email_key\"") {
            return res
                .status(400)
                .json({ 'mensagem': "Email ja cadastrado." })
        }
        return res
            .status(500)
            .json({ 'mensagem': "Ocorreu um erro no cadastro de usuário." });
    }
}


const detalharUsuario = async (req, res) => {
    try {

        const { id } = req.usuario

        const usuario = await knex('usuarios').where({ id }).first()

        const usuarioResposta = {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email
        }

        return res.status(200).json(usuarioResposta)

    } catch (err) {
        return res
            .status(500)
            .json({ 'mensagem': 'Erro interno no servidor!' })
    }
}


const atualizarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body
    const { id } = req.usuario

    try {
        const emailExiste = await knex('usuarios').where({ email }).first()

        if (emailExiste) {
            return res.status(400).json({
                'Mensagem': 'O email informado já está cadastrado!'
            })
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10)

        await knex('usuarios').where({ id }).update({
            nome,
            email,
            senha: senhaCriptografada
        })

        return res
            .status(200)
            .json({ 'Mensagem': 'Usuário atualizado!' })

    } catch (error) {

        return res
            .status(500)
            .json({ 'Mensagem': 'Erro interno no servidor!' })

    }
}

module.exports = { atualizarUsuario, cadastrarUsuario, detalharUsuario, loginUsuario }