export default class Character {
    constructor(level, type = 'generic') {
        if (new.target.name === 'Character') {
            throw new Error('you can\'t invoke parent class');
        }

        this.level = level;
        this.health = 50;
        this.type = type;

        this.turn;
        this.position;
    }

    levelUp() {
        if (this.health > 25) {
            this.attack += this.attack * 0.3;
            this.defence += this.defence * 0.3;
        }

        this.level += 1;
        this.health += 80;
        
        if (this.health > 100) {
            this.health = 100;
        }
    }

    upFromScratch()  {
        const levelNow = this.level;
        for (let i = 1; i < levelNow; i += 1) {
            this.levelUp();    
        }
    }
}
