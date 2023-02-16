#!/bin/bash
echo 'EXECUTANDO ENTRYPOINT';

if ! [ -d node_modules ]; then # se não tive a node_module no diretorio do projeto, verifica se ela está no diretório de "cache"
    if [ -d ../node_modules ]; then # se estiver no diretorio de cache, move para o diretorio do projeto
        su -c "mv ../node_modules ./ && rm ../package.json && rm ../package-lock.json && npm run dev" root
    else # se não estiver no diretorio de cache, cria uma node_modules no diretorio do projeto, rodando um npm install
        npm install && npm run dev
    fi
else
    npm run dev # se estiver no diretorio do projeto, apenas roda o projeto
fi