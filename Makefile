env-copy:
    $(shell cp .env.example .env)

run: env-copy
	docker-compose up -d
	npm run start
stop:
	docker-compose down
seed:
	npm run seed
