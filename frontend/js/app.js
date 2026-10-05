const CONFIG = {
    ID_EQUIPAMENTO: "centro-usinagem-01",
    API_BASE_URL: "http://localhost:5000",
    TIMEOUT: 8000
};

const infoPanel = document.getElementById("info-panel");
const infoTitle = document.getElementById("info-title");
const infoContent = document.getElementById("info-content");
const closePanel = document.getElementById("close-panel");
const targetStatus = document.getElementById("target-status");
const connectionStatus = document.getElementById("connection-status");

const STATIC_CONTENT = {
    painel: {
        title: "1 - Painel de Controle",
        content:
            "<h3>Painel de Controle</h3>" +
            "<p>O painel de controle permite ao operador acompanhar e comandar as principais funções do centro de usinagem.</p>" +
            "<p>Por meio do painel, podem ser configurados parâmetros do processo, programas de usinagem e informações operacionais da máquina.</p>"
    },

    usinagem: {
        title: "2 - Area de Usinagem",
        content:
            "<h3>Area de Usinagem</h3>" +
            "<p>A area de usinagem e a regiao onde ocorre o processo de remocao de material.</p>" +
            "<p>Nessa regiao ficam os elementos responsaveis pela execucao do processo, incluindo a ferramenta e a peca que esta sendo trabalhada.</p>" +
            "<p>Durante a operacao, e importante observar as condicoes de seguranca e seguir os procedimentos definidos para a maquina.</p>"
    },

    magazine: {
        title: "3 - Magazine de Ferramentas",
        content:
            "<h3>Magazine de Ferramentas</h3>" +
            "<p>O magazine e responsavel pelo armazenamento das ferramentas utilizadas nos processos de usinagem.</p>" +
            "<p>O sistema permite que diferentes ferramentas sejam selecionadas conforme as etapas programadas para a operacao.</p>" +
            "<p>A organizacao e conservacao das ferramentas sao importantes para garantir a qualidade do processo.</p>"
    }
};

function abrirPainel(titulo, conteudo) {
    infoTitle.textContent = titulo;
    infoContent.innerHTML = conteudo;
    infoPanel.classList.remove("hidden");
}

function fecharPainel() {
    infoPanel.classList.add("hidden");
}

closePanel.addEventListener("click", fecharPainel);

infoPanel.addEventListener("click", function(event) {
    if (event.target === infoPanel) {
        fecharPainel();
    }
});

function configurarHotspots() {
    const hotspots = document.querySelectorAll(".hotspot");

    hotspots.forEach(function(hotspot) {

        hotspot.addEventListener("pointerup", async function(event) {

            event.stopPropagation();

            const topic = hotspot.dataset.topic;

            if (STATIC_CONTENT[topic]) {
                abrirPainel(
                    STATIC_CONTENT[topic].title,
                    STATIC_CONTENT[topic].content
                );

                return;
            }

            if (topic === "telemetria") {
                await carregarTelemetria();
            }
        });
    });
}

async function carregarTelemetria() {

    abrirPainel(
        "4 - Monitoramento",
        "<h3>Consultando dados...</h3>" +
        "<p>Aguarde enquanto os dados operacionais do equipamento sao consultados.</p>"
    );

    const endpoint =
        CONFIG.API_BASE_URL +
        "/api/equipamentos/" +
        CONFIG.ID_EQUIPAMENTO +
        "/telemetria";

    const controller = new AbortController();

    const timeout = setTimeout(function() {
        controller.abort();
    }, CONFIG.TIMEOUT);

    try {

        const response = await fetch(
            endpoint,
            {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                },
                signal: controller.signal
            }
        );

        clearTimeout(timeout);

        if (!response.ok) {
            throw new Error("Erro HTTP " + response.status);
        }

        const dados = await response.json();

        exibirTelemetria(dados);

    } catch (error) {

        clearTimeout(timeout);

        console.error("Erro ao consultar a API:", error);

        exibirErroAPI();
    }
}

function exibirTelemetria(dados) {

    const temperatura =
        dados.temperatura !== undefined
            ? dados.temperatura
            : "--";

    const vibracao =
        dados.vibracao !== undefined
            ? dados.vibracao
            : "--";

    const status =
        dados.status !== undefined
            ? dados.status
            : "Nao informado";

    const atualizacao =
        dados.atualizacao !== undefined
            ? dados.atualizacao
            : "--";

    const conteudo =
        "<h3>Dados operacionais</h3>" +
        "<p>Informacoes mais recentes recebidas do equipamento.</p>" +

        "<div class=\"telemetry-grid\">" +

        "<div class=\"telemetry-item\">" +
        "<span class=\"telemetry-label\">Temperatura</span>" +
        "<span class=\"telemetry-value\">" +
        temperatura +
        " °C</span>" +
        "</div>" +

        "<div class=\"telemetry-item\">" +
        "<span class=\"telemetry-label\">Vibracao</span>" +
        "<span class=\"telemetry-value\">" +
        vibracao +
        " mm/s</span>" +
        "</div>" +

        "</div>" +

        "<div class=\"machine-status\">" +
        "Status: <strong>" +
        status +
        "</strong>" +
        "</div>" +

        "<div class=\"last-update\">" +
        "Ultima atualizacao: " +
        atualizacao +
        "</div>";

    abrirPainel(
        "4 - Monitoramento",
        conteudo
    );
}

function exibirErroAPI() {

    abrirPainel(
        "4 - Monitoramento",
        "<h3>Dados indisponiveis</h3>" +
        "<div class=\"api-error\">" +
        "Nao foi possivel consultar os dados do equipamento.<br>" +
        "Verifique a disponibilidade do servico e tente novamente." +
        "</div>"
    );
}

function configurarTarget() {

    const target = document.querySelector(
        "[mindar-image-target]"
    );

    if (!target) {
        console.error("Target MindAR nao encontrado.");
        return;
    }

    target.addEventListener(
        "targetFound",
        function() {

            targetStatus.textContent =
                "Equipamento reconhecido";

            connectionStatus.textContent =
                "RA ativa - selecione um ponto";

            connectionStatus.classList.remove(
                "hidden"
            );

            setTimeout(function() {

                connectionStatus.classList.add(
                    "hidden"
                );

            }, 2500);
        }
    );
    target.addEventListener(
        "targetLost",
        function() {

            targetStatus.textContent =
                "Aponte para o equipamento";

            connectionStatus.textContent =
                "Target nao identificado";

            connectionStatus.classList.remove("connected");
            connectionStatus.classList.add("disconnected");
        }
    )
}
