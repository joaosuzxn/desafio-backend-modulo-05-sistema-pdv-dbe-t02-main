const express = require('express');
const { listarCategorias } = require('./controladores/categorias');
const { atualizarUsuario, cadastrarUsuario, detalharUsuario, loginUsuario } = require('./controladores/usuarios')
const { verificarToken, validarCorpoRequisicao } = require("./intermediarios/validacoes");
const { schemaUsuarioCompleto, schemaLogin } = require('./schemas/schemasUsuarios')
const { schemaCliente } = require('./schemas/schemaCliente');
const { schemaProduto } = require('./schemas/schemaProduto')
const { pedidoSchema } = require('./schemas/schemaPedidos')
const { cadastrarProduto, listarProdutos, detalharProduto } = require('./controladores/produtos');
const { editarProduto, excluirProduto } = require('./controladores/produtos');
const { cadastrarCliente, listarClientes, editarCliente, detalharCliente } = require('./controladores/clientes');
const { listarPedidos, cadastrarPedido } = require('./controladores/pedidos');
const multer = require('./intermediarios/multer');

const rotas = express.Router();

rotas.get('/categoria', listarCategorias);
rotas.post('/usuario', validarCorpoRequisicao(schemaUsuarioCompleto), cadastrarUsuario);

rotas.post('/login', validarCorpoRequisicao(schemaLogin), loginUsuario);

rotas.use(verificarToken);

rotas.get('/usuario', detalharUsuario);
rotas.put('/usuario', validarCorpoRequisicao(schemaUsuarioCompleto), atualizarUsuario);

rotas.post('/produto', multer.single('produto_imagem'), validarCorpoRequisicao(schemaProduto), cadastrarProduto);
rotas.get('/produto', listarProdutos);
rotas.get('/produto/:id', detalharProduto)
rotas.put('/produto/:id', multer.single('produto_imagem'), validarCorpoRequisicao(schemaProduto), editarProduto);
rotas.delete('/produto/:id', excluirProduto);

rotas.get('/cliente', listarClientes)
rotas.post('/cliente', validarCorpoRequisicao(schemaCliente), cadastrarCliente)
rotas.get('/cliente/:id', detalharCliente)
rotas.put('/cliente/:id', validarCorpoRequisicao(schemaCliente), editarCliente);

rotas.get('/pedido', listarPedidos)
rotas.post('/pedido', validarCorpoRequisicao(pedidoSchema), cadastrarPedido)

module.exports = rotas
