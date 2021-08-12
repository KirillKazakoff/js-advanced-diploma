import TeamCommon from '../TeamCommon';
import {
    Magician, Vampire, Daemon, Bowman, Swordsman
} from './importAll';

const first = new Bowman(5);
const second = new Bowman(5);
const third = new Vampire(4);
const fourth = new Vampire(4);


first.position = 0;
second.position = 7;
third.position = 6;
fourth.position = 13;

first.turn = 'player';
second.turn = 'player';
third.turn = 'AI';
fourth.turn = 'AI';

const data1 = new TeamCommon([
    first, second, third, fourth,
]);

export default data1;

