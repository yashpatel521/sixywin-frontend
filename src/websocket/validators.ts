/**
 * WebSocket Message Validators
 */

import type { ValidatedMessage } from "./types";

export class MessageValidator {
  /**
   * Validates incoming WebSocket message structure
   */
  static validate(data: any): ValidatedMessage | null {
    try {
      if (!data || typeof data !== "object") {
        console.warn("Invalid message format: not an object", data);
        return null;
      }

      const { type, payload, timestamp, requestId } = data;

      // Handle different message formats from server
      let messageType = type;
      let messagePayload = payload;
      let messageTimestamp = timestamp;

      if (!messageType || typeof messageType !== "string") {
        // If no type field, try to infer from other fields
        if (data.success !== undefined || data.message !== undefined) {
          // This looks like a server response, create a generic type
          messageType = "server_response";
          messagePayload = data;
          messageTimestamp = data.timestamp || new Date().toISOString();
        } else {
          console.warn(
            "Invalid message format: missing or invalid type field",
            data
          );
          return null;
        }
      }

      // Timestamp is optional for incoming messages
      if (!messageTimestamp) {
        messageTimestamp = new Date().toISOString();
      }

      return {
        type: messageType,
        payload: messagePayload || data,
        timestamp: messageTimestamp,
        requestId,
      };
    } catch (error) {
      console.error("Message validation error:", error);
      return null;
    }
  }

  /**
   * Validates outgoing message before sending
   */
  static validateOutgoing(message: any): boolean {
    if (!message.type || typeof message.type !== "string") {
      console.error("Invalid message: type is required and must be a string");
      return false;
    }
    return true;
  }

  /**
   * Validates lottery ticket data
   */
  static validateTicket(numbers: number[], bid: number): boolean {
    if (!Array.isArray(numbers) || numbers.length === 0) {
      console.warn("Invalid lottery numbers");
      return false;
    }

    if (bid <= 0) {
      console.warn("Bid must be greater than 0");
      return false;
    }

    return true;
  }

  /**
   * Validates game action
   */
  static validateGameAction(action: string): boolean {
    if (!action?.trim()) {
      console.warn("Game action type cannot be empty");
      return false;
    }
    return true;
  }
}
