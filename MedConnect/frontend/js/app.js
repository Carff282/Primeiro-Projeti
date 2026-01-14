/* =============================================================
   MEDCONNECT - JavaScript Completo
   Sistema de gestão clínica com interatividade total
   ============================================================= */

// Aguardar carregamento completo da página
document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ MedConnect carregado!");

    const path = window.location.pathname;

    if (path.includes("index.html") || path.endsWith("/")) {
        iniciarLogin();
    } else if (path.includes("dashboard.html")) {
        verificarAutenticacao();
        iniciarDashboard();
    } else if (path.includes("prontuarios.html")) {
        verificarAutenticacao();
        iniciarProntuarios();
    } else if (path.includes("agendamentos.html")) {
        verificarAutenticacao();
        iniciarAgendamentos();
    }

    configurarLogout();
});

/* =============================================================
   SISTEMA DE AUTENTICAÇÃO
   ============================================================= */

function iniciarLogin() {
    const loginForm = document.getElementById("loginForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    if (!loginForm) return;

    emailInput?.addEventListener("input", limparErros);
    passwordInput?.addEventListener("input", limparErros);

    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = emailInput.value.trim();
        const senha = passwordInput.value.trim();

        if (!email || !senha) {
            mostrarErro("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        if (!validarEmail(email)) {
            mostrarErro("Por favor, digite um e-mail válido.");
            emailInput.focus();
            return;
        }

        if (senha.length < 6) {
            mostrarErro("A senha deve ter pelo menos 6 caracteres.");
            passwordInput.focus();
            return;
        }

        realizarLogin(email, senha);
    });

    console.log("📝 Sistema de login inicializado");
}

function realizarLogin(email, senha) {
    const usuario = {
        id: 1,
        nome: "Dr. João Silva",
        email: email,
        cargo: "Médico Responsável",
        avatar: "assets/avatar.png",
        dataLogin: new Date().toISOString()
    };

    localStorage.setItem("medconnect_user", JSON.stringify(usuario));
    localStorage.setItem("medconnect_token", "token_simulado_" + Date.now());

    const btnSubmit = document.querySelector(".btn-primary");
    btnSubmit.textContent = "Entrando...";
    btnSubmit.disabled = true;

    setTimeout(() => {
        window.location.href = "dashboard.html";
    }, 500);
}

function verificarAutenticacao() {
    const token = localStorage.getItem("medconnect_token");

    if (!token) {
        alert("⚠️ Você precisa fazer login primeiro!");
        window.location.href = "index.html";
        return false;
    }

    return true;
}

function configurarLogout() {
    const btnLogout = document.querySelector(".btn-logout");

    if (btnLogout) {
        btnLogout.addEventListener("click", function (e) {
            e.preventDefault();

            if (confirm("Deseja realmente sair do sistema?")) {
                localStorage.removeItem("medconnect_user");
                localStorage.removeItem("medconnect_token");
                window.location.href = "index.html";
            }
        });
    }
}

/* =============================================================
   DASHBOARD
   ============================================================= */

function iniciarDashboard() {
    carregarDadosUsuario();
    carregarEstatisticas();
    configurarNotificacoes();
    configurarAcoesTabela();

    console.log("📊 Dashboard inicializado");
}

function carregarDadosUsuario() {
    const usuario = JSON.parse(localStorage.getItem("medconnect_user"));

    if (usuario) {
        const nomeUsuario = document.querySelector(".user-name");
        const cargoUsuario = document.querySelector(".user-role");

        if (nomeUsuario) nomeUsuario.textContent = usuario.nome;
        if (cargoUsuario) cargoUsuario.textContent = usuario.cargo;
    }
}

function carregarEstatisticas() {
    const stats = {
        consultasHoje: 12,
        confirmadas: 8,
        pendentes: 4,
        prontuarios: 156
    };

    const statNumbers = document.querySelectorAll(".stat-number");

    if (statNumbers.length >= 4) {
        animarNumero(statNumbers[0], stats.consultasHoje);
        animarNumero(statNumbers[1], stats.confirmadas);
        animarNumero(statNumbers[2], stats.pendentes);
        animarNumero(statNumbers[3], stats.prontuarios);
    }
}

function animarNumero(elemento, valorFinal) {
    let valorAtual = 0;
    const incremento = Math.ceil(valorFinal / 20);

    const intervalo = setInterval(() => {
        valorAtual += incremento;

        if (valorAtual >= valorFinal) {
            elemento.textContent = valorFinal;
            clearInterval(intervalo);
        } else {
            elemento.textContent = valorAtual;
        }
    }, 50);
}

function configurarNotificacoes() {
    const btnNotificacoes = document.querySelector(".btn-secondary");

    if (btnNotificacoes && btnNotificacoes.textContent.includes("Notificações")) {
        btnNotificacoes.addEventListener("click", function () {
            alert(
                "🔔 Você tem 3 notificações:\n\n1. Maria Silva confirmou consulta\n2. João Santos cancelou consulta\n3. Novo prontuário pendente"
            );
        });
    }
}

function configurarAcoesTabela() {
    const botoesVer = document.querySelectorAll(".btn-icon[aria-label*='Visualizar']");
    const botoesEditar = document.querySelectorAll(".btn-icon[aria-label*='Editar']");

    botoesVer.forEach(btn => {
        btn.addEventListener("click", function () {
            const linha = this.closest("tr");
            const paciente = linha.querySelector("td").textContent;
            alert(`👁️ Visualizando prontuário de: ${paciente}`);
        });
    });

    botoesEditar.forEach(btn => {
        btn.addEventListener("click", function () {
            const linha = this.closest("tr");
            const paciente = linha.querySelector("td").textContent;
            alert(`✏️ Editando consulta de: ${paciente}`);
        });
    });
}

/* =============================================================
   PRONTUÁRIOS
   ============================================================= */

function iniciarProntuarios() {
    carregarDadosUsuario();
    configurarBusca();
    configurarAcoesProntuarios();
    configurarNovoProntuario();

    console.log("📋 Página de prontuários inicializada");
}

function configurarBusca() {
    const searchInput = document.getElementById("search-paciente");
    const cards = document.querySelectorAll(".prontuario-card");

    if (!searchInput || cards.length === 0) return;

    searchInput.addEventListener("input", function () {
        const termo = this.value.toLowerCase().trim();
        let encontrados = 0;

        cards.forEach(card => {
            const nome = card.querySelector("h3").textContent.toLowerCase();
            const sintomas = card.querySelector(".prontuario-body").textContent.toLowerCase();

            if (nome.includes(termo) || sintomas.includes(termo)) {
                card.style.display = "block";
                encontrados++;
            } else {
                card.style.display = "none";
            }
        });

        if (termo && encontrados === 0) {
            mostrarMensagemBusca("Nenhum prontuário encontrado com o termo: " + termo);
        } else {
            removerMensagemBusca();
        }
    });
}

function configurarAcoesProntuarios() {
    const btnsPDF = document.querySelectorAll(".btn-secondary[aria-label*='PDF']");
    btnsPDF.forEach(btn => {
        btn.addEventListener("click", function () {
            const card = this.closest(".prontuario-card");
            const paciente = card.querySelector("h3").textContent;
            alert(`📄 Baixando PDF do prontuário de: ${paciente}\n\n(Funcionalidade será implementada com o backend)`);
        });
    });

    const btnsEditar = document.querySelectorAll(".btn-secondary[aria-label*='Editar']");
    btnsEditar.forEach(btn => {
        btn.addEventListener("click", function () {
            const card = this.closest(".prontuario-card");
            const paciente = card.querySelector("h3").textContent;
            alert(`✏️ Editando prontuário de: ${paciente}\n\n(Funcionalidade será implementada com o backend)`);
        });
    });

    const btnsImprimir = document.querySelectorAll(".btn-secondary[aria-label*='Imprimir']");
    btnsImprimir.forEach(btn => {
        btn.addEventListener("click", function () {
            window.print();
        });
    });
}

function configurarNovoProntuario() {
    const btnNovo = document.querySelector(".btn-primary");

    if (btnNovo && btnNovo.textContent.includes("Novo Prontuário")) {
        btnNovo.addEventListener("click", function () {
            alert("➕ Criando novo prontuário...\n\n(Funcionalidade será implementada com o backend)");
        });
    }
}

function mostrarMensagemBusca(mensagem) {
    removerMensagemBusca();

    const section = document.querySelector(".prontuarios-grid");
    const msg = document.createElement("div");
    msg.className = "mensagem-busca";
    msg.style.cssText =
        "grid-column: 1/-1; text-align: center; padding: 40px; color: #64748b; font-size: 18px;";
    msg.textContent = mensagem;

    section.appendChild(msg);
}

function removerMensagemBusca() {
    const msg = document.querySelector(".mensagem-busca");
    if (msg) msg.remove();
}

/* =============================================================
   AGENDAMENTOS
   ============================================================= */

function iniciarAgendamentos() {
    carregarDadosUsuario();
    configurarCalendario();
    configurarNovaConsulta();

    console.log("📅 Página de agendamentos inicializada");
}

function configurarCalendario() {
    const dias = document.querySelectorAll(".calendar-day:not(.header)");
    const tituloConsultas = document.getElementById("consultas-dia-heading");
    const timeline = document.querySelector(".timeline");

    if (!dias.length || !timeline) return;

    dias.forEach(dia => {
        if (dia.textContent.trim() === "") return;

        dia.addEventListener("click", function () {
            dias.forEach(d => d.classList.remove("today"));
            this.classList.add("today");

            const numeroDia = this.textContent.trim().replace(/[^0-9]/g, "");

            if (tituloConsultas) {
                tituloConsultas.textContent = `Consultas de ${numeroDia}/11/2025`;
            }

            gerarConsultasDoDia(numeroDia, timeline);
        });
    });
}

function gerarConsultasDoDia(dia, timeline) {
    const consultas = [
        {
            hora: "09:00",
            paciente: "Maria Silva",
            tipo: "Consulta de rotina",
            status: "success",
            statusTexto: "Confirmado"
        },
        {
            hora: "10:30",
            paciente: "João Santos",
            tipo: "Retorno pós-cirúrgico",
            status: "warning",
            statusTexto: "Pendente"
        },
        {
            hora: "14:00",
            paciente: "Ana Costa",
            tipo: "Primeira consulta",
            status: "success",
            statusTexto: "Confirmado"
        }
    ];

    timeline.innerHTML = "";

    consultas.forEach(consulta => {
        const item = document.createElement("li");
        item.className = "timeline-item";
        item.setAttribute("role", "listitem");

        item.innerHTML = `
            <time class="timeline-time" datetime="${consulta.hora}">${consulta.hora}</time>
            <div class="timeline-content">
                <h3>${consulta.paciente}</h3>
                <p>${consulta.tipo}</p>
                <span class="badge badge-${consulta.status}" aria-label="Consulta ${consulta.statusTexto.toLowerCase()}">
                    ${consulta.statusTexto}
                </span>
            </div>
        `;

        timeline.appendChild(item);
    });
}

function configurarNovaConsulta() {
    const btnNova = document.querySelector(".btn-primary");

    if (btnNova && btnNova.textContent.includes("Nova Consulta")) {
        btnNova.addEventListener("click", function () {
            alert("➕ Agendando nova consulta...\n\n(Funcionalidade será implementada com o backend)");
        });
    }
}

/* =============================================================
   FUNÇÕES AUXILIARES
   ============================================================= */

function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function mostrarErro(mensagem) {
    let errorDiv = document.querySelector(".error-message");

    if (!errorDiv) {
        errorDiv = document.createElement("div");
        errorDiv.className = "error-message";
        errorDiv.style.cssText = `
            background-color: #fee2e2;
            color: #991b1b;
            padding: 12px 16px;
            border-radius: 8px;
            margin-bottom: 16px;
            font-weight: 600;
            border: 2px solid #ef4444;
        `;

        const form = document.getElementById("loginForm");
        form.insertBefore(errorDiv, form.firstChild);
    }

    errorDiv.textContent = mensagem;
    errorDiv.style.display = "block";
    errorDiv.setAttribute("role", "alert");

    setTimeout(() => {
        errorDiv.style.display = "none";
    }, 5000);
}

function limparErros() {
    const errorDiv = document.querySelector(".error-message");
    if (errorDiv) errorDiv.style.display = "none";
}

/* =============================================================
   ACESSIBILIDADE - NAVEGAÇÃO POR TECLADO
   ============================================================= */

document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
        const modais = document.querySelectorAll(".modal");
        modais.forEach(modal => (modal.style.display = "none"));
    }

    if (e.ctrlKey && e.key === "k") {
        e.preventDefault();
        const searchInput = document.getElementById("search-paciente");
        if (searchInput) searchInput.focus();
    }
});

console.log("🚀 MedConnect JavaScript carregado com sucesso!");
