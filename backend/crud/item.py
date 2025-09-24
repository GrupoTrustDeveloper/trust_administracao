from sqlalchemy.orm import Session

from backend.models.item import Item as ItemModel
from backend.schemas.item import ItemCreate


def get_item_by_email(db: Session, email: str):
    """Busca o primeiro item encontrado com o email especificado."""
    return db.query(ItemModel).filter(ItemModel.email == email).first()


def get_items(db: Session, skip: int = 0, limit: int = 100):
    """Retorna uma lista de itens do banco de dados com paginação."""
    return db.query(ItemModel).offset(skip).limit(limit).all()


def create_item(db: Session, item: ItemCreate):
    """Cria um novo item no banco de dados."""
    db_item = ItemModel(name=item.name, email=item.email)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item
