import eel
import cv2
import numpy as np
import base64

eel.init('web')

@eel.expose
def detect_face_from_image(image_data_url):
    try:
        # Extract base64 data from "data:image/jpeg;base64,..."
        header, encoded = image_data_url.split(',', 1)
        image_bytes = base64.b64decode(encoded)

        # Convert bytes to NumPy array
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        # Convert to grayscale and detect face
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.1, 4)

        return "✅ Face detected!" if len(faces) > 0 else "❌ No face found."

    except Exception as e:
        return f"❌ Error: {str(e)}"

eel.start('index.html', size=(600, 700))