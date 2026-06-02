/**
 * A'Veloz Performance Hub v1.0
 * Sistema de Ranking de Vendedores com Integração Google Sheets
 */

// ===== CONFIGURAÇÃO =====
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTNIKV5qC2ng7Kb34hKF46UHIXDsIvYdcUMAIDnYlex_rSEki8FLSmRzRDrNv1atUyk8cEzZPrzIA2l/pub?output=csv'; // Substituir pelo link da planilha publicada em CSV

// Tabela de Pontuação
const TABELA_PONTOS = {
    1: 10,
    2: 8,
    3: 6,
    4: 4,
    5: 2
};

let todosOsDados = [];
let vendedoresGeral = {};

// ===== FUNÇÕES AUXILIARES =====
function parseCSV(text) {
    const regex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;
    const separator = text.includes(';') ? ';' : regex;
    return text.split(separator).map(v => v.replace(/^"|"$/g, '').trim());
}

function obterMesAtual() {
    const meses = ['janeiro', 'fevereiro', 'marco', 'abril', 'maio', 'junho', 
                   'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    return meses[new Date().getMonth()];
}

// ===== CARREGAMENTO DE DADOS =====
async function carregarDados() {
    try {
        const response = await fetch(SHEET_URL);
        const data = await response.text();
        const linhas = data.split(/\r?\n/).filter(l => l.trim() !== "").slice(1);

        todosOsDados = linhas.map(linha => {
            const colunas = parseCSV(linha);
            if (colunas.length >= 6) {
                return {
                    mes: colunas[0].toLowerCase(),
                    vendedor: colunas[1],
                    posicao: parseInt(colunas[2]) || 0,
                    faturamento: colunas[3],
                    destaque_novos: colunas[4].toLowerCase() === 'sim',
                    destaque_reativacao: colunas[5].toLowerCase() === 'sim'
                };
            }
            return null;
        }).filter(d => d && d.vendedor);

        // Calcular pontuação geral
        calcularPontuacaoGeral();
        
        // Renderizar dados
        renderizarPodio();
        renderizarRankingGeral();
        renderizarDestaques();

    } catch (error) {
        console.error("Erro ao carregar dados:", error);
        document.getElementById('podio-grid').innerHTML = 
            '<p style="grid-column:1/-1; text-align:center;">Erro ao carregar dados da planilha.</p>';
    }
}

// ===== CÁLCULO DE PONTUAÇÃO =====
// ===== CÁLCULO DE PONTUAÇÃO =====
function calcularPontuacaoGeral() {
    vendedoresGeral = {};

    todosOsDados.forEach(dado => {
        if (!vendedoresGeral[dado.vendedor]) {
            vendedoresGeral[dado.vendedor] = {
                nome: dado.vendedor,
                pontos: 0,
                posicoes: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
                destaques_novos: 0,
                destaques_reativacao: 0
            };
        }

        // 1. Adicionar pontos por posição no ranking
        if (dado.posicao >= 1 && dado.posicao <= 5) {
            vendedoresGeral[dado.vendedor].pontos += TABELA_PONTOS[dado.posicao];
            vendedoresGeral[dado.vendedor].posicoes[dado.posicao]++;
        }

        // 2. Adicionar pontos extras por destaques (+2 pontos cada)
        if (dado.destaque_novos) {
            vendedoresGeral[dado.vendedor].destaques_novos++;
            vendedoresGeral[dado.vendedor].pontos += 2; // Bônus Novos Clientes
        }
        
        if (dado.destaque_reativacao) {
            vendedoresGeral[dado.vendedor].destaques_reativacao++;
            vendedoresGeral[dado.vendedor].pontos += 2; // Bônus Reativação
        }
    });
}


// ===== RENDERIZAÇÃO DO PÓDIO =====
function renderizarPodio() {
    const mesSelecionado = document.getElementById('mes-selector').value || obterMesAtual();
    const dadosMes = todosOsDados.filter(d => d.mes === mesSelecionado);

    // Ordenar por posição
    dadosMes.sort((a, b) => a.posicao - b.posicao);

    const grid = document.getElementById('podio-grid');
    grid.innerHTML = '';

    if (dadosMes.length === 0) {
        grid.innerHTML = '<p style="grid-column:1/-1; text-align:center;">Nenhum dado para este mês.</p>';
        document.getElementById('titulo-mes').textContent = `Destaques de ${mesSelecionado.charAt(0).toUpperCase() + mesSelecionado.slice(1)}`;
        return;
    }

    dadosMes.forEach((dado, index) => {
        const card = document.createElement('div');
        card.className = `podio-card ${index === 0 ? 'primeiro' : index === 1 ? 'segundo' : index === 2 ? 'terceiro' : ''}`;

        let destaques = '';
        if (dado.destaque_novos) destaques += '<span class="destaque-badge novos">🌟 Novos Clientes</span>';
        if (dado.destaque_reativacao) destaques += '<span class="destaque-badge reativacao">♻️ Reativação</span>';

        const fotoUrl = `img/${dado.vendedor.toLowerCase()}.jpg`;
        
        card.innerHTML = `
            <div class="posicao-badge">${dado.posicao}º</div>
            <div class="vendedor-foto-container">
                <img src="${fotoUrl}" alt="${dado.vendedor}" onerror="this.src='https://via.placeholder.com/100?text=${dado.vendedor.charAt(0)}'">
            </div>
            <h3 class="vendedor-nome">${dado.vendedor}</h3>
            <p class="vendedor-status">${dado.posicao === 1 ? '🥇 Líder de Vendas' : 'Destaque do Mês'}</p>
            ${destaques}
        `;

        grid.appendChild(card);
    });

    // Atualizar título
    const nomeMes = mesSelecionado.charAt(0).toUpperCase() + mesSelecionado.slice(1);
    document.getElementById('titulo-mes').textContent = `Destaques de ${nomeMes}`;

    // Atualizar destaques especiais
    const destaque_novos = dadosMes.find(d => d.destaque_novos);
    const destaque_reativacao = dadosMes.find(d => d.destaque_reativacao);

    document.getElementById('destaque-novos').textContent = destaque_novos ? destaque_novos.vendedor : 'Não definido';
    document.getElementById('destaque-reativacao').textContent = destaque_reativacao ? destaque_reativacao.vendedor : 'Não definido';
}

// ===== RENDERIZAÇÃO DO RANKING GERAL =====
function renderizarRankingGeral() {
    const vendedoresArray = Object.values(vendedoresGeral)
        .sort((a, b) => b.pontos - a.pontos);

    const tbody = document.getElementById('ranking-body');
    tbody.innerHTML = '';

    vendedoresArray.forEach((v, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${index + 1}º</strong></td>
            <td>${v.nome}</td>
            <td style="font-weight: 700; color: #E3C053;">${v.pontos} pts</td>
            <td>${v.posicoes[1]}</td>
            <td>${v.posicoes[2]}</td>
            <td>${v.posicoes[3]}</td>
        `;
        tbody.appendChild(tr);
    });
}

// ===== RENDERIZAÇÃO DE DESTAQUES =====
function renderizarDestaques() {
    const vendedoresArray = Object.values(vendedoresGeral)
        .sort((a, b) => b.destaques_novos - a.destaques_novos);

    const historicoNovos = document.getElementById('historico-novos');
    historicoNovos.innerHTML = '';
    vendedoresArray.forEach(v => {
        if (v.destaques_novos > 0) {
            const li = document.createElement('li');
            li.textContent = `${v.nome} - ${v.destaques_novos} vez(es)`;
            historicoNovos.appendChild(li);
        }
    });

    const vendedoresReativacao = Object.values(vendedoresGeral)
        .sort((a, b) => b.destaques_reativacao - a.destaques_reativacao);

    const historicoReativacao = document.getElementById('historico-reativacao');
    historicoReativacao.innerHTML = '';
    vendedoresReativacao.forEach(v => {
        if (v.destaques_reativacao > 0) {
            const li = document.createElement('li');
            li.textContent = `${v.nome} - ${v.destaques_reativacao} vez(es)`;
            historicoReativacao.appendChild(li);
        }
    });
}

// ===== GERENCIAMENTO DE ABAS =====
document.addEventListener('DOMContentLoaded', () => {
    // Carregar dados
    carregarDados();

    // Configurar abas
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.getAttribute('data-tab');

            // Remover ativo de todos
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Adicionar ativo ao clicado
            btn.classList.add('active');
            document.getElementById(tabName).classList.add('active');
        });
    });

    // Filtro de mês
    document.getElementById('mes-selector').addEventListener('change', () => {
        renderizarPodio();
    });
});
