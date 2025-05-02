let stream;
let intervalId;

async function startRecognition() {
  const video = document.getElementById('webcam');
  const canvas = document.getElementById('snapshot');
  const status = document.getElementById('status');

  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;

    status.innerText = "Status: Recognition started...";

    intervalId = setInterval(() => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/jpeg');
      eel.process_frame(imageData); // send to Python
    }, 1000); // 1 frame per second
  } catch (err) {
    console.error("Webcam error:", err);
    status.innerText = "Status: Webcam access failed!";
  }
}

function stopRecognition() {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
  clearInterval(intervalId);
  document.getElementById('status').innerText = "Status: Recognition stopped.";
}
