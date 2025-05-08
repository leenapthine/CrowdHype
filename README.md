# CrowdHype

CrowdHype is a platform connecting event promoters with their audiences. It enables seamless event management, video uploads, and community interaction, all backed by a Solid.js frontend and a Django API.

This version of the program represents the minimum viable product of the app, which is still early in its development.

## Features

#### Core

- JWT-based authentication using SimpleJWT
- Infinite scroll video feed
- Camera API access for recording/uploading videos
- Basic search and filtering for local events and artists

#### Member Access

- Save, upload, and share videos
- View and follow other users
- Participate in events with basic incentive tracking

#### Promoter Access
- Create and manage event pages
- View basic engagement analytics

### Prototype

<p align="center">
  <img src="https://github.com/user-attachments/assets/01e6048d-9fcd-4b4e-95f5-373ee8449148" width="96%"/>
</p>

### Minimum Viable Product

<p align="center">
  <img src="https://github.com/user-attachments/assets/e961706a-1da8-4c5d-8206-62c9ef9e304f" width="32%"/>
  <img src="https://github.com/user-attachments/assets/92a93737-466f-4c18-bea5-b8fec1a658ab" width="32%" />
  <img src="https://github.com/user-attachments/assets/a6b9569f-0f52-4e85-bda8-23ff8c52f2f1" width="32%"/>
</p>

## Tech Stack

- **Frontend**: Solid.js
- **Backend**: Django
- **Database**: PostgreSQL
- **Storage**: Cloudflare R2 for media
- **Auth**: JWT-based authentication (SimpleJWT)

## Setup & Development

### Setup environment

#### Backend .env

```
DATABASE_URL=<your database>
ENVIRONMENT=development
SECRET_KEY=<secret key>
POSTGRES_LOCALLY=True # if using postgres
DEBUG=False
# DEFAULT_FILE_STORAGE=<if you have a hosted file storage>
```

#### Frontend .env

```
VITE_BACKEND_URL=<localhost or url>
```

#### Make

Run the provided makefile from your root directory to set up both your frontend and backend environment:

```
make dev-setup
```

While working make sure you are inside your virtual environment:

```
. bin/venv/activate
```

### Retrieving submodule(s)

This project includes a submodule for inspection testing (linting) sourced from https://gitlab.com/dlek/intest.git.

The intest module handles inspection testing and is required for development and testing purposes only. It should not be included in deployments and is not required for runtime execution.

if you're cloning the repo for the first time:

```
git clone --recursive https://github.com/your-org/your-repo.git
```

This should pull the submodule down:

```
git submodule init
git submodule sync
git submodule update --init --recursive
```

### Testing

Once you have the submodule, run the test script from the root directory:

```
make test-all
```

Which will return a coverage report. Ex:

```
Running unit tests with coverage...
Found 24 test(s).
Creating test database for alias 'default'...
System check identified no issues (0 silenced).
........................
----------------------------------------------------------------------
Ran 24 tests in 20.211s

OK
Destroying test database for alias 'default'...
Generating coverage report...
Name                                          Stmts   Miss  Cover   Missing
---------------------------------------------------------------------------
backend/__init__.py                               3      0   100%
backend/api/__init__.py                           0      0   100%
backend/api/admin.py                              9      0   100%
backend/api/apps.py                               4      0   100%
backend/api/migrations/0001_initial.py           11      0   100%
backend/api/migrations/__init__.py                0      0   100%
backend/api/models.py                            54      1    98%   57
backend/api/serializers.py                       37      2    95%   31-37
backend/api/tests.py                              0      0   100%
backend/api/urls.py                              11      0   100%
backend/api/views.py                            101     49    51%   38-48, 58-64, 75, 84-86, 93-97, 104-118, 125-133, 152, 158-161, 168-177
backend/crowdhype/__init__.py                     0      0   100%
backend/crowdhype/asgi.py                         4      4     0%   10-16
backend/crowdhype/settings.py                    50      0   100%
backend/crowdhype/urls.py                         7      1    86%   17
backend/crowdhype/wsgi.py                         4      4     0%   11-17
backend/manage.py                                11      2    82%   12-13
backend/tests/__init__.py                         0      0   100%
backend/tests/unittests/__init__.py               4      0   100%
backend/tests/unittests/base_test.py             17      0   100%
backend/tests/unittests/test_models.py           40      0   100%
backend/tests/unittests/test_serializers.py      53      0   100%
backend/tests/unittests/test_views.py            67      1    99%   30
---------------------------------------------------------------------------
TOTAL                                           487     64    87%
```

'tests-all' will also run lint checks on Python and YAML files.
