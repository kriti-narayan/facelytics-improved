import eel
import cv2
import face_recognition

eel.init('web')

running = False

@eel.expose
def start_facial_recognition():
    global running
    running = True
    video_capture = cv2.VideoCapture(0)

    while running:
        ret, frame = video_capture.read()
        if not ret:
            break

        face_locations = face_recognition.face_locations(frame)
        for (top, right, bottom, left) in face_locations:
            cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)

        cv2.imshow("Facial Recognition", frame)
        if cv2.waitKey(1) == 27:  # ESC key
            break

    video_capture.release()
    cv2.destroyAllWindows()

@eel.expose
def stop_facial_recognition():
    global running
    running = False

eel.start('index.html', size=(500, 500))
