# VAMA - web

Install dependencies:
- [traefik environment](https://github.com/AutomaticCraftingTable/traefik-environment)
- install just 
```sh
sudo apt install just
```

In order to run the application, initializie the project:
```sh
cp .env.example .env
just init
```

To stop the container:
```sh
just stop
```

If you have initialized the project before and just want to start the container:
```sh
just start
```

To execute a command using container's shell:
```sh
just exec "your command"
```
Check the [justfile](justfile) to see available wrappers

To open container's shell:
```sh
just dsh
```
