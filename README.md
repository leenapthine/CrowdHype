# CrowdHype

CrowdHype is a platform connecting event promoters with their audiences. It enables seamless event management, video uploads, and community interaction, all backed by a Solid.js frontend and a Django API.

## Tech Stack

- **Frontend**: Solid.js (Vinxi)
- **Backend**: Django + Django REST Framework
- **Database**: PostgreSQL
- **Storage**: Cloudflare R2 for media
- **Auth**: JWT-based authentication (SimpleJWT)

## Setup & Development

### Setup environment

#### Backend .env

```sh
DATABASE_URL=<your database>
ENVIRONMENT=development
SECRET_KEY=<secret key>
POSTGRES_LOCALLY=True # if using postgres
DEBUG=False
R2_ACCESS_KEY_ID=<your ID>
R2_SECRET_ACCESS_KEY=<your Key>
# DEFAULT_FILE_STORAGE=<if you have a hosted file storage>
```

#### Frontend .env

```sh
VITE_BACKEND_URL=<localhost or url>
```

#### Make

Run the provided makefile from your root directory to set up both your frontend and backend environment:

```sh
make dev-setup
```

While working make sure you are inside your virtual environment:

```sh
. bin/venv/activate
```

### Retrieving submodule(s)

This project includes a submodule for inspection testing (linting) sourced from https://gitlab.com/dlek/intest.git.

The intest module handles inspection testing and is required for development and testing purposes only. It should not be included in deployments and is not required for runtime execution.

if you're cloning the repo for the first time:

```sh
git clone --recursive https://github.com/your-org/your-repo.git
```

This should pull the submodule down:

```sh
git submodule init
git submodule sync
git submodule update --init --recursive
```
