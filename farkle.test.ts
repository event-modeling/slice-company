// farkle game

import { describe, it, expect } from 'vitest';
import { GameStartedEvent, DiceRolledEvent, DicePickedEvent, calculatePointsAfterLastTurn, TurnEndedEvent } from './farkle';

describe('Farkle Game Tests', () => {
    it('should calculate points correctly', () => {
        const setupEvents = [
            new GameStartedEvent(2),
            new DiceRolledEvent([1, 2, 3, 4, 5, 6]),
            new DicePickedEvent([1, 5]),
            new DiceRolledEvent([2, 3, 4, 5]),
            new DicePickedEvent([5])
        ];
        const lastTurnPoints = calculatePointsAfterLastTurn(setupEvents);
        expect(lastTurnPoints).toBe(200);
    });

    it('should calculate points based only on the current turn', () => {
        const setupEvents = [
            new GameStartedEvent(2),
            new DiceRolledEvent([1, 2, 3, 4, 5, 6]),
            new DicePickedEvent([1, 5]),
            new TurnEndedEvent(1, 300), // Simulating end of a turn with a score that should not be counted
            new DiceRolledEvent([1, 3, 4, 5]),
            new DicePickedEvent([1, 5]),
        ];
        const lastTurnPoints = calculatePointsAfterLastTurn(setupEvents);
        expect(lastTurnPoints).toBe(150); // Expecting points only from the current turn's picked dice
    });
});
