import './powershot.css';
import powershotT from "./powershot.tmp";
import engine from '../../../../../lib/engine/engine';

import { getCellCoords, getRotationDegree } from '../../../../../lib/utils/animations.utl';

export default function powershot(attacker, victim) {
    const container = attacker.getHtml();
    const attackerCoords = getCellCoords(attacker);
    const victimCoords = getCellCoords(victim);

    const skillHtml = engine(powershotT(attackerCoords));
    container.insertAdjacentHTML('beforeEnd', skillHtml);

    //calc degree
    const degree = getRotationDegree(attackerCoords, victimCoords);

    const animation = arrowTrace.animate([
        { transform: `rotate(${degree}deg) scaleX(0)` },
        { transform: `rotate(${degree}deg) scaleX(10)` },
    ], {
        duration: 1500,
        iterations: 1,
        easing: 'ease',
    });

    animation.addEventListener('finish', () => {
        arrowTrace.className = 'effect-stop';
    })
    animation.pause();
    return animation;
}



















































// import { getCellCoords, calcAnimationDegree } from "./utilsSec";

// const container = document.querySelector('#game-container');

// export default function setShotAnimation(attacker, victim) {
//     return new Promise((resolve) => {
//         const attackerCoords = getCellCoords(attacker);
//         const victimCoords = getCellCoords(victim);

//         const arrowTrace = document.createElement('div');
//         arrowTrace.className = 'arrow-trace';

//         const { top: attackerTop, left: attackerLeft } = attackerCoords;
//         arrowTrace.style.left = `${attackerLeft}px`;
//         arrowTrace.style.top = `${attackerTop}px`;

//         container.append(arrowTrace);

//         //calc degree
//         const degree = calcAnimationDegree(attackerCoords, victimCoords);

//         const animation = arrowTrace.animate([
//             { transform: `rotate(${degree}deg) scaleX(0)` },
//             { transform: `rotate(${degree}deg) scaleX(10)` },
//         ], {
//             duration: 1500,
//             iterations: 1,
//             easing: 'ease',
//         });

//         animation.addEventListener('begin', () => {
//             console.log('hello');
//         })

//         animation.addEventListener('finish', () => {
//             arrowTrace.style.left = `${attackerLeft}px`;
//             arrowTrace.style.top = `${attackerTop}px`;
//             resolve();
//         });

//         arrowTrace.addEventListener('animationstart', () => {
//             console.log('hell');
//         })
//         animation.pause();
//     })

// }






















