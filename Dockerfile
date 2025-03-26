FROM node:bullseye
# RUN corepack enable && yarn set version stable
WORKDIR /app
COPY . /app
CMD ["sh", "-c", "yarn install && yarn dev"]

# docker build -t uapi .
# docker run -p 3000:3000 -v ./:/app -it --name uapi uapi
# docker exec -it uapi sh
