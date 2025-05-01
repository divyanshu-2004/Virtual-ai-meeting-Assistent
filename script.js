document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;
    const sidePanel = document.getElementById('sidePanel');
    const chatBtn = document.getElementById('chatBtn');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const panels = document.querySelectorAll('.panel-content');
  
    // Theme toggle
    themeToggle.addEventListener('click', () => {
      body.classList.toggle('dark-mode');
    });
  
    // Side panel toggle
    chatBtn.addEventListener('click', () => {
      sidePanel.classList.toggle('active');
    });
  
    // Tab switching
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        
        tabBtns.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        
        btn.classList.add('active');
        document.querySelector(`.${tab}-panel`).classList.add('active');
      });
    });
  
    // Initialize WebRTC
    let localStream;
  
    async function initializeMedia() {
      try {
        localStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        
        const localVideo = document.getElementById('localVideo');
        localVideo.srcObject = localStream;
      } catch (err) {
        console.error('Error accessing media devices:', err);
      }
    }
  
    // Media control buttons
    const muteBtn = document.getElementById('muteBtn');
    const videoBtn = document.getElementById('videoBtn');
    
    muteBtn.addEventListener('click', () => {
      const audioTrack = localStream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      muteBtn.querySelector('i').classList.toggle('fa-microphone');
      muteBtn.querySelector('i').classList.toggle('fa-microphone-slash');
    });
  
    videoBtn.addEventListener('click', () => {
      const videoTrack = localStream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      videoBtn.querySelector('i').classList.toggle('fa-video');
      videoBtn.querySelector('i').classList.toggle('fa-video-slash');
    });
  
    // Initialize media on load
    initializeMedia();
  });
  