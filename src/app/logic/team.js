import state from '../state/state';
import { setify, getLowestPropChar, getHighestPropChar } from '../lib/utils/utils';
import getPositions from '../lib/utils/positions.utl';

    function getAttackPairs() {
        return this.getCharsPositions().reduce((total, position) => {
            total.push(getPositions('attackRange', position).positions);
            return total;
        }, []);
    }

    function getPairsInWarZone(enemy) {
        const attackPositions = getAttackPairs();
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

    function getAttackPos(enemy) {
        const allPositions = getPairsInWarZone(enemy);
        const enemyPositions = allPositions.map((posArray) => posArray[1]);

        if (typeof enemyPositions[0] !== 'number') {
            return 0;
        }

        return setify(enemyPositions);
    }

    function getAttackRange() {
        return this.getCharsPositions().reduce((total, position) => {
            const { positions } = getPositions('attackRange', position);
            total.push(...positions);
            return total;
        }, []);
    }

    function getBestVictim(enemy) {
        try {
            const victimsPos = getAttackPos(enemy);
            const victims = enemy.getChars(victimsPos);
            return getLowestPropChar('health', victims);
        } catch {
            return false;
        }
    }

    function getBestAttacker(victim, enemy) {
        const pairs = getPairsInWarZone(enemy);
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




    function getAcceptableZone(enemy, position) {
        const moveRange = getPositions('moveRange', position).positions;
        const friendChars = this.getCharsPositions();
        const enemyChars = enemy.getCharsPositions();

        const acceptablePos = moveRange.filter((movePos) => {
            const friendCheck = friendChars.every((friendPos) => friendPos !== movePos);
            const enemyCheck = enemyChars.every((enemyPos) => enemyPos !== movePos);

            return friendCheck && enemyCheck;
        });

        return acceptablePos;
    }

    function getClearZone(position, enemy) {
        const acceptablePos = getAcceptableZone(enemy, position);
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

    async function giveControlAI(callback) {
        const playerState = state.activePos;
        const result = await callback(playerState);

        state.activePos = playerState;
        if (result === playerState) {
            state.activePos = null;
        }
    }

    function checkBestPos(positions, charPos, enemy) {
        if (positions[0]) {
            const victimsArr = [];
            const friendChars = this.getCharsPositions();
            let prevPos = charPos;
            positions.push(charPos);

            positions.forEach((position) => {
                const char = this.getTeamChar(prevPos);
                char.moveTo(position);

                const victim = getBestVictim(enemy);
                const attacker = getBestAttacker(victim, enemy).position;

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

    function safeCheck(charPos, enemy) {
        const clearPos = getClearZone(charPos, enemy);

        if (!clearPos) {
            return 0;
        }
        return checkBestPos(clearPos, charPos, enemy);
    }

    function dangerCheck(charPos, enemy) {
        const acceptablePos = getAcceptableZone(enemy, charPos);
        return checkBestPos(acceptablePos, charPos, enemy);
    }

    function moveToFight(victim) {
        if (victim) {
            const { attackerFuture, attackerNow } = victim;
            const attacker = this.getTeamChar(attackerNow);
            attacker.moveTo(attackerFuture);
            return victim;
        }
        return false;
    }

    function explore(enemy, callback) {
        const victimNow = getBestVictim(enemy);

        const victims = this.getCharsPositions().reduce((total, position) => {
            const victimInfo = callback.call(this, position, enemy);
            if (victimInfo) {
                total.push(victimInfo);
            }
            return total;
        }, []);

        const weakest = getLowestPropChar('health', victims);
        if ((weakest && !victimNow) || (weakest.health < victimNow.health)) {
            moveToFight(weakest);
            return true;
        }
        return false;
    }



    export default async function makeDecisionAI(enemy) {
        const charsInWz = getAttackPos(this);
        const enemiesInWz = getAttackPos(enemy);
        const victim = getBestVictim(enemy);
        const attacker = getBestAttacker(victim, enemy);

        return giveControlAI(() => {
            if (charsInWz.length === 1) {
                const charPos = charsInWz[0];
                const char = this.getTeamChar(charPos);
                const resVictim = safeCheck(charPos, enemy);

                if (resVictim) {
                    moveToFight(resVictim);
                    return;
                }

                const clearPos = getClearZone(charPos, enemy);
                if (clearPos) {
                    char.moveTo(clearPos[0]);
                    return;
                }

                const weakest = dangerCheck(charPos, enemy);
                if (weakest.health < victim.health) {
                    moveToFight(weakest);
                    return;
                }
            }

            if (enemiesInWz) {
                if (explore(enemy, safeCheck)) {
                    return;
                }
                if (explore(enemy, dangerCheck)) {
                    return;
                }
                return attacker.fight(victim.position);
            }

            if (!charsInWz) {
                if (explore(enemy, safeCheck)) {
                    return;
                }
                const attackerPos = getHighestPropChar('attack', this.heroes).position;
                const clearPos = getClearZone(attackerPos, enemy);

                const attacker = this.getTeamChar(attackerPos);
                if (clearPos) {
                    attacker.moveTo(clearPos[0]);
                    return;
                }

                const randomPos = getAcceptableZone(enemy, attackerPos)[0];
                attacker.moveTo(randomPos);
                return;
            }

            if (charsInWz && !enemiesInWz) {
                const chars = this.getChars(charsInWz);
                const weakestPos = getLowestPropChar('health', chars).position;
                const weakestChar = this.getTeamChar(weakestPos);
                const clearPos = getClearZone(weakestPos, enemy);

                if (explore(enemy, dangerCheck)) {
                    return;
                }
                if (clearPos) {
                    weakestChar.moveTo(clearPos[0]);
                    return;
                }

                const randomPos = getAcceptableZone(enemy, weakestPos)[0];
                weakestChar.moveTo(randomPos);
            }
        });
    }












































