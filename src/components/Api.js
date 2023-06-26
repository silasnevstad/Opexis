import { SETUP_PROMPT, QA_PROMPT, CODE_PROMPT, CODE_UPDATE_PROMPT } from "./prompts"; // FOLLOWUP_PROMPT
import { GLOBAL_FUNCTIONS, CODE_FUNCTION, QUESTION_FUNCTION } from "./utils";
const { Configuration, OpenAIApi } = require("openai");

// Initialize OpenAI
const configuration = new Configuration({ apiKey: process.env.REACT_APP_OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

// gpt-3.5-turbo-0613 - 250,000 TPM
// gpt-4-0613 - 250,000 TPM
class AI {
    constructor(messages = [], model = 'gpt-4-0613', temperature = 0.1) {
        this.model = model;
        this.temperature = temperature;
        this.messages = messages;
        this.functions = GLOBAL_FUNCTIONS;
    }

    addMessage(role, content) {
        this.messages.push({ role: role, content: content });
    }

    _latestMessage() {
        return this.messages[this.messages.length - 1];
    }

    async _forceRequestToOpenAI(functionCall) {
        const MAX_ATTEMPTS = 3;
        let attempt = 0;
        let response;
    
        while (attempt < MAX_ATTEMPTS) {
            console.log(`Attempt ${attempt + 1}...`);
            try {
                response = await openai.createChatCompletion({
                    model: this.model,
                    messages: this.messages,
                    temperature: this.temperature,
                    functions: [functionCall],
                });

                if (response.data.choices[0].finish_reason === 'stop' || response.data.choices[0].finish_reason === 'function_call') {
                    break;
                }
    
                attempt++;
            } catch (error) {
                if (attempt === MAX_ATTEMPTS - 1) throw error;
                console.error(`Attempt ${attempt + 1} failed. Retrying...`);
                attempt++;
            }
        }
    
        return response;
    }    

    async start(systemPrompt, userPrompt) {
        this.addMessage("system", systemPrompt);
        return this.next(`${userPrompt}\n\n${QA_PROMPT}`, QUESTION_FUNCTION);
    }

    async next(userPrompt = null, functionCall = null) {
        if (userPrompt) {
            this.addMessage("user", userPrompt);
        }
    
        const response = await this._forceRequestToOpenAI(functionCall);
    
        if (!response) {
            console.error("Failed to get a response from OpenAI after maximum attempts");
            return;
        }
    
        if (response.data.choices[0].finish_reason === 'function_call') {
            const functionCall = response.data.choices[0].message?.function_call;
            const args = JSON.parse(functionCall.arguments);
            return { type: 'function_call', function: functionCall.name, arguments: args };
        }
    
        const assistantMessage = response.data.choices[0].message.content;
        this.addMessage("assistant", assistantMessage);
    
        return { type: 'message', content: assistantMessage };
    }
    
}

async function setup(messages, prompt) {
    const ai = new AI(messages);
    const response = await ai.start(SETUP_PROMPT, `<instructions>:\n${prompt}</instructions>\n\n${QA_PROMPT}`);

    if (response.type === 'function_call') {
        return { type: 'function_call', function: response.function, arguments: response.arguments, messages: ai.messages };
    }
    return { type: 'message', ready: true, messages: ai.messages, content: ai._latestMessage() };
}
  
async function run(messages, prompt) {
    const ai = new AI(messages);
    // if prompt is empty, then say "Choose whatever is most logical to you."
    const userMessage = prompt ? `${prompt}\n\n${CODE_PROMPT}` : `Choose whatever is most logical to you.\n\n${CODE_PROMPT}`;
    const response = await ai.next(userMessage, CODE_FUNCTION);
    
    if (response.type === 'function_call') {
        return { type: 'function_call', function: response.function, arguments: response.arguments };
    }
    return { type: 'message', ready: true, messages: ai.messages, content: ai._latestMessage() };
}

async function code(messages, code, prompt) {
    const ai = new AI(messages);
    const response = await ai.next(`Given the following code:\n${code}\n\n${prompt}\n\n${CODE_UPDATE_PROMPT}`, CODE_FUNCTION);

    if (response.type === 'function_call') {
        return { type: 'function_call', function: response.function, arguments: response.arguments };
    }
    return { type: 'message', ready: true, messages: ai.messages, content: ai._latestMessage() };
}
  
export { AI, setup, run, code };