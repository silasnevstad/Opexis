import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/build/pdf';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';

GlobalWorkerOptions.workerSrc = pdfjsWorker;

export async function pdfToText(file) {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = function(event) {
      const pdfData = new Uint8Array(event.target.result);
      getDocument(pdfData).promise.then(async (pdf) => {
        let text = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map(item => item.str).join(' ');
        }
        resolve(text);
      }).catch(reject);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

export const parseQuestionResponsesToString = (questions) => {
  let questionResponses = '';
  questions.forEach((question, index) => {
    if (question.detailedAnswer === '' && question.selectedChoice === -1) {
      return;
    }
    const answer = question.detailedAnswer !== '' ? question.detailedAnswer : question.possibleAnswers[question.selectedChoice];
    questionResponses += `${answer}\n`;
  });
  return questionResponses;
}

export const parseCodeToString = (files) => {
  let code = '';
  files.forEach((file) => {
    code += `File: ${file.filename}\n` + "```\n"
    code += `${file.code}\n\n`;
    code += "```\n\n"
  });
  return code;
}

export const GLOBAL_FUNCTIONS = [
  {
    "name": "make_questions",
    "description": "Makes a list of questions and possible answers to clarify the user's intent",
    "parameters": {
      "type": "object",
      "properties": {
        "questions": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "question": { "type": "string" },
              "possibleAnswers": { "type": "array", "items": { "type": "string" } }
            },
            "required": ["question", "possibleAnswers"]
          }
        }
      },
      "required": ["questions"]
    }
  },
  {
    "name": "write_code",
    "description": "Returns code to for a user's intent given a list of files and their code",
    "parameters": {
      "type": "object",
      "properties": {
        "files": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "filename": { "type": "string" },
              "code": { "type": "string" }
            },
            "required": ["filename", "code"]
          }
        }
      },
      "required": ["files"]
    }
  }
];

export const QUESTION_FUNCTION =  {
  "name": "make_questions",
  "description": "Makes a list of questions and possible answers to clarify the user's intent",
  "parameters": {
    "type": "object",
    "properties": {
      "questions": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "question": { "type": "string" },
            "possibleAnswers": { "type": "array", "items": { "type": "string" } }
          },
          "required": ["question", "possibleAnswers"]
        }
      }
    },
    "required": ["questions"]
  }
};

export const CODE_FUNCTION = {
  "name": "write_code",
  "description": "Returns code to for a user's intent given a list of files and their code",
  "parameters": {
    "type": "object",
    "properties": {
      "files": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "filename": { "type": "string" },
            "code": { "type": "string" }
          },
          "required": ["filename", "code"]
        }
      }
    },
    "required": ["files"]
  }
};

export const examplesIdeas = [
  'A simple python pong game',
  'Snake in python with keyboard input',
  'A simple python calculator',
  'A python web scraper',
  'A quiz app in swift',
  'A weather app in swiftUI',
  'A currency converter in javascript',
  'Maze solver in python',
  'Tic Tac Toe in ReactJS',
  'Morse code translator in javascript',
  'Reminder app in SwiftUI',
  'Virtual Piano App in JavaScript',
  'Flappy Bird Clone in Swift',
  'Simple Portfolio Website',
  'Basic image editor in python using pillow',
  'Simple chatbot in Python',
  'Markdown previewer in React',
  'Rock paper scissors game in Java',
  'Countdown timer in Swift',
  'Simple survey form in HTML/CSS',
  'Styled dropdown menu in React',
  'Emoji interpreter in Python',
  '8-bit music composer in JavaScript',
  'A simple hangman game in Java',
  'Rubik\'s cube solver in C++',
  'Palindrome checker in JavaScript',
  'Random password generator in Python',
  'Checkers game in Java',
  'Interactive fireworks display in JavaScript',
  'Bayes net classifier in Python',
  'Leetspeak translator in JavaScript',
  'Conway\'s Game of Life simulation in Python',
  'Personal finance tracker in Swift',
  'Monte Carlo simulation in Python',
  'Langton\'s Ant simulation in JavaScript',
  'Fractal generator in JavaScript',
  'Particle system simulation in Processing',
  'A pathfinding algorithm visualizer',
  'Neural network from scratch in Python',
  'Euler method simulation in Python',
  'Bubble sort visualizer in JavaScript',
  'Perlin noise terrain generator in Python',
  'Travelling Salesman Problem solver in C++',
  'Boids flocking behavior simulation in JavaScript',
  'K-means clustering from scratch in Python',
  'Sudoku solver in Python',
  'Ray casting engine in JavaScript',
  'Decision tree algorithm from scratch in Python',
  'Simplex noise generator in JavaScript',
  'Pendulum simulation in Python',
  'Turing machine simulator in JavaScript',
];