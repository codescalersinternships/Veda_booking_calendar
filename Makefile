SERVER:=cd server
CLIENT:=cd client

runserver:
	$(SERVER) && npx ts-node src/server.ts 
runclient:
	$(CLIENT) && yarn dev

lintserver:
	$(SERVER) && yarn lint
lintclient:
	$(CLIENT) && yarn lint

buildserver:
	docker build --build-arg VEDA_SERVER_DOMAIN=$(VEDA_SERVER_DOMAIN) -t veda_server -f ./server/Dockerfile .
buildclient:
	docker build --build-arg VEDA_SERVER_DOMAIN=$(VEDA_SERVER_DOMAIN) -t veda_client -f ./client/Dockerfile .
