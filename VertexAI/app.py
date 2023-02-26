from flask import Flask,send_file
import vertexAI
app = Flask(__name__)
@app.route('/')
def index():
    return 'hello gcp<br><a href="/getPredict">/getPredict</a><br><a href="/getPredictGif">/getPredictGif</a>'

@app.route('/getPredict')
def getPredict():
    img_file = vertexAI.getPredict()
    img = open(img_file, 'rb').read()
    return send_file(img_file, mimetype='image/png')

@app.route('/getPredictGif')
def getPredictGif():
    img_file = vertexAI.getPredictGif()
    
    return send_file(img_file, mimetype='image/gif')

if __name__ == '__main__':
    # app.debug = True
    app.run(host="0.0.0.0", port=3000)