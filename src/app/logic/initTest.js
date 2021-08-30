import Characters from '../../logic/characters';
import {
    Magician, Vampire, Daemon, Bowman, Swordsman, Undead
} from '../../components/character/heroes/heroes';;

const first = new Bowman(5);
const second = new Swordsman(5);
const third = new Vampire(4);
const fourth = new Daemon(4);

first.position = 0;
second.position = 7;
third.position = 6;
fourth.position = 13;

first.turn = 'PL';
second.turn = 'PL';
third.turn = 'AI';
fourth.turn = 'AI';

const initTest = () => new Characters([
    first, second, third, fourth,
]);

export default initTest;

