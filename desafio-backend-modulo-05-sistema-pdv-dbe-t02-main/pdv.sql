create database pdv;

create table usuarios (
id serial primary key not null,
nome varchar(50) not null, 
email varchar(50) collate "C" not null unique,
senha text not null
);


create table categorias (
id serial primary key not null, 
descricao text not null
);


insert into categorias
(descricao)
values
('Informática'),
('Celulares'),
('Beleza e Perfumaria'),
('Mercado'),
('Livros e Papelaria'),
('Brinquedos'),
('Moda'),
('Bebê'),
('Games');

create table produtos (
	id serial primary key,
  descricao text not null,
  quantidade_estoque integer not null,
  valor integer not null,
  categoria_id integer not null references categorias (id)
);

CREATE TABLE clientes (
    id serial primary key,
    nome text not null,
    email text not null unique,
    cpf text not null unique,
    cep text,
    rua text,
    numero text,
    bairro text,
    cidade text,
    estado text
);

create table pedidos(
  id serial primary key not null,
  cliente_id int,
  foreign key(cliente_id) references clientes(id), 
  observacao text,
  valor_total integer not null
  );
  
  create table pedido_produtos(
    id serial primary key not null,
    pedido_id int, 
    produto_id int,
    quantidade_produto int,
    valor_produto int,
    foreign key(pedido_id) references pedidos(id),
    foreign key(produto_id) references produtos(id)
   
    );

  alter table produtos add column produto_imagem text;