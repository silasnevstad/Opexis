import React, { useContext } from "react";
import { SETUP_PROMPT, QA_PROMPT, CODE_PROMPT, CODE_UPDATE_PROMPT } from "./prompts"; // FOLLOWUP_PROMPT
import { GLOBAL_FUNCTIONS, CODE_FUNCTION, QUESTION_FUNCTION } from "./utils";
const { Configuration, OpenAIApi } = require("openai");

// [NOTE] - gpt-4 works best for now (3.5 is faster but provides a much worse experience)
// gpt-3.5-turbo-0613 - 250,000 TPM
// gpt-4-0613 - 250,000 TPM
class AI {
    constructor(messages = [], model = 'gpt-4', temperature = 0.3, apiKey = process.env.REACT_APP_OPENAI_API_KEY) {
        this.model = model;
        this.temperature = temperature;
        this.messages = messages;
        this.functions = GLOBAL_FUNCTIONS;

        // Initialize OpenAI with provided API key (it might be "" or undefined/null if the user hasn't logged in yet or doesn't have an API key so we need to check for that)
        let configuration;
        if (apiKey && apiKey !== "") {
            configuration = new Configuration({ apiKey: apiKey });
        } else {
            configuration = new Configuration({ apiKey: process.env.REACT_APP_OPENAI_API_KEY });
        }
        this.openai = new OpenAIApi(configuration);
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
            // console.log(`Attempt ${attempt + 1}...`);
            try {
                response = await this.openai.createChatCompletion({
                    model: this.model,
                    messages: this.messages,
                    temperature: this.temperature,
                    functions: [functionCall],
                });
                // console.log('api response', response.data);

                if (response.data.choices[0].finish_reason === 'function_call') {
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

async function setup(messages, prompt, userApiKey) {
    const ai = new AI(messages, 'gpt-4', 0.3, userApiKey);
    const response = await ai.start(SETUP_PROMPT, `<instructions>:\n${prompt}</instructions>`);

    if (response.type === 'function_call') {
        return { type: 'function_call', function: response.function, arguments: response.arguments, messages: ai.messages };
    }
    return { type: 'message', ready: true, messages: ai.messages, content: ai._latestMessage() };
}
  
async function run(messages, prompt, userApiKey) {
    const ai = new AI(messages, 'gpt-4', 0.3, userApiKey);
    const userMessage = prompt === '' ?  `The clarification step is done and completed and you now must move on to the code writing portoin using write_code.\n${CODE_PROMPT}` : `Here is some more clarification (question: answer)\n${prompt}\n\n${CODE_PROMPT}`;
    const response = await ai.next(userMessage, CODE_FUNCTION);
    
    if (response.type === 'function_call') {
        return { type: 'function_call', function: response.function, arguments: response.arguments };
    }
    return { type: 'message', ready: true, messages: ai.messages, content: ai._latestMessage() };
}

async function code(messages, code, prompt, userApiKey) {
    const ai = new AI(messages, 'gpt-4', 0.3, userApiKey);
    const response = await ai.next(`Given the following code:\n${code}\n\n${prompt}\n\n${CODE_UPDATE_PROMPT}`, CODE_FUNCTION);

    if (response.type === 'function_call') {
        return { type: 'function_call', function: response.function, arguments: response.arguments };
    }
    return { type: 'message', ready: true, messages: ai.messages, content: ai._latestMessage() };
}
  
export { AI, setup, run, code };