# Adonis fullstack application

This is the fullstack boilerplate for AdonisJs, it comes pre-configured with.

1.  Bodyparser
2.  Session
3.  Authentication
4.  Web security middleware
5.  CORS
6.  Edge template engine
7.  Lucid ORM
8.  Migrations and seeds

## Setup

Use the adonis command to install the blueprint

```bash
adonis new yardstick
```

or manually clone the repo and then run `npm install`.

### Migrations

Run the following command to run startup migrations.

```js
adonis migration:run
```

### App structure

1.  User logs in, and is directed to /home, which loads the Nav & LoginWelcome component. Nav is fetching the user profile ( name, email ) and also the company profile.
    The nav component checks if the user has a company in the database.
    If no company, it displays a different nav forcing the user to add a new company.

2.
