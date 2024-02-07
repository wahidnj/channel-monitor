const { exec } = require('child_process');

function extractFramesFromVideo(videoURL, outputPattern) {
  // FFmpeg command to extract frames
  
  const ffmpegCommand = `ffmpeg -i "${videoURL}" -q:v 1 -vf "fps=24,scale=800:600" -y image/RTV_%04d.jpg`;
  // const ffmpegCommand = `ffmpeg -i ${videoURL} -q:v 1 -filter_complex "[0:v]split=2[top][bottom];[bottom]crop=iw:ih*0.2:0:ih*0.8, fps=1[image2];[top]fps=1[image]" -map "[image]" -y image/DRINKO_%04d.jpg -map "[image2]" -y image2/DRINKO_%04d.jpg`;
  // const ffmpegCommand = `ffmpeg -i marvel.mp4  -vf "fps=1,scale=614:464" ${outputPattern}%04d.png`;
// -q:v 1 -vf fps=1 -y -strftime 1 android/%Y-%m-%d:%H-%M-%S_111.jpg
  // Execute FFmpeg command
  const ffmpegProcess = exec(ffmpegCommand);

  ffmpegProcess.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  ffmpegProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  ffmpegProcess.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
}

// Usage example
const videoURL = 'http://lifetvbd.xyz:8080/samir4341/samir4341/85.ts';
// const videoURL = 'drink.mp4';
const outputPattern = './image/output'; // Change this pattern as needed

extractFramesFromVideo(videoURL, outputPattern);
