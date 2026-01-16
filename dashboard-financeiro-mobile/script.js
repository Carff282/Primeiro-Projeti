const form = document.getElementById('finance-form');
const monthSelect = document.getElementById('month');
const categoriaInput = document.getElementById('categoria');
const saidaInput = document.getElementById('saida');
const chartTypeSelect = document.getElementById('chartType');
const tableBody = document.querySelector('#finance-table tbody');
const saldoCard = document.getElementById('saldoCard');
const receitaCard = document.getElementById('receitaCard');
const despesaCard = document.getElementById('despesaCard');
const categoriasLista = document.getElementById('categorias-lista');
const receitaInicialInput = document.getElementById('receitaInicial');
const btnSetReceita = document.getElementById('btnSetReceita');
const btnTema = document.getElementById('btnTema');
const mesReceitaSelect = document.getElementById('mesReceita');
const receitaInicialMesInput = document.getElementById('receitaInicialMes');
const btnSetReceitaMes = document.getElementById('btnSetReceitaMes');

let dadosFinanceiros = {};
let receitaInicial = 0;
let receitasIniciais = {};

form.addEventListener('submit', function(e) {
    e.preventDefault();
    const mes = monthSelect.value;
    const categoria = categoriaInput.value;
    const saida = parseFloat(saidaInput.value);
    if (!dadosFinanceiros[mes]) dadosFinanceiros[mes] = [];
    dadosFinanceiros[mes].push({ saida, categoria });
    atualizarCards();
    atualizarTabela();
    atualizarPieChart();
    atualizarCategorias();
    feedbackAdicao();
    form.reset();
});

btnSetReceita.addEventListener('click', function() {
    let valor = receitaInicialInput.value.replace(/\./g, '').replace(/,/g, '.');
    receitaInicial = parseFloat(valor) || 0;
    atualizarCards();
});

monthSelect.addEventListener('change', function() {
    atualizarCards();
});
btnSetReceitaMes.addEventListener('click', function(e) {
    e.preventDefault();
    const mes = mesReceitaSelect.value;
    let valor = receitaInicialMesInput.value.replace(/\./g, '').replace(/,/g, '.');
    receitasIniciais[mes] = parseFloat(valor) || 0;
    // Troca o mês selecionado nos cards para o mês definido
    monthSelect.value = mes;
    atualizarCards();
    atualizarTabela();
    atualizarPieChart();
    atualizarCategorias();
});

btnTema.addEventListener('click', function() {
    document.body.classList.toggle('tema-claro');
    if (document.body.classList.contains('tema-claro')) {
        btnTema.innerHTML = '<i class="fa-solid fa-moon"></i>';
    } else {
        btnTema.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }
});

function atualizarCards() {
    // Garante que o mês selecionado está sincronizado com o mês da receita definida
    const mesAtual = monthSelect.value;
    let receitaTotal = receitasIniciais[mesAtual] !== undefined ? receitasIniciais[mesAtual] : 0;
    let despesaTotal = 0;
    if (dadosFinanceiros[mesAtual]) {
        dadosFinanceiros[mesAtual].forEach(item => {
            despesaTotal += item.saida;
        });
    }
    saldoCard.textContent = `R$ ${(receitaTotal - despesaTotal).toLocaleString('pt-BR', {minimumFractionDigits:2})}`;
    receitaCard.textContent = `R$ ${receitaTotal.toLocaleString('pt-BR', {minimumFractionDigits:2})}`;
    despesaCard.textContent = `R$ ${despesaTotal.toLocaleString('pt-BR', {minimumFractionDigits:2})}`;
}

function atualizarTabela() {
    tableBody.innerHTML = '';
    Object.keys(dadosFinanceiros).forEach(mes => {
        let saidaTotal = 0;
        let categorias = [];
        dadosFinanceiros[mes].forEach(item => {
            saidaTotal += item.saida;
            categorias.push(item.categoria);
        });
        const receitaMes = receitasIniciais[mes] || 0;
        const saldoTotal = receitaMes - saidaTotal;
        const row = `<tr>
            <td>${mes}</td>
            <td>R$ ${receitaMes.toLocaleString('pt-BR', {minimumFractionDigits:2})}</td>
            <td>R$ ${saidaTotal.toLocaleString('pt-BR', {minimumFractionDigits:2})}</td>
            <td>R$ ${saldoTotal.toLocaleString('pt-BR', {minimumFractionDigits:2})}</td>
            <td>${categorias.join(', ')}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

let pieChart;
function atualizarPieChart() {
    const categorias = {};
    Object.values(dadosFinanceiros).forEach(arr => {
        arr.forEach(item => {
            if (!categorias[item.categoria]) categorias[item.categoria] = 0;
            categorias[item.categoria] += item.saida;
        });
    });
    const catNomes = Object.keys(categorias);
    const catValores = Object.values(categorias);
    const cores = ['#e74c3c','#f1c40f','#3498db','#9b59b6','#2ecc71','#52be80'];
    const ctx = document.getElementById('pieChart').getContext('2d');
    if (pieChart) pieChart.destroy();
    pieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: catNomes,
            datasets: [{
                data: catValores,
                backgroundColor: cores.slice(0, catNomes.length)
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' },
                title: {
                    display: false
                }
            }
        }
    });
}

function atualizarCategorias() {
    categoriasLista.innerHTML = '';
    const categorias = {};
    Object.values(dadosFinanceiros).forEach(arr => {
        arr.forEach(item => {
            if (!categorias[item.categoria]) categorias[item.categoria] = 0;
            categorias[item.categoria] += item.saida;
        });
    });
    Object.entries(categorias).forEach(([cat, valor]) => {
        categoriasLista.innerHTML += `<li><span class="cat-nome">${cat}</span><span class="cat-valor">R$ ${valor.toLocaleString('pt-BR', {minimumFractionDigits:2})}</span></li>`;
    });
}

function feedbackAdicao() {
    saldoCard.parentElement.classList.add('ativo');
    let aviso = document.createElement('div');
    aviso.textContent = 'Saída adicionada!';
    aviso.style.position = 'fixed';
    aviso.style.top = '16px';
    aviso.style.left = '50%';
    aviso.style.transform = 'translateX(-50%)';
    aviso.style.background = '#2ecc71';
    aviso.style.color = '#fff';
    aviso.style.padding = '10px 24px';
    aviso.style.borderRadius = '8px';
    aviso.style.fontWeight = 'bold';
    aviso.style.zIndex = '999';
    document.body.appendChild(aviso);
    setTimeout(() => {
        saldoCard.parentElement.classList.remove('ativo');
        aviso.remove();
    }, 900);
}

// Inicialização
atualizarCards();
atualizarTabela();
atualizarPieChart();
atualizarCategorias();
