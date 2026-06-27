const axios = require('axios');
const { PISTON_API_URL } = require('../config');

// We use the language name as expected by the Piston API v2.
const LANGUAGE_MAP = {
  javascript: 'javascript',
  python: 'python',
  typescript: 'typescript',
  java: 'java',
  c: 'c',
  cpp: 'c++',
  go: 'go',
  rust: 'rust'
};

async function pistonExecute({ code, language, stdin = '' }) {
  try {
    const mappedLanguage = LANGUAGE_MAP[language] || 'python';
    
    const response = await axios.post(`${PISTON_API_URL}/execute`, {
      language: mappedLanguage,
      version: '*',
      files: [
        {
          name: `main.${language === 'cpp' ? 'cpp' : 'txt'}`,
          content: code
        }
      ],
      stdin: stdin
    });

    return response.data;
  } catch (error) {
    console.error('Piston Execution Error:', error.response?.data || error.message);
    return {
      run: {
        stdout: '',
        stderr: error.response?.data?.message || 'Execution failed',
        code: 1
      }
    };
  }
}

module.exports = { pistonExecute, LANGUAGE_MAP };
