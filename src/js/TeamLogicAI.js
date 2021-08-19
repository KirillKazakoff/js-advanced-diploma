import gamePlay from './gamePlay';
import gameState from './gameState';
import TeamCommon from './TeamCommon';
import {
    getHighestPropChar, getLowestPropChar, setify,
} from './auxTeam';

export default class TeamLogicAI extends TeamCommon {
    getMoveRange(position) {
        return gamePlay.getPositions('moveRange', position).positions;
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
            });
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
            const { positions } = gamePlay.getPositions('attackRange', position);
            total.push(...positions);
            return total;
        }, []);
    }

    getBestVictim(enemy) {
        try {
            const victimsPos = this.getAttackPos(enemy);
            const victims = enemy.getChars(victimsPos);
            return getLowestPropChar('health', victims);
        } catch {
            return false;
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




    getAcceptableZone(enemy, position) {
        const moveRange = this.getMoveRange(position);
        const friendChars = this.getCharsPositions();
        const enemyChars = enemy.getCharsPositions();

        const acceptablePos = moveRange.filter((movePos) => {
            const friendCheck = friendChars.every((friendPos) => friendPos !== movePos);
            const enemyCheck = enemyChars.every((enemyPos) => enemyPos !== movePos);

            return friendCheck && enemyCheck;
        });

        return acceptablePos;
    }

    getClearZone(position, enemy) {
        const acceptablePos = this.getAcceptableZone(enemy, position);
        const dangerousPos = enemy.getAttackRange();

        const clearPos = acceptablePos.reduce((total, acPosition) => {
            if (!dangerousPos.some((dPosition) => dPosition === acPosition)) {
                total.push(acPosition);
            }
            return setify(total);
        }, []);

        if (!clearPos[0]) {
            return false;
        }
        return clearPos;
    }

    static async giveControlAI(callback) {
        const playerState = gameState.activePos;
        const result = await callback(playerState);

        gameState.activePos = playerState;
        if (result === playerState) {
            gameState.activePos = null;
        }
    }

    checkBestPos(positions, charPos, enemy) {
        if (positions[0]) {
            const victimsArr = [];
            const friendChars = this.getCharsPositions();
            let prevPos = charPos;
            positions.push(charPos);

            positions.forEach((position) => {
                const char = this.getTeamChar(prevPos);
                char.moveTo(position);

                const victim = this.getBestVictim(enemy);
                const attacker = this.getBestAttacker(victim, enemy).position;

                if (victim && !friendChars.some((friendPos) => friendPos === attacker)) {
                    const victimInfo = {
                        ...victim,
                        attackerFuture: attacker,
                        attackerNow: charPos,
                    };
                    victimsArr.push(victimInfo);
                }
                prevPos = position;
            });

            return getLowestPropChar('health', victimsArr);
        }
        return 0;
    }

    safeCheck(charPos, enemy) {
        const clearPos = this.getClearZone(charPos, enemy);

        if (!clearPos) {
            return 0;
        }
        return this.checkBestPos(clearPos, charPos, enemy);
    }

    dangerCheck(charPos, enemy) {
        const acceptablePos = this.getAcceptableZone(enemy, charPos);
        return this.checkBestPos(acceptablePos, charPos, enemy);
    }

    moveToFight(victim) {
        if (victim) {
            const { attackerFuture, attackerNow } = victim;
            const attacker = this.getTeamChar(attackerNow);
            attacker.moveTo(attackerFuture);
            return victim;
        }
        return false;
    }

    explore(enemy, callback) {
        const victimNow = this.getBestVictim(enemy);

        const victims = this.getCharsPositions().reduce((total, position) => {
            const victimInfo = callback.call(this, position, enemy);
            if (victimInfo) {
                total.push(victimInfo);
            }
            return total;
        }, []);

        const weakest = getLowestPropChar('health', victims);
        if ((weakest && !victimNow) || (weakest.health < victimNow.health)) {
            this.moveToFight(weakest);
            return true;
        }
        return false;
    }



    async makeDecisionAI(enemy) {
        const charsInWz = enemy.getAttackPos(this);
        const enemiesInWz = this.getAttackPos(enemy);
        const victim = this.getBestVictim(enemy);
        const attacker = this.getBestAttacker(victim, enemy);

        return TeamLogicAI.giveControlAI(() => {
            if (charsInWz.length === 1) {
                const charPos = charsInWz[0];
                const char = this.getTeamChar(charPos);
                const resVictim = this.safeCheck(charPos, enemy);

                if (resVictim) {
                    this.moveToFight(resVictim);
                    return;
                }

                const clearPos = this.getClearZone(charPos, enemy);
                if (clearPos) {
                    char.moveTo(clearPos[0]);
                    return;
                }

                const weakest = this.dangerCheck(charPos, enemy);
                if (weakest.health < victim.health) {
                    this.moveToFight(weakest);
                    return;
                }
            }

            if (enemiesInWz) {
                if (this.explore(enemy, this.safeCheck)) {
                    return;
                }
                if (this.explore(enemy, this.dangerCheck)) {
                    return;
                }
                return attacker.fight(victim.position)
            }

            if (!charsInWz) {
                if (this.explore(enemy, this.safeCheck)) {
                    return;
                }
                const attackerPos = getHighestPropChar('attack', this.characters).position;
                const clearPos = this.getClearZone(attackerPos, enemy);

                const attacker = this.getTeamChar(attackerPos);
                if (clearPos) {
                    attacker.moveTo(clearPos[0]);
                    return;
                }

                const randomPos = this.getAcceptableZone(enemy, attackerPos)[0];
                attacker.moveTo(randomPos);
                return;
            }

            if (charsInWz && !enemiesInWz) {
                const chars = this.getChars(charsInWz);
                const weakestPos = getLowestPropChar('health', chars).position;
                const weakestChar = this.getTeamChar(weakestPos);
                const clearPos = this.getClearZone(weakestPos, enemy);

                if (this.explore(enemy, this.dangerCheck)) {
                    return;
                }
                if (clearPos) {
                    weakestChar.moveTo(clearPos[0]);
                    return;
                }

                const randomPos = this.getAcceptableZone(enemy, weakestPos)[0];
                weakestChar.moveTo(randomPos);
            }
        });
    }
}











































