# Sistema de Cadastro e Consulta - Trust

Este é um sistema web simples para cadastro e consulta de itens, desenvolvido com um backend em Python (FastAPI) e um frontend em HTML, CSS e JavaScript.

## Estrutura do Projeto

```
/
├── backend/            # Contém a aplicação da API em FastAPI
│   ├── crud/
│   ├── models/
│   ├── schemas/
│   ├── .env            # Arquivo com as credenciais do banco (NÃO VERSIONAR)
│   ├── database.py
│   ├── main.py
│   └── requirements.txt
├── frontend/           # Contém a interface do usuário
│   ├── app.js
│   └── index.html
└── README.md
```

## Pré-requisitos

- Python 3.8+
- Um servidor de banco de dados MariaDB ou MySQL acessível.

## Configuração e Execução

1.  **Crie e ative um ambiente virtual na raiz do projeto:**
    ```bash
    # Windows
    python -m venv venv
    .\venv\Scripts\activate

    # macOS/Linux
    python3 -m venv venv
    source venv/bin/activate
    ```

2.  **Instale as dependências:**
    ```bash
    pip install -r backend/requirements.txt
    ```

3.  **Configure o arquivo .env:**
    - Na **raiz do projeto**, crie um arquivo chamado `.env`.
    - Adicione a URL de conexão do seu banco de dados. O formato é:
      ```
      DATABASE_URL=mysql+pymysql://USUARIO:SENHA@HOST:PORTA/NOME_DO_BANCO
      ```
    - **Importante:** Certifique-se de que o banco de dados (`NOME_DO_BANCO`) já exista no seu servidor MariaDB.

4.  **Execute o servidor da API:**
    ```bash
    python run.py
    ```
    O servidor estará rodando em `http://127.0.0.1:8000`.
    A documentação interativa da API estará disponível em `http://127.0.0.1:8000/docs`.

## Acessando o Frontend

1.  Abra o arquivo `frontend/index.html` diretamente no seu navegador de preferência (ex: Google Chrome, Firefox).

2.  A página irá carregar e se conectar automaticamente ao backend (desde que ele esteja rodando).

Agora você pode cadastrar e consultar itens através da interface web.
