from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from backend import crud
from backend.database import SessionLocal, engine, Base
from backend.models.item import Item as ItemModel
from backend.schemas.item import Item as ItemSchema, ItemCreate

# Cria as tabelas no banco de dados (se não existirem)
# Isso garante que o SQLAlchemy conheça o modelo Item antes de criar as tabelas
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Trust Administracao API",
    description="API para o sistema de cadastro e consulta da Trust.",
    version="0.1.0"
)

# Configuração do CORS
# Em um ambiente de produção, você deve restringir as origens permitidas.
origins = [
    "http://localhost",
    "http://localhost:8080",  # Se você usar um servidor de desenvolvimento para o frontend
    "http://127.0.0.1",
    "http://127.0.0.1:8080",
    "null"  # Para permitir requisições de arquivos locais (file://)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependência para obter a sessão do banco de dados
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/items/", response_model=ItemSchema)
def create_item(item: ItemCreate, db: Session = Depends(get_db)):
    db_item = crud.get_item_by_email(db, email=item.email)
    if db_item:
        raise HTTPException(status_code=400, detail="Email já cadastrado")
    return crud.create_item(db=db, item=item)


@app.get("/items/", response_model=List[ItemSchema])
def read_items(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    items = crud.get_items(db, skip=skip, limit=limit)
    return items


@app.get("/")
async def root():
    return {"message": "Bem-vindo à API do Sistema de Cadastro Trust!"}

# Aqui adicionaremos os endpoints para CRUD (Create, Read, Update, Delete)
