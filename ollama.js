const axios = require('axios');

const analyzeText = async (text) => {
  try {
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: 'llama2',
      prompt: `Analyze the following journal entry and provide insights: ${text}`
    });
    return response.data.response;
  } catch (error) {
    console.error('Error calling Ollama API:', error);
    return null;
  }
};

module.exports = { analyzeText };