from pydantic import BaseModel, EmailStr
from typing import Optional

# Esquema base com campos compartilhados para o usuário
class UserBase(BaseModel):
    email: EmailStr
    nome: str
    cpf: str
    telefone: Optional[str] = None
    acesso: Optional[str] = None

# Esquema para criar um novo usuário (recebe a senha)
class UserCreate(UserBase):
    password: str

# Esquema para ler/retornar um usuário da API (não inclui a senha)
class User(UserBase):
    class Config:
        # Permite que o Pydantic leia os dados de um modelo SQLAlchemy
        from_attributes = True

# Esquema para atualizar um usuário (todos os campos opcionais)
class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    nome: Optional[str] = None
    telefone: Optional[str] = None
    acesso: Optional[str] = None
    password: Optional[str] = None