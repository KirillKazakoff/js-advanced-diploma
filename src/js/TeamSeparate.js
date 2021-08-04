export default class TeamSeparate {
    constructor(team) {
        this.team = team;
    }

    getHighestPropChar(prop) {
        this.team.sort((a, b) => b[prop] - a[prop]);
        return this.team[0];
    }

    getLowestPropChar(prop) {
        this.team.sort((a, b) => a[prop] - b[prop]);
        return this.team[0];
    }

    getCharPositions() {
        return this.team.map((char) => char.position);
    }
      

}