const { Anthropic } = require('anthropic');
const { OpenAI } = require('openai');

let anthropicClient = null;
let openaiClient = null;

if (process.env.ANTHROPIC_API_KEY) {
  anthropicClient = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });
}

if (process.env.OPENAI_API_KEY) {
  openaiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

module.exports = { anthropicClient, openaiClient };