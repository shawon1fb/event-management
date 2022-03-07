dockerup:
	docker compose up dev-db  -d

npminit:
	npm init -y

prinmainstall:
	npm install prisma types cript ts-node @types/node --save-dev
prinmaclint:
	npm install @prisma/clint

migrate:
	npx prisma migrate dev