<<<<<<< HEAD

# CrowdHype Project

## Database Setup

First, install PostgreSQL on your system. You can download it from the official website or use a package manager.

### macOS

Using Homebrew:

```sh
brew install postgresql
brew services start postgresql
```

this creates a new database and user

```sh
psql -U lee -d crowdhype_db -W
```

Some stuff for LEe to remember:

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

#### Setup environment

Begin by creating a virtual environment in your project root folder:

```sh
python -m venv venv
```

Activate your new virtual environment:

```sh
. bin/venv/activate
```

Then run the provided makefile from your root directory to set up both your frontend and backend environment:

```sh
make install
```
