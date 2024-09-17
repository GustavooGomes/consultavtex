document.addEventListener('DOMContentLoaded', async () => {
    const loadingOverlay = document.getElementById('loading-overlay');
    const mainContent = document.getElementById('main-content');

    try {
        const response = await fetch('orders.json');
        const data = await response.json();
        window.orders = data; // Carrega os pedidos

        // Oculta a tela de carregamento e exibe o conteúdo principal
        loadingOverlay.style.display = 'none';
        mainContent.style.display = 'block';
    } catch (error) {
        console.error('Erro ao carregar o JSON:', error);
        Swal.fire({
            title: 'Erro',
            text: 'Não foi possível carregar os dados dos pedidos. Por favor, tente novamente mais tarde.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
});

function formatDate(dateString) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleString('pt-BR', options);
}

function searchOrder() {
    const searchValue = document.getElementById('search').value.toLowerCase();
    const orderInfoDiv = document.getElementById('order-info');
    orderInfoDiv.innerHTML = '';

    if (!searchValue) {
        Swal.fire({
            title: 'Erro',
            text: 'Por favor, insira um critério de busca.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }

    if (!window.orders) {
        Swal.fire({
            title: 'Erro',
            text: 'Os dados dos pedidos ainda não foram carregados. Por favor, tente novamente mais tarde.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }

    const filteredOrders = window.orders.filter(order => 
        String(order['Order']).toLowerCase().includes(searchValue) ||
        String(order['Tracking Number']).toLowerCase().includes(searchValue) ||
        String(order['Reference Code']).toLowerCase().includes(searchValue)
    );

    if (filteredOrders.length > 0) {
        filteredOrders.forEach(order => {
            orderInfoDiv.innerHTML += `
                <div class="order-details mb-4 p-4 border border-gray-300 rounded">
                    <p><strong>Número do Pedido:</strong> ${order['Order']}</p>
                    <p><strong>Data de Criação:</strong> ${formatDate(order['Creation Date'])}</p>
                    <p><strong>Cidade/Estado:</strong> ${order['City']}/${order['UF']}</p>
                    <p><strong>Código do Produto:</strong> ${order['Reference Code']}</p>
                    <p><strong>Nome do Produto:</strong> ${order['SKU Name']}</p>
                    <p><strong>Quantidade:</strong> ${order['Quantity_SKU']}</p>
                    <p><strong>Número da Nota:</strong> ${order['Invoice Numbers']}</p>
                    <p><strong>Status:</strong> ${order['Status']}</p>
                    <p><strong>Courrier:</strong> ${order['Courrier']}</p>
                    <p><strong>Descontos:</strong> ${order['Discounts Names']}</p>
                    <br>
                    <p><strong>Valor total: R$</strong> ${order['Total Value']}
                </div>
            `;
        });
    } else {
        orderInfoDiv.innerHTML = '<p class="text-red-500">Nenhum pedido encontrado.</p>';
    }
}
