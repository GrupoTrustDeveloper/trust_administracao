# Este arquivo transforma o diretório em um pacote Python.

# Importa as funções CRUD para que possam ser acessadas diretamente do pacote `crud`
from .user import (
    get_user_by_email_or_cpf,
    get_user_by_email,
    get_user_by_cpf,
    get_user_by_id,
    get_users,
    create_user,
    update_user,
    delete_user
)