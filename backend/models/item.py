from sqlalchemy import Column, Integer, String
from backend.database import Base

class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), index=True)
    email = Column(String(255), unique=True, index=True)
