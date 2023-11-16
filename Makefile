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
	$(SERVER) && yarn lint
buildclient:
	docker build --build-arg VITE_SERVER_DOMAIN=$(VITE_SERVER_DOMAIN) -t veda -f ./client/Dockerfile .
