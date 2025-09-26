    document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'http://127.0.0.1:8000';

    // Elementos da UI
    const viewLogin = document.getElementById('view-login');
    const mainContent = document.getElementById('main-content');
    const appContent = document.getElementById('app-content');
    const loginForm = document.getElementById('login-form');
    const logoutButton = document.getElementById('logout-button');
    const menuUsers = document.getElementById('menu-users');

    // --- Gerenciamento de Autenticação e Estado ---

    const getToken = () => localStorage.getItem('accessToken');
    const setToken = (token) => localStorage.setItem('accessToken', token);
    const removeToken = () => localStorage.removeItem('accessToken');


    const checkAuthState = () => {
        if (getToken()) {
            showMainView();
        } else {
            showLoginView();
        }
    };
    
    const handleLogout = () => {
        removeToken();
        checkAuthState();
        appContent.innerHTML = '<h2>Bem-vindo!</h2><p>Selecione uma opção no menu ao lado para começar.</p>';
    };

    // --- Funções de Renderização ---

    const renderUsersTable = (users) => {
        const tableRows = users.length === 0
            ? '<tr><td colspan="4" class="text-center">Nenhum usuário cadastrado.</td></tr>'
            : users.map(user => `
                <tr>
                    <td>${user.cpf}</td>
                    <td>${user.nome}</td>
                    <td>${user.email}</td>
                    <td>${user.telefone || ''}</td>
                </tr>
            `).join('');

        appContent.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <h2>Gerenciamento de Usuários</h2>
                <button class="btn btn-primary" id="show-add-user-form">Adicionar Usuário</button>
            </div>
            <hr>
            <div class="table-responsive mt-3">
                <table class="table table-striped">
                    <thead><tr><th>CPF</th><th>Nome</th><th>Email</th><th>Telefone</th></tr></thead>
                    <tbody>${tableRows}</tbody>
                </table>
            </div>
        `;
        document.getElementById('show-add-user-form').addEventListener('click', renderAddUserForm);
    };

    const renderAddUserForm = () => {
        appContent.innerHTML = `
            <h2>Adicionar Novo Usuário</h2>
            <hr>
            <form id="add-user-form">
                <div class="row">
                    <div class="col-md-6 mb-3"><label for="nome" class="form-label">Nome Completo</label><input type="text" class="form-control" id="nome" required></div>
                    <div class="col-md-6 mb-3"><label for="email" class="form-label">Email</label><input type="email" class="form-control" id="email" required></div>
                </div>
                <div class="row">
                    <div class="col-md-4 mb-3"><label for="cpf" class="form-label">CPF</label><input type="text" class="form-control" id="cpf" required></div>
                    <div class="col-md-4 mb-3"><label for="telefone" class="form-label">Telefone</label><input type="text" class="form-control" id="telefone"></div>
                    <div class="col-md-4 mb-3"><label for="acesso" class="form-label">Nível de Acesso</label><input type="text" class="form-control" id="acesso"></div>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-3"><label for="password" class="form-label">Senha</label><input type="password" class="form-control" id="password" required></div>
                </div>
                <button type="submit" class="btn btn-primary">Salvar</button>
                <button type="button" class="btn btn-secondary" id="cancel-add-user">Cancelar</button>
            </form>
        `;
        document.getElementById('add-user-form').addEventListener('submit', handleCreateUser);
        document.getElementById('cancel-add-user').addEventListener('click', handleLoadUsers);
    };

    // --- Handlers de API ---

    const handleLogin = async (event) => {
        event.preventDefault();
        const identifier = document.getElementById('login-identifier').value;
        const password = document.getElementById('login-password').value;
        const formData = new URLSearchParams({ username: identifier, password: password });

        try {
            const response = await fetch(`${apiUrl}/token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData,
            });
            if (!response.ok) throw new Error('CPF, email ou senha inválidos.');
            
            const data = await response.json();
            setToken(data.access_token);
            showMainView();
            
            // Carregar usuários automaticamente após login
            setTimeout(() => {
                handleLoadUsers();
            }, 200);
            
        } catch (error) {
            alert(`Erro no login: ${error.message}`);
        }
    };

    const handleLoadUsers = async () => {
        const token = getToken();
        if (!token) {
            showLoginView();
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/users/`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (response.status === 401) {
                handleLogout();
                throw new Error('Sessão expirada. Faça login novamente.');
            }
            if (!response.ok) throw new Error('Falha ao carregar usuários.');
            
            const users = await response.json();
            renderUsersTable(users);
        } catch (error) {
            alert(error.message);
        }
    };

    const handleCreateUser = async (event) => {
        event.preventDefault();
        const token = getToken();
        const newUser = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            cpf: document.getElementById('cpf').value,
            telefone: document.getElementById('telefone').value,
            acesso: document.getElementById('acesso').value,
            password: document.getElementById('password').value,
        };

        try {
            const response = await fetch