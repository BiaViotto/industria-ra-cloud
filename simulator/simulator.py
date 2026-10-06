import paho.mqtt.client as mqtt
import random
import time
from datetime import datetime, timezone
import os


# ============================================================
# CONFIGURAÇÃO
# ============================================================

MQTT_BROKER = os.getenv(
    "MQTT_BROKER",
    "mosquitto"
)

MQTT_PORT = int(
    os.getenv(
        "MQTT_PORT",
        "1883"
    )
)

ID_EQUIPAMENTO = "centro-usinagem-01"


# ============================================================
# TÓPICOS MQTT
# ============================================================

TOPICO_TEMPERATURA = (
    f"industria/{ID_EQUIPAMENTO}/temperatura"
)

TOPICO_VIBRACAO = (
    f"industria/{ID_EQUIPAMENTO}/vibracao"
)

TOPICO_STATUS = (
    f"industria/{ID_EQUIPAMENTO}/status"
)


# ============================================================
# CALLBACK DE CONEXÃO
# ============================================================

def on_connect(client, userdata, flags, rc):

    if rc == 0:

        print(
            "Simulador conectado ao broker MQTT."
        )

    else:

        print(
            f"Erro ao conectar ao MQTT. Código: {rc}"
        )


# ============================================================
# CLIENTE MQTT
# ============================================================

client = mqtt.Client()

client.on_connect = on_connect


# ============================================================
# CONEXÃO
# ============================================================

print(
    f"Conectando ao broker MQTT "
    f"{MQTT_BROKER}:{MQTT_PORT}..."
)

client.connect(
    MQTT_BROKER,
    MQTT_PORT,
    60
)

client.loop_start()


# ============================================================
# LOOP PRINCIPAL
# ============================================================

try:

    while True:

        # Gera temperatura entre 35 e 55 °C.

        temperatura = round(
            random.uniform(35.0, 55.0),
            2
        )

        # Gera vibração entre 1 e 4 mm/s.

        vibracao = round(
            random.uniform(1.0, 4.0),
            2
        )

        # Status do equipamento.

        status = "operando"

        # Horário local apenas para exibição no console.

        atualizacao = datetime.now(
            timezone.utc
        ).isoformat()

        # Publica temperatura.

        client.publish(
            TOPICO_TEMPERATURA,
            str(temperatura)
        )

        # Publica vibração.

        client.publish(
            TOPICO_VIBRACAO,
            str(vibracao)
        )

        # Publica status.

        client.publish(
            TOPICO_STATUS,
            status
        )

        print(
            "----------------------------------------"
        )

        print(
            f"Equipamento: {ID_EQUIPAMENTO}"
        )

        print(
            f"Temperatura: {temperatura} °C"
        )

        print(
            f"Vibração: {vibracao} mm/s"
        )

        print(
            f"Status: {status}"
        )

        print(
            f"Atualização: {atualizacao}"
        )

        print(
            "Dados publicados no MQTT."
        )

        # Aguarda 5 segundos.

        time.sleep(5)


except KeyboardInterrupt:

    print(
        "Simulador encerrado."
    )

finally:

    client.loop_stop()

    client.disconnect()