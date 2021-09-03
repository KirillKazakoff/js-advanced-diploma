import './css/defaultStyle.css';
import './css/style.css';
import './css/fonts.css';

import Controller from './controller/controller';

window.onload = () => {
    const controller = new Controller();
    controller.init();
    const range = controller.teamPL.heroes[0].getMoveRange();
    const bowman = controller.teamPL.heroes[0];
}
