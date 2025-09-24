import uvicorn
import sys
import os

# Adiciona o diretório raiz do projeto ao path do Python
# Isso garante que o pacote 'backend' possa ser encontrado
project_root = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, project_root)

if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
