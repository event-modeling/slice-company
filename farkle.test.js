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

it('should calculate points correctly when 3 fives are picked on separate rolls', () => {
    const setupEvents = [
        new GameStartedEvent(2),
        new DiceRolledEvent([1, 2, 3, 4, 5, 6]),
        new DicePickedEvent([5]),
        new DiceRolledEvent([2, 3, 4, 5, 6]),
        new DicePickedEvent([5]),
        new DiceRolledEvent([1, 2, 3, 4, 5]),
        new DicePickedEvent([5])
    ];
    const lastTurnPoints = calculatePointsAfterLastTurn(setupEvents);
    expect(lastTurnPoints).toBe(150); // 50 points for each five picked
});
it('should calculate points correctly when 3 fives are on the same roll', () => {
    const setupEvents = [
        new GameStartedEvent(2),
        new DiceRolledEvent([5, 5, 5, 2, 3, 4]),
        new DicePickedEvent([5, 5, 5])
    ];
    const lastTurnPoints = calculatePointsAfterLastTurn(setupEvents);
    expect(lastTurnPoints).toBe(500); // 500 points for three fives on the same roll
});

it('should calculate points correctly when 3 sixes are on the same roll', () => {
    const setupEvents = [
        new GameStartedEvent(2),
        new DiceRolledEvent([6, 6, 6, 2, 3, 4]),
        new DicePickedEvent([6, 6, 6])
    ];
    const lastTurnPoints = calculatePointsAfterLastTurn(setupEvents);
    expect(lastTurnPoints).toBe(600); // 600 points for three fives on the same roll
});

it('should calculate points correctly when 3 twos are on the same roll', () => {
    const setupEvents = [
        new GameStartedEvent(2),
        new DiceRolledEvent([2, 2, 2, 1, 3, 4]),
        new DicePickedEvent([2, 2, 2])
    ];
    const lastTurnPoints = calculatePointsAfterLastTurn(setupEvents);
    expect(lastTurnPoints).toBe(200); // 200 points for three twos on the same roll
});
it('should calculate points correctly when 3 fours are on the same roll', () => {
    const setupEvents = [
        new GameStartedEvent(2),
        new DiceRolledEvent([4, 4, 4, 2, 3, 5]),
        new DicePickedEvent([4, 4, 4])
    ];
    const lastTurnPoints = calculatePointsAfterLastTurn(setupEvents);
    expect(lastTurnPoints).toBe(400); // 400 points for three fours on the same roll
});

it('should calculate points correctly when 3 threes are on the same roll', () => {
    const setupEvents = [
        new GameStartedEvent(2),
        new DiceRolledEvent([3, 3, 3, 1, 4, 5]),
        new DicePickedEvent([3, 3, 3])
    ];
    const lastTurnPoints = calculatePointsAfterLastTurn(setupEvents);
    expect(lastTurnPoints).toBe(300); // 300 points for three threes on the same roll
});

it('should calculate points correctly when 3 ones are on the same roll', () => {
    const setupEvents = [
        new GameStartedEvent(2),
        new DiceRolledEvent([1, 1, 1, 2, 3, 4]),
        new DicePickedEvent([1, 1, 1])
    ];
    const lastTurnPoints = calculatePointsAfterLastTurn(setupEvents);
    expect(lastTurnPoints).toBe(1000); // 1000 points for three ones on the same roll
});

});
