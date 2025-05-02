"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePrompt = generatePrompt;
async function generatePrompt(articles) {
    return `Here's your tech news update: ${articles.join(', ')}.`;
}
