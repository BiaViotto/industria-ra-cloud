from flask import Flask, jsonify
from flask_cors import CORS
import paho.mqtt.client as mqtt
from datetime import datetime, timezone
import os
import threading
app = Flask(__name__)
# Permite que o frontend WebAR faça requisições para a API.
CORS(app)
ID_EQUIPAMENTO = "centro-usinagem-01"
TIPO_EQUIPAMENTO = "Centro de Usinagem"
SETOR_EQUIPAMENTO = "Usinagem"
STATUS_INICIAL = "aguardando"
MQTT_BROKER = os.getenv("MQTT_BROKER", "mosquitto")
MQTT_PORT = int(os.getenv("MQTT_PORT", "1883"))
TOPICO_TEMPERATURA = (
    f"industria/{ID_EQUIPAMENTO}/temperatura"
)
TOPICO_VIBRACAO = (
    f"industria/{ID_EQUIPAMENTO}/vibracao"
)
TOPICO_STATUS = (
    f"industria/{ID_EQUIPAMENTO}/status"
)
telemetria = {
    "temperatura": None,
    "vibracao": None,
    "status": STATUS_INICIAL,
    "atualizacao": None
}
telemetria_lock = threading.Lock()
def atualizar_timestamp():
    """
    Retorna a data e hora atual em formato ISO 8601 UTC.
    """

    return datetime.now(timezone.utc).isoformat()
def on_connect(client, userdata, flags, rc):
    """
    Executado quando a API consegue conectar ao broker MQTT.
    """
    if rc == 0:
        print("Conectado ao broker MQTT com sucesso.")
        # Inscreve a API nos três tópicos de telemetria.
        client.subscribe(TOPICO_TEMPERATURA)
        client.subscribe(TOPICO_VIBRACAO)
        client.subscribe(TOPICO_STATUS)
        print(f"Inscrito em: {TOPICO_TEMPERATURA}")
        print(f"Inscrito em: {TOPICO_VIBRACAO}")
        print(f"Inscrito em: {TOPICO_STATUS}")
    else:
        print(f"Erro ao conectar ao MQTT. Código: {rc}")
def on_message(client, userdata, message):
    """
    Executado sempre que uma nova mensagem MQTT é recebida.
    """
    global telemetria
    try:
        # Converte o payload recebido de bytes para texto.
        payload = message.payload.decode("utf-8")
        topico = message.topic
        print(
            f"Mensagem MQTT recebida: "
            f"{topico} -> {payload}"
        )

        # Protege a atualização da memória compartilhada.

        with telemetria_lock:

            if topico == TOPICO_TEMPERATURA:

                telemetria["temperatura"] = float(payload)

            elif topico == TOPICO_VIBRACAO:

                telemetria["vibracao"] = float(payload)

            elif topico == TOPICO_STATUS:

                telemetria["status"] = payload

            # Atualiza o horário da última mensagem recebida.

            telemetria["atualizacao"] = atualizar_timestamp()

    except ValueError:
        print(
            f"Valor inválido recebido no tópico {message.topic}: "
            f"{message.payload}"
        )

    except Exception as erro:
        print(f"Erro ao processar mensagem MQTT: {erro}")



mqtt_client = mqtt.Client()

mqtt_client.on_connect = on_connect

mqtt_client.on_message = on_message


@app.route(
    "/api/equipamentos/centro-usinagem-01",
    methods=["GET"]
)
def obter_equipamento():
    """
    Retorna informações básicas sobre o equipamento.
    """

    with telemetria_lock:

        status_atual = telemetria["status"]

    resposta = {
        "id": ID_EQUIPAMENTO,
        "tipo": TIPO_EQUIPAMENTO,
        "setor": SETOR_EQUIPAMENTO,
        "status": status_atual
    }

    return jsonify(resposta)

@app.route(
    "/api/equipamentos/centro-usinagem-01/telemetria",
    methods=["GET"]
)
def obter_telemetria():
    """
    Retorna os últimos dados recebidos pelo MQTT.
    """

    with telemetria_lock:

        resposta = {
            "temperatura": telemetria["temperatura"],
            "vibracao": telemetria["vibracao"],
            "status": telemetria["status"],
            "atualizacao": telemetria["atualizacao"]
        }

    return jsonify(resposta)

@app.route("/health", methods=["GET"])
def health():
    """
    Endpoint utilizado pelo Docker para verificar
    se a API está funcionando.
    """

    return jsonify({
        "status": "ok"
    })



def iniciar_mqtt():
    """
    Conecta a API ao broker MQTT e inicia o loop
    que recebe mensagens continuamente.
    """

    try:

        print(
            f"Tentando conectar ao MQTT em "
            f"{MQTT_BROKER}:{MQTT_PORT}..."
        )

        mqtt_client.connect(
            MQTT_BROKER,
            MQTT_PORT,
            60
        )

        # Mantém o cliente MQTT recebendo mensagens.

        mqtt_client.loop_start()

        print("Cliente MQTT iniciado.")

    except Exception as erro:

        print(
            f"Não foi possível conectar ao MQTT: {erro}"
        )


if __name__ == "__main__":

    iniciar_mqtt()

    print("API Flask iniciada.")

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=False
    )