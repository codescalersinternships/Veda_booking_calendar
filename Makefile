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
