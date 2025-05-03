let stream;
let intervalId;

async function startRecognition() {
  const video = document.getElementById('webcam');
  const status = document.getElementById('status');
  const result = document.getElementById('result');
  const statusIndicator = document.getElementById('status-indicator');
  const videoContainer = document.querySelector('.video-container');
  
  // Add active class for animations
  document.body.classList.add('active-recognition');
  statusIndicator.parentElement.classList.add('status-active');
  statusIndicator.parentElement.classList.remove('status-error');

  try {
    stream = await navigator.mediaDevices.getUserMedia({ 
      video: { 
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: 'user' 
      } 
    });
    video.srcObject = stream;

    status.innerText = "Analyzing video feed...";
    result.innerText = "Processing first frame...";

    intervalId = setInterval(async () => {
      const canvas = document.getElementById('snapshot');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      
      try {
        const detectionResult = await eel.detect_face_from_image(imageData)();
        updateResult(detectionResult);
      } catch (err) {
        console.error("Detection error:", err);
        showError("Error during face detection");
      }
    }, 1000); // 1 frame per second
  } catch (err) {
    console.error("Webcam error:", err);
    showError("Camera access denied");
  }
}

function updateResult(detectionData) {
  const result = document.getElementById('result');
  const status = document.getElementById('status');
  
  if (detectionData && detectionData !== "No faces detected") {
    // Format the result for better display
    const formattedResult = detectionData
      .replace(/{|}/g, '')
      .replace(/,/g, '\n')
      .replace(/"/g, '')
      .replace(/:/g, ': ');
    
    result.innerHTML = formattedResult;
    status.innerText = "Face detected and analyzed";
  } else {
    result.innerText = "No faces detected in frame";
    status.innerText = "Waiting for face detection...";
  }
}

function showError(message) {
  const status = document.getElementById('status');
  const result = document.getElementById('result');
  const statusIndicator = document.getElementById('status-indicator');
  
  status.innerText = message;
  result.innerText = "❌ " + message;
  statusIndicator.parentElement.classList.add('status-error');
  statusIndicator.parentElement.classList.remove('status-active');
}

function stopRecognition() {
  // Remove active states
  document.body.classList.remove('active-recognition');
  
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
  
  clearInterval(intervalId);
  
  document.getElementById('status').innerText = "Recognition stopped";
  document.getElementById('status-indicator').parentElement.classList.remove('status-active', 'status-error');
  document.getElementById('result').innerText = "System idle";
  
  // Clear video feed
  const video = document.getElementById('webcam');
  video.srcObject = null;
}

// Initialize with system check
document.addEventListener('DOMContentLoaded', () => {
  const status = document.getElementById('status');
  status.innerText = "System ready - awaiting initialization";
});