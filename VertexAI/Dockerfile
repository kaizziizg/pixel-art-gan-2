FROM python:3 
WORKDIR /app  
COPY . .      
RUN pip install --no-cache-dir -r requirements.txt 

CMD [ "python3", "app.py" , "--host","0.0.0.0" ,"--port","8080"]
