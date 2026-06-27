const fs = require('fs');
const path = require('path');
const os = require('os');
const { exec } = require('child_process');

const LANGUAGE_MAP = {
  javascript: { ext: 'js', cmd: 'node' },
  python: { ext: 'py', cmd: process.platform === 'win32' ? 'python' : 'python3' },
  typescript: { ext: 'ts', cmd: 'npx ts-node' },
  java: { ext: 'java', cmd: 'java' },
  c: { ext: 'c', cmd: process.platform === 'win32' ? 'gcc {file} -o a.exe && a.exe' : 'gcc {file} -o a.out && ./a.out' },
  cpp: { ext: 'cpp', cmd: process.platform === 'win32' ? 'g++ {file} -o a.exe && a.exe' : 'g++ {file} -o a.out && ./a.out' },
  go: { ext: 'go', cmd: 'go run' },
  rust: { ext: 'rs', cmd: process.platform === 'win32' ? 'rustc {file} -o a.exe && a.exe' : 'rustc {file} -o a.out && ./a.out' }
};

async function pistonExecute({ code, language, stdin = '' }) {
  return new Promise((resolve) => {
    const langConfig = LANGUAGE_MAP[language] || LANGUAGE_MAP['python'];
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'codepair-'));
    const tempFile = path.join(tempDir, `main.${langConfig.ext}`);
    
    fs.writeFileSync(tempFile, code);

    // Some simple commands take the file as argument
    let command = `${langConfig.cmd} "${tempFile}"`;
    if (langConfig.cmd.includes('{file}')) {
      command = langConfig.cmd.replace(/{file}/g, `"${tempFile}"`).replace(/{dir}/g, `"${tempDir}"`);
    }

    const child = exec(command, { timeout: 10000, cwd: tempDir }, (error, stdout, stderr) => {
      // Clean up
      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
      } catch (e) { }

      resolve({
        run: {
          stdout: stdout || '',
          stderr: stderr || '',
          code: error ? error.code || 1 : 0
        }
      });
    });

    if (stdin && child.stdin) {
      child.stdin.write(stdin);
      child.stdin.end();
    }
  });
}

module.exports = { pistonExecute, LANGUAGE_MAP };
