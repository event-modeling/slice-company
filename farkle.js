function DiceRolledEvent(diceResults) {
    this.diceResults = diceResults; // Array representing each dice roll result

    this.getDiceResults = function() {
        return this.diceResults;
    };
}

function GameStartedEvent(playerCount) {
    this.playerCount = playerCount;

    this.getPlayerCount = function() {
        return this.playerCount;
    };
}

function DicePickedEvent(pickedDice) {
    this.pickedDice = pickedDice; // Array representing the dice picked by the player

    this.getPickedDice = function() {
        return this.pickedDice;
    };
}

function TurnEndedEvent(playerID, turnScore) {
    this.playerID = playerID;
    this.turnScore = turnScore;

    this.getPlayerID = function() {
        return this.playerID;
    };

    this.getTurnScore = function() {
        return this.turnScore;
    };
}

function calculatePointsAfterLastTurn(events) {
    // Find the index of the last TurnEndedEvent to only consider events after this
    const lastTurnEndedIndex = events.map(event => event.constructor.name).lastIndexOf('TurnEndedEvent');
    return events.slice(lastTurnEndedIndex + 1).reduce(function(points, event) {
        if (event instanceof DicePickedEvent) {
            const pickedDice = event.getPickedDice();
            const counts = pickedDice.reduce((acc, dice) => {
                acc[dice] = (acc[dice] || 0) + 1;
                return acc;
            }, {});

            let additionalPoints = 0;
            for (let diceValue = 1; diceValue <= 6; diceValue++) {
                if (counts[diceValue] === 3) {
                    additionalPoints += diceValue === 1 ? 1000 : diceValue * 100;
                    break; // Assuming only one set of 3 of a kind is scored per turn
                }
            }

            return points + additionalPoints + pickedDice.reduce((sum, dice) => {
                if (dice === 1 && counts[dice] !== 3) return sum + 100;
                if (dice === 5 && counts[dice] !== 3) return sum + 50;
                return sum;
            }, 0);
        }
        return points;
    }, 0);
}
export { DiceRolledEvent, GameStartedEvent, DicePickedEvent, TurnEndedEvent, calculatePointsAfterLastTurn };
