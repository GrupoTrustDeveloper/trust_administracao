from sqlalchemy import Column, String, CHAR
from backend.database import Base

class User(Base):
    __tablename__ = "trustit_sys_usuario"

    cpf = Column(CHAR(11), primary_key=True, index=True)
    nome = Column(String(255))
    telefone = Column(String(20))
    email = Column(String(255), unique=True, index=True)
    hashed_password = Column(String(100))
    acesso = Column(String(100))
