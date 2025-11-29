from fastapi import FastAPI, UploadFile, File
import uvicorn
import numpy as np
import cv2
from PIL import Image
import io
from analysis import analyze_image

app = FastAPI()

def load_image(img_bytes):
    pil_img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
    return cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)

@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    content = await file.read()
    cv_img = load_image(content)
    result = analyze_image(cv_img)
    return result

uvicorn.run(app, host="0.0.0.0", port=7000)
