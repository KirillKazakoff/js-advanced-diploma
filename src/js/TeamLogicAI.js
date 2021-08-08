import gamePlay from "./gamePlay";
import gameState from "./gameState";
import TeamCommon from "./TeamCommon";
import { getMoveRange, getHighestPropChar, getLowestPropChar, setify, attackFinally } from "./auxTeam";

export default class TeamLogicAI extends TeamCommon {
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

        const check = clearPos.reduce((total, pos) => {
            if (!friendChars.some((friendPos) => friendPos === pos)) {
                total.push(pos);
            }
            return total;
        }, []);

        if (!check[0]) {
            return false;
        }
        return check;
    }

    giveControlAI(callback) {
        const playerState = gameState.activePos;

        callback();
        gameState.activePos = playerState;
    }

    checkBestPos(positions, charPos, enemy) {
        if (positions[0]) {
            const victimsArr = [];
            const friendChars = this.getCharsPositions();

            let prevPos = charPos;
            positions.push(charPos);

            positions.forEach((position) => {
                gameState.activePos = prevPos;
                this.moveActiveChar(position);
                const victim = this.getBestVictim(enemy);
                const attacker = this.getBestAttacker(victim, enemy).position;

                if (victim && !friendChars.some((friendPos) => friendPos === attacker)) {
                    const victimInfo = {
                        ...victim,
                        attackerFuture: attacker,
                        attackerNow: charPos,
                    }
                    victimsArr.push(victimInfo);
                }
                prevPos = position;
            });

            return getLowestPropChar('defence', victimsArr);
        }
    }

    safeCheck(charPos, enemy) {
        const clearPos = this.getClearZone(charPos, enemy);

        if (!clearPos) {
            return 0;
        }
        return this.checkBestPos(clearPos, charPos, enemy);
    }

    dangerCheck(charPos, enemy) {
        const movePos = getMoveRange(charPos);
        return this.checkBestPos(movePos, charPos, enemy);
    }

    moveToFight(victim) {
        if (victim) {
            const { attackerFuture, attackerNow } = victim;

            gameState.activePos = attackerNow;
            this.moveActiveChar(attackerFuture);
            return victim;
        }
    }

    runTo(from, to) {
        gameState.activePos = from;
        this.moveActiveChar(to);
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

        const weakest = getLowestPropChar('defence', victims);
        if (weakest && !victimNow || weakest.defence < victimNow.defence) {
            this.moveToFight(weakest);
            return true;
        }
    }


    
    makeDecisionAI(enemy) {
        const charsInWz = enemy.getAttackPos(this);
        const enemiesInWz = this.getAttackPos(enemy);
        const victim = this.getBestVictim(enemy);
        const attacker = this.getBestAttacker(victim, enemy);

        this.giveControlAI(() => {
            if (charsInWz.length === 1) {
                const charPos = charsInWz[0];
                const resVictim = this.safeCheck(charPos, enemy);

                if (resVictim) {
                    this.moveToFight(resVictim);
                    return
                }

                const clearPos = this.getClearZone(charPos, enemy);
                if (clearPos) {
                    this.runTo(charPos, clearPos[0]);
                    return;
                }

                const weakest = this.dangerCheck(charPos, enemy);
                if (weakest.defence < victim.defence) {
                    this.moveToFight(weakest);
                    return;
                }
                attackFinally(charPos, victim.position);
                return;
            }

            if (enemiesInWz) {
                if (this.explore(enemy, this.dangerCheck)) {
                    return;
                };
                attackFinally(attacker.position, victim.position);
                return;
            }

            if (!charsInWz) {
                if (this.explore(enemy, this.safeCheck)) {
                    return;
                };
                const attackerPos = getHighestPropChar('attack', this.characters).position;
                const clearPos = this.getClearZone(attackerPos, enemy);

                if (clearPos) {
                    this.runTo(attackerPos, clearPos[0]);
                }
                return
            }

            if (charsInWz && !enemiesInWz) {
                const chars = this.getChars(charsInWz);
                const weakestPos = getLowestPropChar('defence', chars).position;
                const clearPos = this.getClearZone(weakestPos, enemy);

                if (clearPos) {
                    this.runTo(weakestPos, clearPos[0]);
                }
                if (this.explore(enemy, this.dangerCheck)) {
                    return;
                };
                const randomPos = getMoveRange(weakestPos)[0];

                this.runTo(weakestPos, randomPos);
            }
        })

    }

}


