export default class TeamSeparate {
    constructor(team) {
        this.characters = team;
    }

    findHighestPropChar(prop) {
        this.characters.sort((a, b) => b[prop] - a[prop]);
        return this.characters[0];
    }

    findLowestPropChar(prop) {
        this.characters.sort((a, b) => a[prop] - b[prop]);
        return this.characters[0];
    }
}