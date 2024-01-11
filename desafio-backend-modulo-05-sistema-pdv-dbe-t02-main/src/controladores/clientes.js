const knex = require('../conexao')

const cadastrarCliente = async (req, res) => {
    const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } = req.body;

    try {
        const existeEmail = await knex('clientes').where({ email }).first();

        const existeCpf = await knex('clientes').where({ cpf }).first();

        if (existeEmail) {
            return res.status(400).json({ 'mensagem': 'O email já está cadastrado.' });
        }
        if (existeCpf) {
            return res.status(400).json({ 'mensagem': 'O CPF já está cadastrado.' });
        }

        await knex('clientes').insert({
            nome,
            email,
            cpf,
            cep,
            rua,
            numero,
            bairro,
            cidade,
            estado,
        });
        return res.status(201).json({ 'mensagem': 'Cliente criado' });

    } catch (err) {
        return res.status(500).json({ 'mensagem': 'Ocorreu um erro no cadastro de cliente.' });
    }
};

const listarClientes = async (req, res) => {

    try {
        const clientes = await knex('clientes');
        return res.status(200).json(clientes)

    } catch (error) {
        return res.status(500).json({
            'Mensagem': 'Erro interno no servidor!'
        })
    }

};

const editarCliente = async (req, res) => {
    const { nome, email, cpf, cep, rua,
        numero, bairro, cidade, estado } = req.body

    try {
        const { id } = req.params

        const clienteExiste = await knex('clientes').where({ id }).first();

        if (!clienteExiste) {
            return res.status(404).json({
                'mensagem': 'cliente não existe'
            })
        };

        const emailExiste = await knex('clientes').where({ email }).first()

        if (emailExiste) {
            return res.status(400).json({
                'Mensagem': 'O email informado já está cadastrado!'
            })
        }

        const cpfExiste = await knex('clientes').where({ cpf }).first()

        if (cpfExiste) {
            return res.status(400).json({
                'Mensagem': 'O cpf informado já está cadastrado!'
            })
        }

        const clienteAtualizado =
            await knex('clientes')
                .update({ nome, email, cpf, cep, rua, numero, bairro, cidade, estado })
                .where({ id })
                .returning()

        return res.status(204).json(clienteAtualizado)

    } catch (error) {
        return res.status(500).json({
            'Mensagem': 'Erro interno no servidor!'
        });
    }
};

const detalharCliente = async (req, res) => {
    const { id } = req.params

    try {


        const clienteExiste = await knex('clientes').where({ id }).first()
        if (!clienteExiste) {
            return res.status(404).json({ "Mensagem": "Cliente nao encontrado." })
        }

        return res.status(200).json(clienteExiste)


    } catch (err) {
        return res.status(500).json({ 'Mensagem': "Erro interno no servidor!" })
    }
}


module.exports = {
    editarCliente,
    cadastrarCliente,
    listarClientes,
    detalharCliente
}
