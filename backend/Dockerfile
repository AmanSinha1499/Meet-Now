# Use an official Python runtime as a parent image
FROM python:3.8

# Adding backend directory to make absolute filepaths consistent across services
WORKDIR /app/backend

RUN apt-get update \
    && apt-get install -y build-essential gcc libcairo2 libffi-dev \
        libgdk-pixbuf2.0-0 libpango-1.0-0 libpangocairo-1.0-0 poppler-utils \
        python3-cffi shared-mime-info \
    && rm -rf /var/lib/apt/lists/*

# Install pip packages
RUN pip install --upgrade pip \
    && pip install --upgrade setuptools \
    && pip install --upgrade pipenv \
    && pip install --upgrade supervisor

# Install Python dependencies
# COPY requirements.txt /app/backend
COPY . /app/backend
RUN pipenv install --deploy --system

CMD export DJANGO_SETTINGS_MODULE=teams_backend.settings

# Add the rest of the code

# Make port 8000 available for the app
# EXPOSE 8000

# Be sure to use 0.0.0.0 for the host within the Docker container,
# otherwise the browser won't be able to find it
# CMD pipenv run python3 manage.py runserver 0.0.0.0:8000