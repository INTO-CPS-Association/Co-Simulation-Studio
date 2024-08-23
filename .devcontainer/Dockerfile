FROM mcr.microsoft.com/devcontainers/typescript-node:1-22-bookworm AS cosim_basic

COPY --chown=1000:1000 ./example_workspace/ /home/node/cosim_workspace

FROM cosim_basic AS cosim_with_maestro

# Download latest maestro-webapi
WORKDIR /home/node/maestro_home
RUN wget -O maestro-webapi.jar https://github.com/INTO-CPS-Association/maestro/releases/download/Release%2F2.4.1/maestro-webapi-2.4.1-bundle.jar