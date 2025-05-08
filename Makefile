# set default python to python3 if not specified on command line
PYTHON ?= python3

dev-setup-frontend:
	cd frontend && npm install

dev-setup-backend:
	cd backend && $(PYTHON) -m venv venv && \
	sh -c '. venv/bin/activate ; echo installing requirements in venv created at $$VIRTUAL_ENV ; pip install -r requirements.txt -r tests/requirements.txt' && \
	echo "venv created; to activate, run '. venv/bin/activate'"

dev-setup: dev-setup-frontend dev-setup-backend
	sh -c 'git submodule update --init ; git submodule sync ; git submodule update --recursive'

test-all:
	sh backend/tests/test-all