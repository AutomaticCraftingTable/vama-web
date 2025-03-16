# VAMA - web
Frontendowa część projektu VAMA
## Konfiguracja aplikacji
### Instalacja zależności:
- Skonfiguruj [środowisko traefik](https://github.com/AutomaticCraftingTable/traefik-environment)
- Zainstaluj `just`
#### Instalacja `just` w systemie z menedżerem pakietów snap:
```sh
sudo snap install just --classic
```
#### Instalacja `just` w systemie z menedżerem pakietów nix:
```sh
nix-shell -p "just"
```
### Inicjalizacja projektu:
```sh
cp .env.example .env
just init
```
## Komendy
#### Aby zatrzymać kontener:
```sh
just stop
```
#### Jeśli już zainicjalizowałeś projekt i chcesz tylko uruchomić kontener:
```sh
just start
```
#### Aby wykonać komendę używając powłoki kontenera:
```sh
just exec "twoja komenda"
```
Sprawdź [justfile](justfile), aby zobaczyć dostępne wrappery dla tej komendy
#### Aby otworzyć powłokę kontenera:
```sh
just dsh
```
