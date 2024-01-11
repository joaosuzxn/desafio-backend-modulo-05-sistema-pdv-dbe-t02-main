const knex = require('../conexao')
const { uploadArquivo, deletarArquivo } = require('../storage')

const cadastrarProduto = async (req, res) => {
  const { descricao, quantidade_estoque, valor, categoria_id } = req.body
  const { file } = req

  try {
    const catagoriaExiste = await knex('categorias').where({ id: categoria_id }).first()

    if (!catagoriaExiste) {
      return res.status(404).json({
        'Mensagem': 'Categoria com Id informado não foi encontrada!'
      })
    };

    let produto_imagem = null

    if (file) {
      const upload = await uploadArquivo(
        `produtos/${file.originalname}`,
        file.buffer,
        file.mimetype
      )
      produto_imagem = upload.url
    }

    const novoProduto = {
      descricao,
      quantidade_estoque,
      valor,
      categoria_id,
      produto_imagem
    }

    await knex('produtos').insert(novoProduto)

    return res.status(201).json({
      'Mensagem': 'Produto cadastrado com sucesso!'
    })

  } catch (error) {

    return res.status(500).json({
      'Mensagem': 'Erro interno no servidor!'
    })

  }
}

const listarProdutos = async (req, res) => {
  const categoria_id = req.query.categoria_id;
  let produtosFiltrados;

  try {
    if (categoria_id) {
      produtosFiltrados = await knex("produtos").where({ categoria_id });
    } else {
      produtosFiltrados = await knex("produtos");
    }

    return res.status(200).json(produtosFiltrados);
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({
      'Mensagem': 'Erro interno no servidor!'
    });
  }
};

const editarProduto = async (req, res) => {
  const { id } = req.params;
  const { descricao, quantidade_estoque, valor, categoria_id } = req.body;
  const { file } = req

  try {
    const produtoExistente = await knex('produtos').where({ id }).first();

    if (!produtoExistente) {
      return res.status(404).json({
        'Mensagem': "Produto não encontrado."
      });
    }

    const categoriaExistente = await knex('categorias').where({ id: categoria_id }).first();

    if (!categoriaExistente) {
      return res.status(404).json({
        'Mensagem': "Categoria informada não existe."
      });
    }

    let produto_imagem = null

    if (file) {
      const upload = await uploadArquivo(
        `produtos/${file.originalname}`,
        file.buffer,
        file.mimetype
      )
      produto_imagem = upload.url
    }

    await knex('produtos').where({ id }).update({
      descricao,
      quantidade_estoque,
      valor,
      categoria_id,
      produto_imagem
    });

    return res.status(200).json({
      'Mensagem': "Produto atualizado com sucesso."
    });

  } catch (error) {
    return res.status(500).json({
      'Mensagem': "Erro interno ao tentar atualizar o produto."
    });
  }
};

const excluirProduto = async (req, res) => {
  const { id } = req.params;

  try {
    const produtoExistente = await knex('produtos').where({ id }).first();

    if (!produtoExistente) {
      return res.status(404).json({
        'Mensagem': "Produto não encontrado."
      });
    }

    const produtoVinculadoAoPedido = await knex("pedido_produtos")
      .where({ produto_id: id })
      .first();

    if (produtoVinculadoAoPedido) {
      return res
        .status(400)
        .json({
          'Mensagem': "Não é possível excluir o produto, pois está vinculado a um pedido."
        });
    }

    if (produtoExistente.produto_imagem) {
      const path = produtoExistente.produto_imagem.replace(`${process.env.ENDPOINT_S3 / process.env.BACKBLAZE_BUCKET}`, '')

      deletarArquivo(`${path}`)
    }

    await knex('produtos').where({ id }).del();

    return res.status(204).send();

  } catch (error) {
    return res.status(500).json({
      'Mensagem': 'Erro interno no servidor!'
    });
  }
};

const detalharProduto = async (req, res) => {
  const { id } = req.params
  try {
    const produtoExiste = await knex('produtos').where({ id }).first()
    if (!produtoExiste) {
      return res.status(404).json({ "Mensagem": "Produto nao encontrado." })
    }

    return res.status(200).json(produtoExiste)
  } catch (err) {

    return res.status(500).json({ 'Mensagem': "Erro interno no servidor!" })

  }
}

module.exports = {
  listarProdutos,
  cadastrarProduto,
  editarProduto,
  excluirProduto,
  detalharProduto
};
