document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('cadastro-form');
    const tabelaDados = document.getElementById('tabela-dados');
    const apiUrl = 'http://127.0.0.1:8000'; // URL base da sua API FastAPI

    // Função para buscar e renderizar os itens na tabela
    async function carregarItens() {
        try {
            const response = await fetch(`${apiUrl}/items/`);
            if (!response.ok) {
                throw new Error('Erro ao buscar itens da API');
            }
            const itens = await response.json();

            tabelaDados.innerHTML = ''; // Limpa a tabela antes de preencher

            if (itens.length === 0) {
                tabelaDados.innerHTML = '<tr><td colspan="4" class="text-center">Nenhum dado cadastrado ainda.</td></tr>';
            } else {
                itens.forEach(item => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <th scope="row">${item.id}</th>
                        <td>${item.name}</td>
                        <td>${item.email}</td>
                        <td>
                            <!-- Botões de ação (editar/excluir) podem ser adicionados aqui no futuro -->
                            <button class="btn btn-sm btn-warning">Editar</button>
                            <button class="btn btn-sm btn-danger">Excluir</button>
                        </td>
                    `;
                    tabelaDados.appendChild(tr);
                });
            }
        } catch (error) {
            console.error('Falha ao carregar itens:', error);
            tabelaDados.innerHTML = `<tr><td colspan="4" class="text-center text-danger">Falha ao carregar dados. Verifique se o backend está rodando.</td></tr>`;
        }
    }

    // Função para cadastrar um novo item
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Impede o recarregamento da página

        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;

        try {
            const response = await fetch(`${apiUrl}/items/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: nome, email: email }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Erro ao cadastrar item');
            }

            // Limpa o formulário e recarrega a lista de itens
            form.reset();
            await carregarItens();
            alert('Item cadastrado com sucesso!');

        } catch (error) {
            console.error('Falha ao cadastrar item:', error);
            alert(`Erro: ${error.message}`);
        }
    });

    // Carrega os itens iniciais ao carregar a página
    carregarItens();
});
