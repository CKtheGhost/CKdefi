// ai.js - AI service configuration for CompounDefi
const env = require('./env');

/**
 * AI configuration for recommendation engine
 */
module.exports = {
  // Default AI provider - will use Anthropic if available, otherwise OpenAI
  defaultProvider: env.ANTHROPIC_API_KEY ? 'anthropic' : 'openai',
  
  // API configurations
  providers: {
    anthropic: {
      apiKey: env.ANTHROPIC_API_KEY,
      model: "claude-3-5-sonnet-20241022",
      temperature: 0.2,
      maxTokens: 4000,
      enabled: !!env.ANTHROPIC_API_KEY
    },
    openai: {
      apiKey: env.OPENAI_API_KEY,
      model: "gpt-4o",
      temperature: 0.2,
      responseFormat: { type: "json_object" },
      enabled: !!env.OPENAI_API_KEY
    }
  },
  
  // Prompt templates for different recommendation types
  promptTemplates: {
    generalStrategy: 
`As an AI financial advisor specialized in Aptos DeFi, analyze the following real-time data to provide a general best investment strategy for users who have not yet connected their wallet:
1. Staking/Lending Rewards: {{stakingData}}
2. Token Overview: {{tokenData}} (top 5 tokens by movement)
3. Latest News: {{newsData}} (top 5 news items)

Provide a JSON response with:
- title: "General Market Strategy"
- summary: Brief summary of the strategy (2-3 sentences)
- allocation: Array of {protocol, product, percentage, expectedApr}
- totalApr: Blended APR of the strategy
- rationale: Explanation based on the data (3-4 sentences)
- risks: Array of potential risks (3-5 items)`,

    personalizedStrategy:
`As an AI financial advisor specialized in Aptos DeFi, provide a personalized staking and investment strategy for a user with:
1. Amount to invest: {{amount}} APT
2. Risk profile: {{riskProfile}}
3. Current portfolio: {{portfolioData}}

Current staking rates:
{{stakingData}}

Provide a JSON response with:
- title: Recommendation title
- summary: Brief summary (2-3 sentences)
- allocation: Array of {protocol, product, percentage, expectedApr}
- totalApr: Blended APR
- steps: Array of implementation instructions (5-7 steps)
- risks: Array of investment risks (3-5 items)
- mitigations: Array of risk mitigation strategies (3-5 items)
- additionalNotes: Additional insights or recommendations`
  },
  
  // Extraction utilities
  extractJSONFromResponse(content) {
    // Try to extract JSON from content (handles markdown code blocks)
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/{[\s\S]*}/);
    
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1] || jsonMatch[0]);
      } catch (error) {
        console.error('Error parsing AI response as JSON:', error);
        return null;
      }
    }
    
    return null;
  },
  
  // Format JSON to avoid AI truncating
  formatDataForPrompt(data) {
    if (!data) return "{}";
    
    // Handle arrays
    if (Array.isArray(data)) {
      // Limit array length if too large
      const maxItems = 5;
      const items = data.length > maxItems ? data.slice(0, maxItems) : data;
      return JSON.stringify(items, null, 2);
    }
    
    // Handle objects
    if (typeof data === 'object') {
      // Remove circular references and simplify large objects
      const simplified = {};
      Object.keys(data).slice(0, 10).forEach(key => {
        if (typeof data[key] === 'object' && data[key] !== null) {
          simplified[key] = '...'; // Replace complex nested objects
        } else {
          simplified[key] = data[key];
        }
      });
      return JSON.stringify(simplified, null, 2);
    }
    
    // Return as string for other types
    return String(data);
  },
  
  // Apply template values to prompt
  applyTemplate(templateName, values) {
    let template = this.promptTemplates[templateName];
    if (!template) {
      throw new Error(`Template "${templateName}" not found`);
    }
    
    // Replace template variables with values
    for (const [key, value] of Object.entries(values)) {
      const placeholder = `{{${key}}}`;
      const formattedValue = this.formatDataForPrompt(value);
      template = template.replace(placeholder, formattedValue);
    }
    
    return template;
  }
};