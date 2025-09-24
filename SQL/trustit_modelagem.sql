
-- Usuário da Aplicação 

CREATE USER 'app_trustit_sys'@'%' IDENTIFIED BY 'Trust!T@dm1n';

GRANT SELECT, INSERT, UPDATE ON TrustIT_sys_Admin.* TO 'app_trustit_sys'@'%';



-- Script de criação de tabelas para o sistema TrustIT - Controle de Pontos de Interconexão

CREATE TABLE trustit_sys_pessoa_juridica (
    id INT AUTO_INCREMENT PRIMARY KEY,
    razao_social VARCHAR(255),
    cnpj CHAR(19),
    logradouro VARCHAR(255),
    numero VARCHAR(10),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    estado CHAR(2),
    pais VARCHAR(100),
    cep CHAR(9)
);

CREATE TABLE trustit_sys_tipo_relacionamento (
    id INT PRIMARY KEY,
    descricao VARCHAR(100)
);

CREATE TABLE trustit_sys_pj_relacionamento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pessoa_juridica_id INT,
    tipo_relacionamento_id INT,
    FOREIGN KEY (pessoa_juridica_id) REFERENCES trustit_sys_pessoa_juridica(id),
    FOREIGN KEY (tipo_relacionamento_id) REFERENCES trustit_sys_tipo_relacionamento(id)
);

CREATE TABLE trustit_sys_tipo_cliente (
    id INT PRIMARY KEY,
    descricao VARCHAR(100)
);

CREATE TABLE trustit_sys_parametros (
    id INT PRIMARY KEY,
    nome_parametro VARCHAR(100),
    valor_parametro VARCHAR(100)
);

CREATE TABLE trustit_sys_pj_tipo_cliente (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pessoa_juridica_id INT,
    tipo_cliente_id INT,
    FOREIGN KEY (pessoa_juridica_id) REFERENCES trustit_sys_pessoa_juridica(id),
    FOREIGN KEY (tipo_cliente_id) REFERENCES trustit_sys_tipo_cliente(id)
);

CREATE TABLE trustit_sys_status_ponto (
    id INT PRIMARY KEY,
    descricao VARCHAR(100)
);

CREATE TABLE trustit_sys_situacao_implantacao (
    id INT PRIMARY KEY,
    descricao VARCHAR(100)
);

CREATE TABLE trustit_sys_ponto_instalacao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pessoa_juridica_id INT,
    nome VARCHAR(255),
    apelido VARCHAR(100),
    logradouro VARCHAR(255),
    numero VARCHAR(10),
    complemento VARCHAR(100),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    estado CHAR(2),
    cep CHAR(8),
    latitude DECIMAL(10, 6),
    longitude DECIMAL(10, 6),
    ponto_referencia VARCHAR(255),
    status_id INT,
    vlan CHAR(4),
    situacao_implantacao_id INT,
    FOREIGN KEY (pessoa_juridica_id) REFERENCES trustit_sys_pessoa_juridica(id),
    FOREIGN KEY (status_id) REFERENCES trustit_sys_status_ponto(id),
    FOREIGN KEY (situacao_implantacao_id) REFERENCES trustit_sys_situacao_implantacao(id),
    CHECK (vlan REGEXP '^[0-9]{4}$')
);

CREATE TABLE trustit_sys_contato_ponto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ponto_instalacao_id INT,
    ddi CHAR(3),
    ddd CHAR(2),
    numero VARCHAR(10),
    nome_contato VARCHAR(100),
    FOREIGN KEY (ponto_instalacao_id) REFERENCES trustit_sys_ponto_instalacao(id)
);


INSERT INTO TrustIT_sys_Admin.trustit_sys_tipo_relacionamento (id, descricao) VALUES(0, NULL);

INSERT INTO TrustIT_sys_Admin.trustit_sys_tipo_relacionamento (id,descricao) VALUES (1,"Cliente");
INSERT INTO TrustIT_sys_Admin.trustit_sys_tipo_relacionamento (id,descricao) VALUES (2,"Provedor");
INSERT INTO TrustIT_sys_Admin.trustit_sys_tipo_relacionamento (id,descricao) VALUES (3,"Parceiro");
INSERT INTO TrustIT_sys_Admin.trustit_sys_tipo_relacionamento (id,descricao) VALUES (4,"Fornecedor");

INSERT INTO TrustIT_sys_Admin.trustit_sys_tipo_cliente (id, descricao) VALUES(0, NULL);

INSERT INTO TrustIT_sys_Admin.trustit_sys_tipo_cliente (id, descricao) VALUES (1,"Prefeitura");
INSERT INTO TrustIT_sys_Admin.trustit_sys_tipo_cliente (id, descricao) VALUES (2,"Consórcio de Município");
INSERT INTO TrustIT_sys_Admin.trustit_sys_tipo_cliente (id, descricao) VALUES (3,"Empresa privada");
INSERT INTO TrustIT_sys_Admin.trustit_sys_tipo_cliente (id, descricao) VALUES (4,"Órgãos ou Autarquias públicas");

INSERT INTO TrustIT_sys_Admin.trustit_sys_status_ponto (id, descricao) VALUES(0, NULL);

INSERT INTO TrustIT_sys_Admin.trustit_sys_status_ponto (id, descricao) VALUES (1,"Pendente Instalação");
INSERT INTO TrustIT_sys_Admin.trustit_sys_status_ponto (id, descricao) VALUES (2,"Link Instalado sem necessidade de Interconexão");
INSERT INTO TrustIT_sys_Admin.trustit_sys_status_ponto (id, descricao) VALUES (3,"Link Instalado aguardando Interconexão");
INSERT INTO TrustIT_sys_Admin.trustit_sys_status_ponto (id, descricao) VALUES (4,"Link Instalado com Interconexão");

INSERT INTO TrustIT_sys_Admin.trustit_sys_situacao_implantacao (id, descricao) VALUES(0, NULL);

INSERT INTO TrustIT_sys_Admin.trustit_sys_situacao_implantacao (id, descricao) VALUES (1,"Não necessário");
INSERT INTO TrustIT_sys_Admin.trustit_sys_situacao_implantacao (id, descricao) VALUES (2,"Não iniciado");
INSERT INTO TrustIT_sys_Admin.trustit_sys_situacao_implantacao (id, descricao) VALUES (3,"Em implantação");
INSERT INTO TrustIT_sys_Admin.trustit_sys_situacao_implantacao (id, descricao) VALUES (4,"Implantado");


INSERT INTO TrustIT_sys_Admin.trustit_sys_parametros (nome_parametro, valor_parametro) VALUES("Código Tp Relacionamento Cliente", 1);


INSERT INTO TrustIT_sys_Admin.trustit_sys_pessoa_juridica (razao_social, cnpj, logradouro, numero, bairro, cidade, estado, pais, cep) VALUES ("PREFEITURA - BARROSO - MG","18.094.755/0001-68","PC SANTANA","120","CENTRO","BARROSO","MG","Brasil","36.212-000");
INSERT INTO TrustIT_sys_Admin.trustit_sys_pessoa_juridica (razao_social, cnpj, logradouro, numero, bairro, cidade, estado, pais, cep) VALUES ("CIESP - CONSORCIO INTERMUNICIPAL DE ESPECIALIDADES","07.356.999/0001-55","R MORVAN DIAS DE FIGUEIREDO","11","CENTRO","BICAS","MG","Brasil","36.600-000");
INSERT INTO TrustIT_sys_Admin.trustit_sys_pessoa_juridica (razao_social, cnpj, logradouro, numero, bairro, cidade, estado, pais, cep) VALUES ("Prefeitura - BORDA DA MATA - MG","17.912.023/0001-75","PC ANTONIO MEGALE","86","CENTRO","BORDA DA MATA","MG","Brasil","37.564-000");
INSERT INTO TrustIT_sys_Admin.trustit_sys_pessoa_juridica (razao_social, cnpj, logradouro, numero, bairro, cidade, estado, pais, cep) VALUES ("Prefeitura - CAJURI - MG","18.132.456/0001-70","PC CAPITAO ARNALDO DIAS DE ANDRADES","12","CENTRO","CAJURI","MG","Brasil","36.560-000");
INSERT INTO TrustIT_sys_Admin.trustit_sys_pessoa_juridica (razao_social, cnpj, logradouro, numero, bairro, cidade, estado, pais, cep) VALUES ("Prefeitura - LAGOA DOURADA - MG","18.557.595/0001-46","R DR. ABEILARD PEREIRA","299","CENTRO","LAGOA DOURADA","MG","Brasil","36.345-000");
INSERT INTO TrustIT_sys_Admin.trustit_sys_pessoa_juridica (razao_social, cnpj, logradouro, numero, bairro, cidade, estado, pais, cep) VALUES ("Prefeitura - LAMBARI - MG","17.877.200/0001-20","R TIRADENTES","165","CENTRO","LAMBARI","MG","Brasil","37.480-000");
INSERT INTO TrustIT_sys_Admin.trustit_sys_pessoa_juridica (razao_social, cnpj, logradouro, numero, bairro, cidade, estado, pais, cep) VALUES ("CISUM - CONSORCIO INTERMUNICIPAL DE SAUDE UNIAO DA MATA","00.877.406/0001-57","AV DOS EXPEDICIONARIOS","S/N","BELA VISTA","LEOPOLDINA","MG","Brasil","36.703-000");
INSERT INTO TrustIT_sys_Admin.trustit_sys_pessoa_juridica (razao_social, cnpj, logradouro, numero, bairro, cidade, estado, pais, cep) VALUES ("Prefeitura - LEOPOLDINA - MG","17.733.643/0001-47","R LUCAS AUGUSTO","68","CENTRO ","LEOPOLDINA","MG","Brasil","36.700-088");
INSERT INTO TrustIT_sys_Admin.trustit_sys_pessoa_juridica (razao_social, cnpj, logradouro, numero, bairro, cidade, estado, pais, cep) VALUES ("Prefeitura - OURO BRANCO - MG","18.295.329/0001-92","PC SAGRADOS CORACOES","200","CENTRO ","OURO BRANCO","MG","Brasil","36.490-094");
INSERT INTO TrustIT_sys_Admin.trustit_sys_pessoa_juridica (razao_social, cnpj, logradouro, numero, bairro, cidade, estado, pais, cep) VALUES ("Prefeitura - POMPÉU - MG","18.296.681/0001-42","AV AVENIDA GALDINO MORATO DE MENEZES","100","SAO JOSÉ","POMPÉU","MG","Brasil","35.640-000");
INSERT INTO TrustIT_sys_Admin.trustit_sys_pessoa_juridica (razao_social, cnpj, logradouro, numero, bairro, cidade, estado, pais, cep) VALUES ("Prefeitura - RIO POMBA - MG","17.744.434/0001-07","AV RAUL SOARES","15","CENTRO","RIO POMBA","MG","Brasil","36.180-000");
INSERT INTO TrustIT_sys_Admin.trustit_sys_pessoa_juridica (razao_social, cnpj, logradouro, numero, bairro, cidade, estado, pais, cep) VALUES ("Prefeitura - RODEIRO - MG","18.128.256/0001-44","PC SAO SEBASTIAO","215","CENTRO ","RODEIRO","MG","Brasil","36.510-000");
INSERT INTO TrustIT_sys_Admin.trustit_sys_pessoa_juridica (razao_social, cnpj, logradouro, numero, bairro, cidade, estado, pais, cep) VALUES ("Prefeitura - SÃO JOÃO NEPOMUCENO - MG","18.558.072/0001-14","R PRESIDENTE GETULIO VARGAS","248","CENTRO ","SÃO JOÃO NEPOMUCENO","MG","Brasil","36.680-057");
INSERT INTO TrustIT_sys_Admin.trustit_sys_pessoa_juridica (razao_social, cnpj, logradouro, numero, bairro, cidade, estado, pais, cep) VALUES ("Prefeitura - SÃO SEBASTIÃO DA BELA VISTA - MG","17.935.370/0001-13","PC ERASMO CABRAL","334","CENTRO ","SÃO SEBASTIÃO DA BELA VISTA","MG","Brasil","37.567-000");
INSERT INTO TrustIT_sys_Admin.trustit_sys_pessoa_juridica (razao_social, cnpj, logradouro, numero, bairro, cidade, estado, pais, cep) VALUES ("Prefeitura - TOCANTINS - MG","18.128.223/0001-02","R PADRE MACARIO","129","CENTRO ","TOCANTINS","MG","Brasil","36.512-000");
INSERT INTO TrustIT_sys_Admin.trustit_sys_pessoa_juridica (razao_social, cnpj, logradouro, numero, bairro, cidade, estado, pais, cep) VALUES ("Prefeitura - UBÁ - MG","18.128.207/0001-01","AV COMENDADOR JACINTO SOARES DE SOUZA LIMA","250","CENTRO ","UBÁ","MG","Brasil","36.500-091");
INSERT INTO TrustIT_sys_Admin.trustit_sys_pessoa_juridica (razao_social, cnpj, logradouro, numero, bairro, cidade, estado, pais, cep) VALUES ("Prefeitura - VIÇOSA - MG","18.132.449/0001-79","R GOMES BARBOSA","803","CENTRO","VIÇOSA","MG","Brasil","36.570-001");
INSERT INTO TrustIT_sys_Admin.trustit_sys_pessoa_juridica (razao_social, cnpj, logradouro, numero, bairro, cidade, estado, pais, cep) VALUES ("Prefeitura - ALEGRE - ES","27.174.101/0001-35","PRQ GETULIO VARGAS","S/N","CENTRO","ALEGRE","ES","Brasil","29.500-000");
INSERT INTO TrustIT_sys_Admin.trustit_sys_pessoa_juridica (razao_social, cnpj, logradouro, numero, bairro, cidade, estado, pais, cep) VALUES ("Prefeitura - ATILIO VIVACQUA - ES","27.165.620/0001-37","PC JOSE VALENTIM LOPES","2","CENTRO","ATILIO VIVACQUA","ES","Brasil","29.490-000");
INSERT INTO TrustIT_sys_Admin.trustit_sys_pessoa_juridica (razao_social, cnpj, logradouro, numero, bairro, cidade, estado, pais, cep) VALUES ("Prefeitura - GUARAPARI - ES","27.165.190/0001-53","R ALENCAR MORAES REZENDE","100","JARDIM BOA VISTA","GUARAPARI","ES","Brasil","29.216-030");



CREATE TABLE trustit_sys_usuario (
    cpf CHAR(11) PRIMARY KEY,
    nome VARCHAR(255),
    telefone VARCHAR(20),
    email VARCHAR(255) UNIQUE,
	acesso varchar(100)
);


CREATE TABLE trustit_sys_usuario_permissao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cpf_usuario CHAR(11),
    nome_cadastro VARCHAR(100), -- Ex: 'ponto_instalacao', 'contato_ponto'
    tipo_permissao ENUM('select', 'insert', 'update', 'delete'),
    FOREIGN KEY (cpf_usuario) REFERENCES trustit_sys_usuario(cpf)
);

CREATE TABLE trustit_sys_usuario_pj_acesso (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cpf_usuario CHAR(11),
    pessoa_juridica_id INT,
    FOREIGN KEY (cpf_usuario) REFERENCES trustit_sys_usuario(cpf),
    FOREIGN KEY (pessoa_juridica_id) REFERENCES trustit_sys_pessoa_juridica(id)
);
