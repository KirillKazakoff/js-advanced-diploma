import { generateChars } from './charGen';

import {
    Magician, Vampire, Daemon, Bowman, Swordsman, Undead
} from '../components/character/heroes/heroes';;

function initTestAI() {
    const third = new Vampire(4);
    const fourth = new Daemon(4);

    third.position = 3;
    fourth.position = 14;

    third.turn = 'AI';
    fourth.turn = 'AI';

    return [third, fourth];
}

function initTestPL() {
    const first = new Bowman(5);
    const second = new Swordsman(10);

    first.position = 0;
    second.position = 1;

    first.turn = 'PL';
    second.turn = 'PL';

    return [first, second];
}

const initAI = generateChars(1, 2, 'AI');
const initPL = generateChars(1, 2, 'PL');

export { initTestAI, initTestPL, initAI, initPL };
