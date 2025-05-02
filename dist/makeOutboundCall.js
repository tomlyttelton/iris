"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeOutboundCall = makeOutboundCall;
const axios_1 = __importDefault(require("axios"));
async function makeOutboundCall(phoneNumber, message) {
    await axios_1.default.post('https://api.vapi.ai/call', {
        to: phoneNumber,
        text: message,
        voice: 'en-US-Wavenet-D'
    }, {
        headers: {
            Authorization: `Bearer ${process.env.VAPI_API_KEY}`
        }
    });
}
