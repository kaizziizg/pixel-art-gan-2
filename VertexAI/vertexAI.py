from google.cloud import aiplatform
import numpy as np
import time
import numpy as np
import cv2
import imageio

ProjectID = "944213700205"
endpointID = "1442264586525868032"
endpoint = aiplatform.Endpoint(
    endpoint_name=("projects/{}/locations/us-central1/endpoints/{}".format(ProjectID,endpointID))
)

def getPredict(size=16):
    t = time.time()
    localT = time.localtime(t)

    latent = np.random.normal(loc=0.0,scale=1.0, size=(1,100)).tolist()
    response = endpoint.predict(latent).predictions
    imgPath = "./predict/spriteSheet/{}_{}{}_{}{}{}.png".format(localT.tm_year,localT.tm_mon,localT.tm_mday,localT.tm_hour,localT.tm_min,localT.tm_sec)
    frames = frameProcess(response[0],size)
    res = np.concatenate((frames), 1)
    cv2.imwrite(imgPath,res)
    return imgPath

def getPredictGif(size=16):
    t = time.time()
    localT = time.localtime(t)

    latent = np.random.normal(loc=0.0,scale=1.0, size=(1,100)).tolist()
    response = endpoint.predict(latent).predictions
    imgPath = "./predict/gif/{}_{}{}_{}{}{}.gif".format(localT.tm_year,localT.tm_mon,localT.tm_mday,localT.tm_hour,localT.tm_min,localT.tm_sec)
    frames = frameProcess(response[0],size)
    
    imageio.mimsave(imgPath, frames, 'GIF', duration=0.1)
    return imgPath

def frameProcess(output,size):
    # return spriteSheet
    data = np.array(output, dtype=np.float32)
    rgba_img = cv2.cvtColor(data, cv2.COLOR_GRAY2RGBA)
    rgba_img = (rgba_img+1)/2*255 #unNormalization
    rgba_img = rgba_img.astype('uint8')
    height, width = rgba_img.shape[:2]
    for y in range(height):
        for x in range(width):
            if rgba_img[y, x][0]<10:
                rgba_img[y, x] = [0, 0, 0, 0]

    frame0 = rgba_img
    M = np.float32([[1,0,0],[0, 1, -1]])
    frame1 = cv2.warpAffine(
        frame0, M, (height, width), borderMode=cv2.BORDER_CONSTANT, borderValue=(0, 0, 0, 0)
    )
    M = np.float32([[1, 0, 0], [0, 1, -2]])
    frame2 = cv2.warpAffine(
        frame0, M, (height, width), borderMode=cv2.BORDER_CONSTANT, borderValue=(0, 0, 0, 0)
    )
    frames = []
    frame0 = cv2.resize(frame0, (24 * size, 24 * size), interpolation=cv2.INTER_NEAREST)
    frame1 = cv2.resize(frame1, (24 * size, 24 * size), interpolation=cv2.INTER_NEAREST)
    frame2 = cv2.resize(frame2, (24 * size, 24 * size), interpolation=cv2.INTER_NEAREST)
    frames.append(frame0);frames.append(frame1);frames.append(frame2);frames.append(frame0)
    return frames