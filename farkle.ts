export class DiceRolledEvent {
    constructor(public diceResults: number[]) {} // Array representing each dice roll result

    getDiceResults(): number[] {
        return this.diceResults;
    }
}

export class GameStartedEvent {
    constructor(public playerCount: number) {}

    getPlayerCount(): number {
        return this.playerCount;
    }
}

export class DicePickedEvent {
    constructor(public pickedDice: number[]) {} // Array representing the dice picked by the player

    getPickedDice(): number[] {
        return this.pickedDice;
    }
}
export class TurnEndedEvent {
    constructor(public playerID: number, public turnScore: number) {}

    getPlayerID(): number {
        return this.playerID;
    }

    getTurnScore(): number {
        return this.turnScore;
    }
}

export function calculatePointsAfterLastTurn(events: any[]): number {
    // Find the index of the last TurnEndedEvent to only consider events after this
    const lastTurnEndedIndex = events.map(event => event.constructor.name).lastIndexOf('TurnEndedEvent');
    return events.slice(lastTurnEndedIndex + 1).reduce((points, event) => {
        if (event instanceof DicePickedEvent) {
            return points + event.getPickedDice().reduce((sum, dice) => {
                if (dice === 1) return sum + 100;
                if (dice === 5) return sum + 50;
                return sum;
            }, 0);
        }
        return points;
    }, 0);
}
