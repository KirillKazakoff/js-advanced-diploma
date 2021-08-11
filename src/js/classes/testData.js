import TeamCommon from '../TeamCommon';
import {
    Magician, Vampire, Daemon, Bowman,
} from './importAll';

const bowman1 = new Bowman(3);
const magician1 = new Magician(3);
const vampire1 = new Vampire(3);
const daemon1 = new Daemon(3);

bowman1.position = 0;
magician1.position = 7;
vampire1.position = 6;
daemon1.position = 13;

bowman1.turn = 'player';
magician1.turn = 'player';
vampire1.turn = 'AI';
daemon1.turn = 'AI';

const data1 = new TeamCommon([
    bowman1, magician1, vampire1, daemon1,
]);

export default data1;
