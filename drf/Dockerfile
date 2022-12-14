###########
# BUILDER #
###########

# pull official base image
FROM python:3.9.13 as builder

# set work directory
WORKDIR /usr/src/app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV DEBIAN_FRONTEND noninteractive

# install psycopg2 dependencies
RUN apt-get update && apt-get install -y --no-install-recommends apt-utils
RUN apt-get update && apt-get -y install postgresql-server-dev-all gcc libpq-dev python3-dev musl-dev -y

# lint
RUN pip install --upgrade pip
RUN python -m pip install --upgrade pip
COPY . .

# install dependencies
COPY ./requirements.txt .
RUN pip install numpy
#RUN pip wheel --no-cache-dir --no-deps --wheel-dir /usr/src/app/wheels nvidia-cuda-nvrtc-cu11 nvidia_cudnn_cu11 nvidia-cudnn-cu11 nvidia-cublas-cu11 typing-extensions nvidia-cuda-runtime-cu11 setuptools wheel tensorflow scikit-learn
#RUN pip wheel --no-deps --wheel-dir /usr/src/app/wheels torch
#RUN pip wheel --no-deps --wheel-dir /usr/src/app/wheels "pydicom==2.2.0"
#RUN pip install -r requirements.txt
#RUN pip install -r ai/requirements.txt

#########
# FINAL #
#########

# pull official base image
FROM python:3.9.13-bullseye

# create directory for the app user
RUN mkdir -p /home/app

# create the app user
#RUN addgroup --system app && adduser --system --group app

# create the appropriate directories
ENV HOME=/home/app
ENV APP_HOME=/home/app/web

RUN mkdir -p $APP_HOME
RUN mkdir $APP_HOME/static
RUN mkdir $APP_HOME/mediafiles
RUN mkdir $APP_HOME/media
WORKDIR $APP_HOME

# install dependencies
RUN apt-get update && apt-get install libpq-dev python3-dev -y
#COPY --from=builder /usr/src/app/wheels /wheels
COPY --from=builder /usr/src/app/requirements.txt .
RUN python -m pip install --upgrade pip
RUN pip install gunicorn dynaconf numpy torch
RUN pip install -r requirements.txt --upgrade

# copy project
COPY . $APP_HOME

RUN sed -i 's/staticfiles/static/g' /usr/local/lib/python3.9/site-packages/rest_framework_swagger/templates/rest_framework_swagger/index.html

# chown all the files to the app user
RUN chown -R root:root $APP_HOME

# change to the app user
USER root
