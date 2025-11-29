import cv2
import numpy as np

def analyze_image(cv_img):
    img = cv2.resize(cv_img, (256, 256))
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

    lower_green = np.array([35, 40, 40])
    upper_green = np.array([85, 255, 255])
    green_mask = cv2.inRange(hsv, lower_green, upper_green)

    lower_brown = np.array([10, 80, 20])
    upper_brown = np.array([25, 255, 200])
    brown_mask = cv2.inRange(hsv, lower_brown, upper_brown)

    lower_yellow = np.array([20, 70, 120])
    upper_yellow = np.array([35, 255, 255])
    yellow_mask = cv2.inRange(hsv, lower_yellow, upper_yellow)

    total = img.size // 3
    green = np.sum(green_mask > 0) / total
    brown = np.sum(brown_mask > 0) / total
    yellow = np.sum(yellow_mask > 0) / total

    health = "Healthy" if green > 0.6 else \
             "Disease Stress" if yellow > 0.15 else \
             "Dry / Water Stress" if brown > 0.25 else \
             "Moderate Stress"

    harvest = "Growing (Not Ready)" if green > 0.65 else \
              "Approaching Harvest" if brown > 0.20 else \
              "Early Stage"

    yield_est = "High" if health == "Healthy" else \
                "Medium" if health == "Moderate Stress" else \
                "Low"

    return {
        "health_status": health,
        "harvest_readiness": harvest,
        "expected_yield": yield_est,
        "metrics": {
            "green": green,
            "brown": brown,
            "yellow": yellow
        }
    }
