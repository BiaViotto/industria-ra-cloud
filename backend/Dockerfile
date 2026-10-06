# Imagem oficial do Python
FROM python:3.12-slim

# Evita criação de arquivos .pyc
ENV PYTHONDONTWRITEBYTECODE=1

# Mostra os logs imediatamente no terminal
ENV PYTHONUNBUFFERED=1

# Diretório de trabalho dentro do container
WORKDIR /app

# Copia o arquivo de dependências
COPY requirements.txt .

# Instala as dependências
RUN pip install --no-cache-dir -r requirements.txt

# Copia o código da aplicação
COPY app.py .

# Expõe a porta utilizada pelo Flask
EXPOSE 5000

# Inicia a API
CMD ["python", "app.py"]