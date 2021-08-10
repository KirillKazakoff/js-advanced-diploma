import gamePlay from './gamePlay';
import gameState from './gameState';

import { getRandomInt } from './utilsSec';
import {
    Bowman, Swordsman, Magician, Daemon, Vampire, Undead,
} from './classes/importAll';

function* characterGenerator(allowedTypes, maxLevel) {
    while (true) {
        const typeIndex = getRandomInt(0, allowedTypes.length);
        const levelIndex = getRandomInt(1, maxLevel + 1);
        const character = new allowedTypes[typeIndex](levelIndex);

        yield character;
    }
}

function positionGenerator() {
    const positions = [];
    const { boardSize } = gamePlay;

    return function localFunc(character) {
        const getRandomPosition = () => {
            let column;

            if (character.turn === 'AI') {
                column = getRandomInt(boardSize - 2, boardSize);
            } else {
                column = getRandomInt(0, 2);
            }
            const row = getRandomInt(0, boardSize);

            return row * boardSize + column;
        };

        let position = getRandomPosition();
        // eslint-disable-next-line no-loop-func
        while (positions.some((nextPos) => nextPos === position)) {
            position = getRandomPosition();
        }
        positions.push(position);
        character.position = position;
        return character;
    };
}

export function getPositionedChars(characters) {
    const generatePosition = positionGenerator();
    const positionedChars = characters.map((character) => generatePosition(character));
    return positionedChars;
}

export function generateChars(maxLevel, characterCount, turn) {
    const allowedTypes = turn === 'AI' ? [Daemon, Vampire, Undead] : [Bowman, Swordsman, Magician];
    const generator = characterGenerator(allowedTypes, maxLevel);
    const team = [];

    for (let i = 0; i < characterCount; i += 1) {
        const character = generator.next().value;
        character.turn = turn;
        team.push(character);
    }

    return getPositionedChars(team);
}


export function genPlayerReinforceProps() {
    const { theme } = gameState;
    let amount = null;
    let level = null;

    switch (theme) {
        case 'prairie':
            break;
        case 'desert':
            level = 1;
            amount = 1;
            break;
        case 'arctic':
            level = 2;
            amount = 2;
            break;
        case 'mountain':
            level = 3;
            amount = 2;
            break;
    }
    return { amount, level };
}