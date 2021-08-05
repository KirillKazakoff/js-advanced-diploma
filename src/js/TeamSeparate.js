import gamePlay from "./gamePlay";

export default class TeamSeparate {
    constructor(team) {
        this.team = team;
    }
    
    getHighestPropChar(prop, arr) {
        arr.sort((a, b) => b[prop] - a[prop]);
        return arr[0];
    }
    
    getLowestPropChar(prop, arr) {
        arr.sort((a, b) => a[prop] - b[prop]);
        return arr[0];
    }

    getCharPositions() {
        return this.team.map((char) => char.position);
    }
      
    getAttackPositions() {
        return this.getCharPositions().reduce((total, position) => {
            total.push(...gamePlay.getPositions('attackRange', position).positions);
            return total;
        }, []);
    }

    calcPossibleAttackPos(enemy) {
        const attackPositions = this.team.getAttackPositions();
        const enemyPositions = enemy.getCharPositions();
    
        return enemyPositions.reduce((total, plPosition) => {
            if (attackPositions.some((atPosition) => atPosition === plPosition)) {
                total.push(plPosition);
            }
            return total;
        }, []);
    }


}