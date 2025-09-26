from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import Optional, List

from backend.models.user import User as UserModel
from backend.schemas.user import UserCreate, UserUpdate
from backend.security import get_password_hash

def get_user_by_email_or_cpf(db: Session, identifier: str) -> Optional[UserModel]:
    """
    Busca um usuário no banco de dados pelo seu e-mail ou CPF.
    """
    return db.query(UserModel).filter(
        or_(UserModel.email == identifier, UserModel.cpf == identifier)
    ).first()


def get_user_by_email(db: Session, email: str) -> Optional[UserModel]:
    """Busca um usuário pelo e-mail."""
    return db.query(UserModel).filter(UserModel.email == email).first()


def get_user_by_cpf(db: Session, cpf: str) -> Optional[UserModel]:
    """Busca um usuário pelo CPF."""
    return db.query(UserModel).filter(UserModel.cpf == cpf).first()


def get_users(db: Session, skip: int = 0, limit: int = 100) -> List[UserModel]:
    """Retorna uma lista de usuários com paginação."""
    return db.query(UserModel).offset(skip).limit(limit).all()


def create_user(db: Session, user: UserCreate) -> UserModel:
    """Cria um novo usuário no banco de dados."""
    hashed_password = get_password_hash(user.password)
    db_user = UserModel(
        email=user.email,
        nome=user.nome,
        cpf=user.cpf,
        telefone=user.telefone,
        acesso=user.acesso,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def update_user(db: Session, cpf: str, user_update: UserUpdate) -> Optional[UserModel]:
    """Atualiza um usuário existente no banco de dados."""
    db_user = get_user_by_cpf(db, cpf=cpf)
    if not db_user:
        return None
    
    update_data = user_update.dict(exclude_unset=True)
    
    # Se a senha foi fornecida, fazer o hash
    if "password" in update_data:
        update_data["hashed_password"] = get_password_hash(update_data.pop("password"))
    
    # Atualizar os campos fornecidos
    for field, value in update_data.items():
        setattr(db_user, field, value)
    
    db.commit()
    db.refresh(db_user)
    return db_user


def delete_user(db: Session, cpf: str) -> bool:
    """Remove um usuário do banco de dados."""
    db_user = get_user_by_cpf(db, cpf=cpf)
    if not db_user:
        return False
    
    db.delete(db_user)
    db.commit()
    return True


def get_user_by_id(db: Session, cpf: str) -> Optional[UserModel]:
    """Busca um usuário pelo CPF (que é a chave primária)."""
    return db.query(UserModel).filter(UserModel.cpf == cpf).first()