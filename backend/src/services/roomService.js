function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function getStarterCode(language) {
  const templates = {
    javascript: `// JavaScript\nfunction solve(input) {\n  // Write your solution here\n  return null;\n}\n\nconsole.log(solve());`,
    python: `# Python\nimport sys\n\ndef solve():\n    # Write your solution here\n    pass\n\nif __name__ == "__main__":\n    solve()`,
    java: `// Java\npublic class Main {\n    public static void main(String[] args) {\n        // Write your solution here\n        System.out.println("Hello World");\n    }\n}`,
    cpp: `// C++\n#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    cout << "Hello World" << endl;\n    return 0;\n}`,
    c: `// C\n#include <stdio.h>\n\nint main() {\n    // Write your solution here\n    printf("Hello World\\n");\n    return 0;\n}`,
    typescript: `// TypeScript\nfunction solve(input: any): any {\n  // Write your solution here\n  return null;\n}\n\nconsole.log(solve(null));`,
    go: `// Go\npackage main\n\nimport "fmt"\n\nfunc main() {\n    // Write your solution here\n    fmt.Println("Hello World")\n}`,
    rust: `// Rust\nfn main() {\n    // Write your solution here\n    println!("Hello World");\n}`,
  };
  return templates[language] || templates['javascript'];
}

function getParticipantColor(socketId, participants) {
  const colors = ['#6366f1', '#06b6d4', '#f59e0b', '#ec4899', '#22c55e'];
  return colors[participants.length % colors.length];
}

module.exports = {
  generateRoomCode,
  getStarterCode,
  getParticipantColor,
};
