const knex = require('../conexao');
const compiladorHTML = require('../email/formatarHTML');
const transportador = require('../email/nodemailer');

const cadastrarPedido = async (req, res) => {
    try {
        const { cliente_id, observacao, pedido_produtos } = req.body

        const clienteExiste = await knex('clientes').where({ id: cliente_id }).first()

        if (!clienteExiste) {
            return res.status(404).json({
                'Mensagem': 'Não existe cliente com o id informado!'
            })
        }

        let valor_total = 0

        for (let produto of pedido_produtos) {
            let produtoSolicitado = await knex('produtos').where({ id: produto.produto_id }).first()

            if (!produtoSolicitado) {
                return res.status(404).json({
                    'Mensagem': 'Não encontrado produto com o id informado!'
                })
            }

            if (produtoSolicitado.quantidade_estoque < produto.quantidade_produto) {
                return res.status(400).json({
                    'Mensagem': 'Quantidade em estoque insuficiente!'
                })
            }

            let valorProduto = produtoSolicitado.valor * produto.quantidade_produto
            valor_total += valorProduto
        }

        const novoPedido = await knex('pedidos').returning('*').insert({
            cliente_id,
            observacao,
            valor_total
        })

        for (let produto of pedido_produtos) {
            let produtoSolicitado = await knex('produtos').where({ id: produto.produto_id }).first()

            const [pedido] = novoPedido

            await knex('pedido_produtos').insert({
                pedido_id: pedido.id,
                produto_id: produtoSolicitado.id,
                quantidade_produto: produto.quantidade_produto,
                valor_produto: produtoSolicitado.valor
            })

            await knex('produtos').where({ id: produtoSolicitado.id }).update({ quantidade_estoque: produtoSolicitado.quantidade_estoque - produto.quantidade_produto })
        }

        const cliente = await knex('clientes').where({ id: cliente_id }).first()

        const html = await compiladorHTML('./src/email/email.html', {
            nome: cliente.nome,
            texto: `Muito obrigado por comprar conosco!`
        })

        transportador.sendMail({
            from: `${process.env.EMAIL_NAME} <${process.env.EMAIL_FROM}>`,
            to: `${cliente.nome} <${cliente.email}>`,
            subject: `Pedido realizado com sucesso!`,
            html
        })

        return res.status(201).json({
            'Mensagem': 'Pedido cadastrado com sucesso!'
        })
    } catch (error) {
        return res.status(500).json({
            'Mensagem': 'Erro interno no servidor!'
        })
    }
}

const listarPedidos = async (req, res) => {
    const { cliente_id } = req.query;
    let pedidosFiltrados;

    try {
        if (cliente_id) {
            pedidosFiltrados = await knex("pedidos").where({ cliente_id })

        } else {
            pedidosFiltrados = await knex("pedidos");
        }
        const pedidos = []


        for (const pedido of pedidosFiltrados) {

            const produtos_pedidos = await knex('pedido_produtos')
                .where({ pedido_id: pedido.id })

            pedidos.push({
                pedido, produtos_pedidos
            })
        }

        return res.status(200).json(pedidos);

    } catch (erro) {
        console.error(erro);
        return res.status(500).json({
            'Mensagem': 'Erro interno no servidor!'
        });
    }
};

module.exports = {
    listarPedidos,
    cadastrarPedido
}

