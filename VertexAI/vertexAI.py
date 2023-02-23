from google.cloud import aiplatform
import numpy as np
import matplotlib.pyplot as plt
import time
import cv2

ProjectID = "944213700205"
endpointID = "987963974114869248"
endpoint = aiplatform.Endpoint(
    endpoint_name=("projects/{}/locations/us-central1/endpoints/{}".format(ProjectID,endpointID))
)

def getPredict():
    t = time.time()
    localT = time.localtime(t)

    latent = np.random.normal(loc=0.0,scale=1.0, size=(1,100)).tolist()
    response = endpoint.predict(latent).predictions
    imgPath = "./{}_{}{}_{}{}{}.png".format(localT.tm_year,localT.tm_mon,localT.tm_mday,localT.tm_hour,localT.tm_min,localT.tm_sec)

    plt.imsave(imgPath,response[0],cmap="gray")
    return imgPath