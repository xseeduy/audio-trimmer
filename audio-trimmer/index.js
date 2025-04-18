const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.get('/health', (req, res) => res.send('OK'));

app.post('/trim', upload.single('audio'), (req, res) => {
  const inputPath = req.file.path;
  const outputPath = \`\${inputPath}.trimmed.wav\`;

  const durationCmd = \`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "\${inputPath}"\`;

  exec(durationCmd, (err, stdout) => {
    if (err) return res.status(500).send('Failed to get duration.');

    const duration = parseFloat(stdout.trim());
    const half = Math.floor(duration / 2);

    const trimCmd = \`ffmpeg -y -i "\${inputPath}" -t \${half} "\${outputPath}"\`;

    exec(trimCmd, (err) => {
      if (err) return res.status(500).send('Failed to trim audio.');

      res.download(outputPath, 'trimmed.wav', () => {
        fs.unlinkSync(inputPath);
        fs.unlinkSync(outputPath);
      });
    });
  });
});

app.listen(3000, () => {
  console.log('Audio Trimmer running on port 3000');
});
