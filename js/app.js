document.addEventListener("DOMContentLoaded", function () {

    const target = document.querySelector("#target");

    const targetStatus =
        document.querySelector("#target-status");

    const connectionStatus =
        document.querySelector("#connection-status");

    const infoPanel =
        document.querySelector("#info-panel");

    const infoTitle =
        document.querySelector("#info-title");

    const infoText =
        document.querySelector("#info-text");

    const closeInfo =
        document.querySelector("#close-info");

    const hotspots =
        document.querySelectorAll(".hotspot");


    function showInfo(title, text) {

        infoTitle.textContent = title;

        infoText.textContent = text;

        infoPanel.classList.add("active");

    }


    function hideInfo() {

        infoPanel.classList.remove("active");

    }


    hotspots.forEach(function (hotspot) {

        hotspot.addEventListener(
            "click",
            function () {

                const type =
                    hotspot.dataset.type;


                if (type === "painel") {

                    showInfo(
                        "Painel de Controle",
                        "Area responsavel pelo comando e monitoramento do centro de usinagem."
                    );

                }


                if (type === "usinagem") {

                    showInfo(
                        "Area de Usinagem",
                        "Regiao onde ocorre o processo de fabricacao e remocao de material."
                    );

                }


                if (type === "magazine") {

                    showInfo(
                        "Magazine de Ferramentas",
                        "Sistema responsavel pelo armazenamento e troca automatica das ferramentas."
                    );

                }


                if (type === "telemetria") {

                    showInfo(
                        "Telemetria",
                        "Area destinada a apresentacao dos dados do equipamento."
                    );

                }

            }
        );

    });


    closeInfo.addEventListener(
        "click",
        function () {

            hideInfo();

        }
    );


    target.addEventListener(
        "targetFound",
        function () {

            targetStatus.textContent =
                "Equipamento identificado";

            connectionStatus.textContent =
                "Target identificado";

        }
    );


    target.addEventListener(
        "targetLost",
        function () {

            targetStatus.textContent =
                "Aponte para o equipamento";

            connectionStatus.textContent =
                "Target nao identificado";

        }
    );


    connectionStatus.textContent =
        "Inicializando camera";

});