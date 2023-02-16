#!/bin/bash
echo 'EXECUTANDO ENTRYPOINT';

if ! [ -d node_modules ]; then # se não tive a node_module no diretorio do projeto, verifica se ela está no diretório de "cache"
    if [ -d ../node_modules ]; then # se estiver no diretorio de cache, move para o diretorio do projeto
        mv ../node_modules ./
    else # se não estiver no diretorio de cache, cria uma node_modules no diretorio do projeto, rodando um npm install
        npm install
    fi
fi

npm run start:dev