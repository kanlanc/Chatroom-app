# Use an official Python runtime as a parent image
FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1

# Set the working directory to /app
WORKDIR /chatroom-app

# Copy the current directory contents into the container at /chatroom-app
COPY wsgi.py /chatroom-app/
COPY server.py /chatroom-app

# Copy requirements.txt into the container at /app/
COPY requirements.txt /chatroom-app

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Set the default port (can be overridden at runtime)
ENV PORT=8080

ENV HOST='0.0.0.0'

ENV MONGODB_URL='mongodb://localhost:27017/ChatRoomDB'

ENV WORKERS=1

CMD gunicorn -w $WORKERS -b $HOST:$PORT wsgi:app
