import gamePlay from "./gamePlay";
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



    getClearZone(movePos, dangerousPos) {
        const friendChars = this.getCharsPositions();

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

    moveOnBestPos(clearPos, charPos, enemy) {
        if (clearPos[0]) {
            let prevPos = charPos;
            const victimsArr = [];

            clearPos.forEach((position) => {
                this.setTeamCharPos(prevPos, position);
                victimsArr.push(this.getBestVictim(enemy));
                prevPos = position;
            });
            this.setTeamCharPos(prevPos, charPos);
            console.log(victimsArr);
        }
    }

    decide(enemy) {
        const dangerousPos = enemy.getAttackRange();

        const charsInWarZone = enemy.getAttackPos(this);
        console.log(charsInWarZone);
        // charsInWarZone - forEach ...
        if (charsInWarZone.length === 1) {
            const charPos = charsInWarZone[0];
            const movePos = getMoveRange(charPos);
            const clearPos = this.getClearZone(movePos, dangerousPos);
            console.log(clearPos);
            this.moveOnBestPos(clearPos, charPos, enemy);
        }
        else return 'should do something else';
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
        const myPositions = allPositions.map((posArray) => posArray[0]);    
        
        console.log(myPositions);
        if (!enemyPositions[0]) {
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
            return
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


}