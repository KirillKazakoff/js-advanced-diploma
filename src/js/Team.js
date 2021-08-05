import gamePlay from "./gamePlay";
import TeamCommon from "./TeamCommon";

export default class Team extends TeamCommon {
    getCharPositions() {
        return this.characters.map((char) => char.position);
    }

    getAttackPositions() {
        return this.getCharPositions().reduce((total, position) => {
            total.push(gamePlay.getPositions('attackRange', position).positions);
            return total;
        }, []);
    }

    calcPossibleAttackPos(enemy) {
        const attackPositions = this.getAttackPositions();
        const defencePositions = enemy.getCharPositions();
    
        return defencePositions.reduce((total, defPosition) => {
            attackPositions.forEach((attackArr) => {
                if (attackArr.some((atPosition) => atPosition === defPosition)) {
                    total.push([attackArr[0], defPosition]);
                }    
            })
            return total;
        }, []);
    }

    getPossibleAttackPos(enemy) {
        const allPositions = this.calcPossibleAttackPos(enemy);
        const enemyPositions = allPositions.map((posArray) => posArray[1]);
        return enemyPositions;
    }

    getChars(positions) {
        return positions.reduce((total, position) => {
            const char = this.getTeamChar(position);
            total.push(char);
            return total;
        }, [])
    }
}