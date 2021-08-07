import gamePlay from "./gamePlay";
import gameState from "./gameState";
import TeamCommon from "./TeamCommon";
import { getMoveRange, getHighestPropChar, getLowestPropChar, setify } from "./auxTeam";

export default class Team extends TeamCommon {
    setTeamCharPos(prevPos, nextPos) {
        const index = this.characters.findIndex((character) => character.position === prevPos);
        this.characters[index].position = nextPos;
    }

    getCharsPositions() {
        return this.characters.map((char) => char.position);
    }

    getMoveObjs() {
        return this.getCharsPositions().reduce((total, position) => {
            total.push(gamePlay.getPositions('moveRange', position));
            return total;
        }, []);
    }

    getMoveRange() {
        return this.getMoveObjs().reduce((total, posObj) => {
            const { positions } = posObj;
            positions.forEach((position) => total.push(position));
            return total;
        }, [])
    }





    getAttackPairs() {
        return this.getCharsPositions().reduce((total, position) => {
            total.push(gamePlay.getPositions('attackRange', position).positions);
            return total;
        }, []);
    }

    getPairsInWarZone(enemy) {
        const attackPositions = this.getAttackPairs();
        const defencePositions = enemy.getCharsPositions();

        return defencePositions.reduce((total, defPosition) => {
            attackPositions.forEach((attackArr) => {
                if (attackArr.some((atPosition) => atPosition === defPosition)) {
                    total.push([attackArr[0], defPosition]);
                }
            })
            return total;
        }, []);
    }

    getAttackPos(enemy) {
        const allPositions = this.getPairsInWarZone(enemy);
        const enemyPositions = allPositions.map((posArray) => posArray[1]);

        if (typeof enemyPositions[0] !== 'number') {
            return 0;
        }

        return setify(enemyPositions);
    }

    getAttackRange() {
        return this.getCharsPositions().reduce((total, position) => {
            const positions = gamePlay.getPositions('attackRange', position).positions;
            total.push(...positions);
            return total;
        }, []);
    }

    getBestVictim(enemy) {
        try {
            const victimsPos = this.getAttackPos(enemy);
            const victims = enemy.getChars(victimsPos);
            return getLowestPropChar('defence', victims);
        }
        catch {
            return 0;
        }
    }

    getBestAttacker(victim, enemy) {
        const pairs = this.getPairsInWarZone(enemy);
        const attackers = pairs.reduce((total, pair) => {
            pair.some((position) => {
                const condition = position === victim.position;

                if (condition) {
                    total.push(pair[0]);
                }
                return condition;
            });

            return total;
        }, []);

        const attackerChars = this.getChars(attackers);
        return getHighestPropChar('attack', attackerChars);
    }

    getChars(positions) {
        return positions.reduce((total, position) => {
            const char = this.getTeamChar(position);
            total.push(char);
            return total;
        }, [])
    }






    getClearZone(position, enemy) {
        const friendChars = this.getCharsPositions();
        const dangerousPos = enemy.getAttackRange();
        const movePos = getMoveRange(position);

        const clearPos = movePos.reduce((total, mPosition) => {
            if (!dangerousPos.some((dPosition) => dPosition === mPosition)) {
                total.push(mPosition);
            }
            return setify(total);
        }, [])

        return clearPos.reduce((total, pos) => {
            if (!friendChars.some((friendPos) => friendPos === pos)) {
                total.push(pos);
            }
            return total;
        }, []);
    }

    giveControlAI(callback) {
        const playerState = gameState.activePos;

        callback();
        gameState.activePos = playerState;
    }

    checkBestPos(clearPos, charPos, enemy) {
        if (clearPos[0]) {
            let prevPos = charPos;
            const victimsArr = [];

            clearPos.forEach((position) => {
                gameState.activePos = prevPos;
                this.moveActiveChar(position);
                const victim = this.getBestVictim(enemy);

                if (victim) {
                    const victimInfo = {
                        ...victim,
                        attacker: position,
                    }
                    victimsArr.push(victimInfo);
                }
                prevPos = position;
            });
            gameState.activePos = prevPos;
            this.moveActiveChar(charPos);

            const result = getLowestPropChar('defence', victimsArr);
            console.log(result);
        }
    }

    check(position, enemy) {
        const clearPos = this.getClearZone(position, enemy);

        return this.checkBestPos(clearPos, position, enemy);
    }

    decide(enemy) {
        const charsInWz = enemy.getAttackPos(this);
        const enemiesInWz = this.getAttackPos(enemy);
        
        console.log(charsInWz);
        this.giveControlAI(() => {

            if (charsInWz.length === 1) {
                this.check(charsInWz[0], enemy);
                return;
            }
            if (enemiesInWz) {
                const victim = this.getBestVictim(enemy);
                const attacker = this.getBestAttacker(victim, enemy);
                gameState.activePos = attacker.position;
                gamePlay.teams.attackChar(victim.position);
                return;
            }
            if (!charsInWz) {
                const attacker = getHighestPropChar('attack', this.characters);
                this.check(attacker.position, enemy);
            }
            if (charsInWz && !enemiesInWz) {
                const chars = this.getChars(charsInWz);
                const weakestPos = getLowestPropChar('defence', chars).position;
                const clearPos = this.getClearZone(weakestPos, enemy);

                if (clearPos.length > 0) {
                    gameState.activePos = weakestPos;
                    this.moveActiveChar(clearPos[0]);
                }
            }
            else return 'should do something else';
        })

    }

}


