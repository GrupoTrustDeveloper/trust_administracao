from sqlalchemy.inspection import inspect
from sqlalchemy.orm import Session

from backend.database import engine, SessionLocal
from backend.models.user import User
from backend.security import get_password_hash


def init_db():
    # Cria a tabela se ela não existir
    # O Base.metadata.create_all fará isso, mas vamos ter uma verificação explícita
    inspector = inspect(engine)
    if not inspector.has_table(User.__tablename__):
        print(f"Criando tabela: {User.__tablename__}")
        User.metadata.create_all(bind=engine)

    db: Session = SessionLocal()
    try:
        # Verifica se existe algum usuário
        user_count = db.query(User).count()
        if user_count == 0:
            print("Nenhum usuário encontrado. Criando usuário administrador padrão.")
            # Cria o usuário admin padrão
            admin_password = "@D1m1n1!2@3#4$"
            hashed_password = get_password_hash(admin_password)
            
            admin_user = User(
                cpf='00000000000',
                nome='Admin',
                telefone='+00(00)0000-0000',
                email='admin@admin.com.br',
                hashed_password=hashed_password
            )
            db.add(admin_user)
            db.commit()
            print("Usuário administrador criado com sucesso.")
    finally:
        db.close()
