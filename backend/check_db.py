#!/usr/bin/env python3
"""
Script para verificar o estado do banco de dados
"""
import sys
import os

# Adicionar o diretório pai ao path para importar o módulo backend
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import text
from backend.database import engine, SessionLocal
from backend.models.user import User
from backend.security import get_password_hash

def check_database():
    """Verifica o estado do banco de dados"""
    print("=== VERIFICAÇÃO DO BANCO DE DADOS ===\n")
    
    # Verificar conexão
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            print("✅ Conexão com banco de dados: OK")
    except Exception as e:
        print(f"❌ Erro na conexão: {e}")
        return
    
    # Verificar se a tabela existe
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SHOW TABLES LIKE 'trustit_sys_usuario'"))
            tables = result.fetchall()
            if tables:
                print("✅ Tabela 'trustit_sys_usuario': EXISTE")
            else:
                print("❌ Tabela 'trustit_sys_usuario': NÃO EXISTE")
                return
    except Exception as e:
        print(f"❌ Erro ao verificar tabela: {e}")
        return
    
    # Verificar usuários na tabela
    db = SessionLocal()
    try:
        users = db.query(User).all()
        print(f"📊 Total de usuários na tabela: {len(users)}")
        
        if users:
            print("\n👥 Usuários encontrados:")
            for user in users:
                print(f"  - CPF: {user.cpf}")
                print(f"    Nome: {user.nome}")
                print(f"    Email: {user.email}")
                print(f"    Telefone: {user.telefone}")
                print(f"    Acesso: {user.acesso}")
                print("    ---")
        else:
            print("❌ Nenhum usuário encontrado na tabela")
            
        # Verificar se existe o admin específico
        admin = db.query(User).filter(User.email == 'admin@admin.com.br').first()
        if admin:
            print("✅ Usuário admin encontrado!")
        else:
            print("❌ Usuário admin NÃO encontrado")
            
    except Exception as e:
        print(f"❌ Erro ao consultar usuários: {e}")
    finally:
        db.close()

def create_admin_user():
    """Cria o usuário admin manualmente"""
    print("\n=== CRIANDO USUÁRIO ADMIN ===")
    
    db = SessionLocal()
    try:
        # Verificar se já existe
        existing_admin = db.query(User).filter(User.email == 'admin@admin.com.br').first()
        if existing_admin:
            print("⚠️ Usuário admin já existe!")
            return
            
        # Criar usuário admin
        admin_password = "@D1m1n1!2@3#4$"
        hashed_password = get_password_hash(admin_password)
        
        admin_user = User(
            cpf='00000000000',
            nome='Admin',
            telefone='+00(00)0000-0000',
            email='admin@admin.com.br',
            hashed_password=hashed_password,
            acesso='admin'
        )
        
        db.add(admin_user)
        db.commit()
        print("✅ Usuário admin criado com sucesso!")
        
    except Exception as e:
        print(f"❌ Erro ao criar usuário admin: {e}")
        db.rollback()
    finally:
        db.close()

def create_table():
    """Cria a tabela se não existir"""
    print("\n=== CRIANDO TABELA ===")
    try:
        from backend.database import Base
        Base.metadata.create_all(bind=engine)
        print("✅ Tabela criada/verificada com sucesso!")
    except Exception as e:
        print(f"❌ Erro ao criar tabela: {e}")

if __name__ == "__main__":
    print("🔍 Verificando estado do banco de dados...\n")
    
    # Verificar estado atual
    check_database()
    
    # Menu de opções
    print("\n" + "="*50)
    print("OPÇÕES DISPONÍVEIS:")
    print("1. Criar tabela (se não existir)")
    print("2. Criar usuário admin")
    print("3. Verificar novamente")
    print("4. Sair")
    print("="*50)
    
    while True:
        choice = input("\nEscolha uma opção (1-4): ").strip()
        
        if choice == "1":
            create_table()
        elif choice == "2":
            create_admin_user()
        elif choice == "3":
            check_database()
        elif choice == "4":
            print("👋 Saindo...")
            break
        else:
            print("❌ Opção inválida! Escolha 1, 2, 3 ou 4.")
        
        print("\n" + "-"*30)