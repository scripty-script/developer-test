# developer-test
Developer Test using React and Laravel

# Back-end Installation

1. Install composer packages

```
$ composer install
```

2. Create and setup .env file
make a copy of .env.example

3. Migrate and Seed

```
$ php artisan migrate:fresh --seed
```

### Resource end-point
The resource end-point are <http://localhost:8000/api/products> and <http://localhost:8000/api/categories>
For searching for a product, add <code>q</code> query param. For filtering, add <code>filter=no-stock</code>.


### Note
All internal server will display <code>{'message': 'Something went wrong!'}</code>, to trace the error you need to present and <code>dev</code> token in query params, 
for ex <http://localhost:8000/api/products?dev=12344>. By default the dev key is <code>b39c7e3552e0cc956243719a01150eb5b75675c38ee312e36def6eb06cac7e10</code>

# font-end Installation

1. Install node packages

```
$ npm install
```

2. Create and setup .env file
make a copy of .env.example

3. Run the development server

```
$ npm run dev
```
Open http://localhost:1234 with your browser to see the result.
This use parcel js bundler.
