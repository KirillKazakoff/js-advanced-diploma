import Character from '../classes/main';
import setShotAnimation from '../animationBowman';

export default class Bowman extends Character {
    constructor(level) {
        super(level, 'bowman');
        this.attack = 5;
        this.mana = 5;
        this.moveRange = 2;
        this.attackRange = 2;

        this.shotAttack = 5;
        this.upFromScratch();
    }

    async shot(target) {
        this.attack = this.shotAttack;
        const animation = setShotAnimation(this, target);
        animation.play();

        const { duration } = animation.effect.getTiming();
        setTimeout(() => this.fight(target.position), duration / 3);
    }
}
