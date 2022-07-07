# developer-test
Developer Test using Vue js and Laravel

# Back-end Installation

1. Install composer packages

```
$ composer install
```

2. Create and setup .env file
```
make a copy of .env.example
```

3. Migrate and Seed

```
$ php artisan migrate --seed
```

### Resource end-point
The resource end-point are <http://localhost:8000/api/products> and <http://localhost:8000/api/categories>
For searching for a product, add <code>q</code> query param. For filtering, add <code>filter=no-stock</code>.

## Using docker
1. Create and setup .env.production file
- make a copy of .env.production.example
- edit <code>DB_HOST</code> from 127.0.0.1 to db.

2. Run docker-compose
```
docker-compose up -d
```
3. go to cli of web container and run migration and seed.
```
php artisan migration --seed
```
