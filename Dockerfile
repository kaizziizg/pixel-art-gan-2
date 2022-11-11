FROM python:3
WORKDIR /app
COPY ./server .
RUN pip install websockets

CMD [ "python", "./app.py" ]
