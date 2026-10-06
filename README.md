### Cenário IaaS

No cenário em que a empresa contrata uma máquina virtual Linux e instala
Docker, Flask e MQTT, o modelo utilizado é o IaaS (Infrastructure as a
Service).

Nesse modelo, o provedor de nuvem disponibiliza recursos de infraestrutura,
como máquinas virtuais, armazenamento, rede e recursos computacionais.

A empresa continua responsável pela administração do sistema operacional,
configuração do ambiente, instalação e atualização do Docker, configuração
do Flask, Broker MQTT, aplicações, usuários, permissões e dados.

No projeto, esse cenário seria semelhante à contratação de uma VM Linux
para executar os containers da API Flask, Mosquitto e simulador de
telemetria.

### Cenário PaaS

No cenário em que a equipe envia a aplicação para uma plataforma que
administra a infraestrutura e a execução da aplicação, o modelo é PaaS
(Platform as a Service).

Nesse modelo, o provedor de nuvem administra grande parte da infraestrutura
necessária para executar a aplicação.

A equipe deixa de se preocupar diretamente com tarefas como gerenciamento
do servidor físico, sistema operacional, atualizações da infraestrutura,
configuração de máquinas virtuais e parte do gerenciamento do ambiente de
execução.

A equipe passa a concentrar seus esforços principalmente no desenvolvimento,
configuração e manutenção da aplicação e dos dados utilizados por ela.

### Cenário SaaS

No cenário em que o técnico apenas acessa uma aplicação pronta pelo
navegador, a solução se aproxima do modelo SaaS (Software as a Service).

Nesse modelo, o usuário utiliza diretamente um software disponibilizado
pelo provedor, normalmente por meio de um navegador ou aplicativo, sem
precisar instalar ou administrar a infraestrutura responsável pela execução.

No projeto, o técnico poderia acessar uma aplicação de manutenção pelo
navegador e visualizar informações do Centro de Usinagem, sem precisar
conhecer ou administrar o servidor Flask, o Broker MQTT, os containers ou
a infraestrutura de nuvem.

Do ponto de vista do usuário final, ele está consumindo um serviço de
software pronto.

### Qual problema o container resolve neste projeto além de "executar o Flask"?

O container resolve principalmente o problema de padronização, isolamento,
portabilidade e reprodução do ambiente da aplicação.

Neste projeto existem diferentes componentes, como a API Flask, o Broker
MQTT Mosquitto e o simulador de telemetria em Python. Cada componente possui
suas próprias dependências e responsabilidades.

Sem containers, seria necessário instalar e configurar manualmente Python,
Flask, bibliotecas Python, Mosquitto, configurações do Broker e outras
dependências no computador de cada integrante da equipe. Isso poderia
causar problemas relacionados a versões diferentes, configurações
incorretas e dependências ausentes.

Com Docker, cada serviço possui seu próprio ambiente isolado e configurado.
O Dockerfile da API define qual versão do Python será utilizada e quais
bibliotecas precisam ser instaladas. O mesmo acontece com o simulador.

O Docker Compose complementa essa solução ao permitir que os serviços sejam
executados de forma integrada. Ele cria a rede entre os containers e permite
que a API encontre o Broker MQTT pelo nome do serviço "mosquitto", sem
depender do endereço IP específico de uma máquina.

Portanto, o container não serve apenas para executar o Flask. Ele permite
reproduzir o mesmo ambiente em diferentes computadores, isolar serviços,
controlar dependências, facilitar a implantação e reduzir o problema de
"na minha máquina funciona".

No contexto deste projeto, isso é especialmente importante porque a solução
possui vários componentes que precisam funcionar juntos: frontend WebAR,
API Flask, Broker MQTT e simulador de telemetria.
