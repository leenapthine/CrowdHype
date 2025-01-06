# CrowdHype Project

## Development and testing

### Database Setup

First, install PostgreSQL on your system. You can download it from the official website or use a package manager.

#### macOS

Using Homebrew:

```sh
brew install postgresql
brew services start postgresql
```

this creates a new database and user

```sh
psql -U lee -d crowdhype_db -W
```

Some stuff for Lee to remember:

-U lee logs in with the lee role.

-d crowdhype_db chooses the database you created.

-W forces a password prompt.

password: supersecretpassword

```sql
CREATE DATABASE crowdhype_db;
CREATE USER lee WITH PASSWORD 'supersecretpassword';
ALTER ROLE lee SET client_encoding TO 'utf8';
ALTER ROLE lee SET default_transaction_isolation TO 'read committed';
ALTER ROLE lee SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE crowdhype_db TO lee;
```

### Setup environment

Run the provided makefile from your root directory to set up both your frontend and backend environment:

```sh
make dev-setup
```

While working make sure you are inside your virtual environment:

```sh
. bin/venv/activate
```

### Retrieving submodule(s)

This submodule needs to be called from the ARCsoft gitlab repository:

- the `intest` module, which handles inspection testing (linting)

The intest module needs to be available for testing, but not for execution and
should not be included in deployments.

This should pull the submodule down:

```sh
git submodule init
git submodule sync
git submodule update --init --recursive
```
