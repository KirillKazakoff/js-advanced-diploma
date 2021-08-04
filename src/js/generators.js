import gamePlay from './gamePlay';

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

    return function localFunc(character) {
        const getRandomPosition = () => {
            let column;

            if (character.turn === 'AI') {
                column = getRandomInt(this.boardSize - 2, this.boardSize);
            } else {
                column = getRandomInt(0, 2);
            }
            const row = getRandomInt(0, this.boardSize);

            return row * this.boardSize + column;
        };

        let position = getRandomPosition();
        // eslint-disable-next-line no-loop-func
        while (positions.some((nextPos) => nextPos === position)) {
            position = getRandomPosition();
        }
        positions.push(position);
        return { ...character, position };
    };
}

export default function generateTeam(maxLevel, characterCount, turn) {
    const allowedTypes = turn === 'AI' ? [Daemon, Vampire, Undead] : [Bowman, Swordsman, Magician];
    const generator = characterGenerator(allowedTypes, maxLevel);
    const team = [];

    for (let i = 0; i < characterCount; i += 1) {
        const character = generator.next().value;
        team.push({ ...character, turn });
    }

    const generatePosition = positionGenerator();
    const positionedChars = team.map((character) => generatePosition.bind(gamePlay)(character));
    return positionedChars;
}
