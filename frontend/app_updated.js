document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'http://127.0.0.1:8000';

    // Elementos da UI
    const viewLogin = document.getElementById('view-login');
    const mainContent = document.getElementById('main-content');
    const appContent = document.getElementById('app-content');
    const loginForm = document.getElementById('login-form');
    const logoutButton = document.getElementById('logout-button');
    const menuUsers = document.getElementById('menu-users');
    const menuCadastroBasico = document.getElementById('menu-cadastro-basico');
    const menuCadastroPontos = document.getElementById('menu-cadastro-pontos');

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

    // --- Funções de Renderização - Usuários ---

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

    // --- Funções de Renderização - Cadastro Básico ---

    const renderCadastroBasico = () => {
        appContent.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <h2><i class="bi bi-person-plus-fill me-2"></i>Cadastro Básico</h2>
                <button class="btn btn-primary" id="show-add-basico-form">
                    <i class="bi bi-plus-circle me-2"></i>Adicionar Registro
                </button>
            </div>
            <hr>
            <div class="row">
                <div class="col-md-12">
                    <div class="card shadow-sm">
                        <div class="card-body">
                            <h5 class="card-title"><i class="bi bi-clipboard-data me-2"></i>Informações Básicas</h5>
                            <p class="card-text text-muted">Gerencie os cadastros básicos do sistema.</p>
                            <div class="table-responsive mt-3">
                                <table class="table table-striped table-hover">
                                    <thead class="table-dark">
                                        <tr>
                                            <th>ID</th>
                                            <th>Nome</th>
                                            <th>Descrição</th>
                                            <th>Status</th>
                                            <th>Data Criação</th>
                                            <th>Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td colspan="6" class="text-center text-muted py-4">
                                                <i class="bi bi-inbox display-4 d-block mb-2"></i>
                                                Nenhum registro encontrado.
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('show-add-basico-form')?.addEventListener('click', renderAddBasicoForm);
    };

    const renderAddBasicoForm = () => {
        appContent.innerHTML = `
            <div class="d-flex align-items-center mb-3">
                <i class="bi bi-plus-circle-fill text-primary me-2 fs-3"></i>
                <h2 class="mb-0">Adicionar Cadastro Básico</h2>
            </div>
            <hr>
            <div class="card shadow-sm">
                <div class="card-body">
                    <form id="add-basico-form">
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="nome-basico" class="form-label">
                                    <i class="bi bi-tag me-1"></i>Nome *
                                </label>
                                <input type="text" class="form-control" id="nome-basico" required placeholder="Digite o nome do registro">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="status-basico" class="form-label">
                                    <i class="bi bi-toggle-on me-1"></i>Status *
                                </label>
                                <select class="form-select" id="status-basico" required>
                                    <option value="">Selecione o status...</option>
                                    <option value="ativo">✅ Ativo</option>
                                    <option value="inativo">❌ Inativo</option>
                                </select>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12 mb-3">
                                <label for="descricao-basico" class="form-label">
                                    <i class="bi bi-card-text me-1"></i>Descrição
                                </label>
                                <textarea class="form-control" id="descricao-basico" rows="3" placeholder="Descreva o registro (opcional)"></textarea>
                            </div>
                        </div>
                        <div class="d-flex gap-2">
                            <button type="submit" class="btn btn-primary">
                                <i class="bi bi-check-circle me-2"></i>Salvar
                            </button>
                            <button type="button" class="btn btn-secondary" id="cancel-add-basico">
                                <i class="bi bi-x-circle me-2"></i>Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.getElementById('add-basico-form').addEventListener('submit', handleCreateBasico);
        document.getElementById('cancel-add-basico').addEventListener('click', renderCadastroBasico);
    };

    // --- Funções de Renderização - Cadastro de Pontos ---

    const renderCadastroPontos = () => {
        appContent.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <h2><i class="bi bi-geo-alt-fill me-2"></i>Cadastro de Pontos</h2>
                <button class="btn btn-primary" id="show-add-ponto-form">
                    <i class="bi bi-plus-circle me-2"></i>Adicionar Ponto
                </button>
            </div>
            <hr>
            <div class="row">
                <div class="col-md-12">
                    <div class="card shadow-sm">
                        <div class="card-body">
                            <h5 class="card-title"><i class="bi bi-map me-2"></i>Pontos de Referência</h5>
                            <p class="card-text text-muted">Gerencie os pontos de referência e localizações do sistema.</p>
                            <div class="table-responsive mt-3">
                                <table class="table table-striped table-hover">
                                    <thead class="table-dark">
                                        <tr>
                                            <th>ID</th>
                                            <th>Nome</th>
                                            <th>Tipo</th>
                                            <th>Endereço</th>
                                            <th>Coordenadas</th>
                                            <th>Status</th>
                                            <th>Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td colspan="7" class="text-center text-muted py-4">
                                                <i class="bi bi-geo display-4 d-block mb-2"></i>
                                                Nenhum ponto cadastrado.
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('show-add-ponto-form')?.addEventListener('click', renderAddPontoForm);
    };

    const renderAddPontoForm = () => {
        appContent.innerHTML = `
            <div class="d-flex align-items-center mb-3">
                <i class="bi bi-geo-alt-fill text-primary me-2 fs-3"></i>
                <h2 class="mb-0">Adicionar Ponto de Referência</h2>
            </div>
            <hr>
            <div class="card shadow-sm">
                <div class="card-body">
                    <form id="add-ponto-form">
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="nome-ponto" class="form-label">
                                    <i class="bi bi-tag me-1"></i>Nome do Ponto *
                                </label>
                                <input type="text" class="form-control" id="nome-ponto" required placeholder="Digite o nome do ponto">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="tipo-ponto" class="form-label">
                                    <i class="bi bi-building me-1"></i>Tipo *
                                </label>
                                <select class="form-select" id="tipo-ponto" required>
                                    <option value="">Selecione o tipo...</option>
                                    <option value="comercial">🏢 Comercial</option>
                                    <option value="residencial">🏠 Residencial</option>
                                    <option value="industrial">🏭 Industrial</option>
                                    <option value="publico">🏛️ Público</option>
                                    <option value="educacional">🏫 Educacional</option>
                                    <option value="saude">🏥 Saúde</option>
                                </select>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12 mb-3">
                                <label for="endereco-ponto" class="form-label">
                                    <i class="bi bi-house me-1"></i>Endereço *
                                </label>
                                <input type="text" class="form-control" id="endereco-ponto" required placeholder="Rua, número, bairro, cidade">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="latitude-ponto" class="form-label">
                                    <i class="bi bi-compass me-1"></i>Latitude
                                </label>
                                <input type="number" step="any" class="form-control" id="latitude-ponto" placeholder="Ex: -23.5505">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="longitude-ponto" class="form-label">
                                    <i class="bi bi-compass me-1"></i>Longitude
                                </label>
                                <input type="number" step="any" class="form-control" id="longitude-ponto" placeholder="Ex: -46.6333">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12 mb-3">
                                <label for="observacoes-ponto" class="form-label">
                                    <i class="bi bi-card-text me-1"></i>Observações
                                </label>
                                <textarea class="form-control" id="observacoes-ponto" rows="3" placeholder="Informações adicionais sobre o ponto (opcional)"></textarea>
                            </div>
                        </div>
                        <div class="d-flex gap-2">
                            <button type="submit" class="btn btn-primary">
                                <i class="bi bi-check-circle me-2"></i>Salvar
                            </button>
                            <button type="button" class="btn btn-secondary" id="cancel-add-ponto">
                                <i class="bi bi-x-circle me-2"></i>Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.getElementById('add-ponto-form').addEventListener('submit', handleCreatePonto);
        document.getElementById('cancel-add-ponto').addEventListener('click', renderCadastroPontos);
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
            const response = await fetch(`${apiUrl}/users/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newUser),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Erro ao criar usuário');
            }

            alert('Usuário criado com sucesso!');
            handleLoadUsers();
        } catch (error) {
            alert(`Erro: ${error.message}`);
        }
    };

    const handleCreateBasico = async (event) => {
        event.preventDefault();
        
        const novoBasico = {
            nome: document.getElementById('nome-basico').value,
            descricao: document.getElementById('descricao-basico').value,
            status: document.getElementById('status-basico').value,
            data_criacao: new Date().toISOString()
        };

        // Simulação de salvamento - aqui você implementaria a chamada para a API
        console.log('Novo cadastro básico:', novoBasico);
        
        // Simular delay de API
        setTimeout(() => {
            alert('✅ Cadastro básico salvo com sucesso!');
            renderCadastroBasico();
        }, 500);
    };

    const handleCreatePonto = async (event) => {
        event.preventDefault();
        
        const novoPonto = {
            nome: document.getElementById('nome-ponto').value,
            tipo: document.getElementById('tipo-ponto').value,
            endereco: document.getElementById('endereco-ponto').value,
            latitude: document.getElementById('latitude-ponto').value || null,
            longitude: document.getElementById('longitude-ponto').value || null,
            observacoes: document.getElementById('observacoes-ponto').value,
            data_criacao: new Date().toISOString()
        };

        // Simulação de salvamento - aqui você implementaria a chamada para a API
        console.log('Novo ponto:', novoPonto);
        
        // Simular delay de API
        setTimeout(() => {
            alert('✅ Ponto cadastrado com sucesso!');
            renderCadastroPontos();
        }, 500);
    };

    // --- Event Listeners ---

    loginForm.addEventListener('submit', handleLogin);
    logoutButton.addEventListener('click', handleLogout);
    menuUsers.addEventListener('click', handleLoadUsers);
    menuCadastroBasico.addEventListener('click', renderCadastroBasico);
    menuCadastroPontos.addEventListener('click', renderCadastroPontos);

    // --- Inicialização ---

    checkAuthState();
});
