import './css/defaultStyle.css';
import './css/style.css';
import './css/fonts.css';

import Controller from './controller/controller';
import getPositions from './lib/utils/positions.utl';

window.onload = () => {
    const controller = new Controller();
    controller.init();
    const range = controller.teamPL.heroes[0].getMoveRange();
    const bowman = controller.teamPL.heroes[0];
    const positions = getPositions(bowman.moveRange, bowman.position);
    // console.log(positions);
    // console.log(range);
}



// const a = {
//     bebra: '100',
//     zebra: '200',
// }

// const array = [
//     a, a, a
// ]

// const array2 = array;
// console.log(array)
// array.splice(0, 1)

// console.log(array)
// console.log(array2)