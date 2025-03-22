set dotenv-load := true

exec params:
    @docker compose exec ${DOCKER_APP_SERVICE} bash -c "{{params}}"

dsh:
    @docker compose exec -it ${DOCKER_APP_SERVICE} bash

init:
    @docker compose up --build --remove-orphans -d
    @just start

start:
    @docker compose start
    @echo -e "\nVite development server is running on:\n"
    @echo -e "🚀 http://127.0.0.1:$DOCKER_APP_HOST_PORT"
    @echo -e "🚀 http://$APP_URL (traefik)"

stop:
    @docker compose stop

upgrade:
    @just exec "npx npm-check-updates -u"

install:
    @just exec "npm install"

lint:
    @just exec "npm run lint"

fix:
    @just exec "npm run lintf"

tsc:
    @just exec "npm run ts-check"

dist:
    @just exec "npm run build"