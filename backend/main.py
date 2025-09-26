import os
from datetime import datetime, timedelta, timezone
from typing import List, Optional

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend import crud
from backend.database import Base, SessionLocal, engine
from backend.db_init import init_db
from backend.models.user import User as UserModel
from backend.schemas.user import User as UserSchema, UserCreate, UserUpdate
from backend.security import (
    ACCESS_TOKEN_EXPIRE_MINUTES, ALGORITHM, SECRET_KEY, create_access_token, verify_password
)

# Cria as tabelas no banco de dados
Base.metadata.create_all(bind=engine)

# Inicializa o DB com usuário admin, se necessário
init_db()

app = FastAPI(
    title="Trust Administracao API",
    description="API para o sistema de cadastro e consulta da Trust.",
    version="0.1.0"
)

# Configuração do CORS
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:3001", 
    "http://localhost:5000",
    "http://localhost:5173",
    "http://localhost:8000",
    "http://localhost:8080",
    "http://127.0.0.1",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://127.0.0.1:5000", 
    "http://127.0.0.1:5173",
    "http://127.0.0.1:8000",
    "http://127.0.0.1:8080",
    "*"  # Para desenvolvimento - remover em produção
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Dependências e Esquemas ---

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Não foi possível validar as credenciais",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = crud.get_user_by_email_or_cpf(db, identifier=token_data.username)
    if user is None:
        raise credentials_exception
    return user

# --- Autenticação ---

def authenticate_user(db: Session, username: str, password: str) -> Optional[UserModel]:
    user = crud.get_user_by_email_or_cpf(db, identifier=username)
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user

@app.post("/token", response_model=Token)
async def login_for_access_token(db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="CPF/Email ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

# --- Endpoints ---

@app.get("/")
async def root():
    return {"message": "Bem-vindo à API do Sistema de cadastro Trust!"}

@app.get("/users/me/", response_model=UserSchema)
async def read_users_me(current_user: UserModel = Depends(get_current_user)):
    return current_user

@app.post("/users/", response_model=UserSchema)
def create_user_endpoint(user: UserCreate, db: Session = Depends(get_db)):
    db_user_by_email = crud.get_user_by_email(db, email=user.email)
    if db_user_by_email:
        raise HTTPException(status_code=400, detail="Email já cadastrado")
    db_user_by_cpf = crud.get_user_by_cpf(db, cpf=user.cpf)
    if db_user_by_cpf:
        raise HTTPException(status_code=400, detail="CPF já cadastrado")
    return crud.create_user(db=db, user=user)

@app.get("/users/", response_model=List[UserSchema])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: UserModel = Depends(get_current_user)):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users

@app.put("/users/{cpf}", response_model=UserSchema)
def update_user_endpoint(
    cpf: str, 
    user_update: UserUpdate, 
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    """Atualiza um usuário existente."""
    # Verificar se o usuário existe
    db_user = crud.get_user_by_cpf(db, cpf=cpf)
    if not db_user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    # Verificar se email já existe (se fornecido)
    if user_update.email and user_update.email != db_user.email:
        existing_user = crud.get_user_by_email(db, email=user_update.email)
        if existing_user:
            raise HTTPException(status_code=400, detail="Email já cadastrado")
    
    updated_user = crud.update_user(db=db, cpf=cpf, user_update=user_update)
    if not updated_user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    return updated_user


@app.delete("/users/{cpf}")
def delete_user_endpoint(
    cpf: str,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    """Remove um usuário."""
    # Não permitir que o usuário delete a si mesmo
    if current_user.cpf == cpf:
        raise HTTPException(status_code=400, detail="Não é possível deletar seu próprio usuário")
    
    success = crud.delete_user(db=db, cpf=cpf)
    if not success:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    return {"message": "Usuário removido com sucesso"}


@app.get("/users/{cpf}", response_model=UserSchema)
def get_user_by_cpf_endpoint(
    cpf: str,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    """Busca um usuário específico pelo CPF."""
    db_user = crud.get_user_by_cpf(db, cpf=cpf)
    if not db_user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    return db_user