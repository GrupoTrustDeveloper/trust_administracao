from pydantic import BaseModel, EmailStr

# Esquema base com campos compartilhados
class ItemBase(BaseModel):
    name: str
    email: EmailStr

# Esquema para criar um novo item (usado na entrada da API)
class ItemCreate(ItemBase):
    pass

# Esquema para ler/retornar um item da API (usado na saída)
class Item(ItemBase):
    id: int

    class Config:
        # Permite que o Pydantic leia os dados de um modelo SQLAlchemy
        from_attributes = True
