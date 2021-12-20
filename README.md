- Create user
```
curl --location --request POST 'localhost:3000/users' \
--header 'Content-Type: application/json' \
--data-raw '{"name": "User 4", "funds": 200}'
```

- Create equity
```
curl --location --request POST 'localhost:3000/equities' \
--header 'Content-Type: application/json' \
--data-raw '{"name": "Equity 4", "units": 330, "cost": 10}'
```

- Buy equity
```
curl --location --request POST 'localhost:3000/equities/buy/fc4e62b6-db1d-4f8b-bdd6-6d4067b0f9b9' \
--header 'Content-Type: application/json' \
--data-raw '{"units": 2, "user_id": "204cb644-697a-4a2b-b907-8145ed3f01eb"}'
```

- Sell equity
```
curl --location --request POST 'localhost:3000/equities/sell/fc4e62b6-db1d-4f8b-bdd6-6d4067b0f9b9' \
--header 'Content-Type: application/json' \
--data-raw '{"units": 2, "user_id": "204cb644-697a-4a2b-b907-8145ed3f01eb"}'
```

- Add funds
```
curl --location --request POST 'localhost:3000/users/addFunds/54e237f4-7a0c-43fa-9158-d3bf6d6c224b' \
--header 'Content-Type: application/json' \
--data-raw '{"funds": 100}'
```