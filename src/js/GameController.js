import TeamCommon from './TeamCommon';
import gameState from './gameState';
import generateTeam from './generators';

import cursors from './cursors';
import testData from './classes/testData';
import TeamLogicAI from './TeamLogicAI';

export default class GameController {
    constructor(gamePlay, stateService) {
        this.gamePlay = gamePlay;
        this.stateService = stateService;
    }

    init() {
        gameState.from({ turn: 'player', level: 2 });
        this.gamePlay.drawUi('prairie');

        this.initTest();
        this.gamePlay.redrawPositions(this.gamePlay.teams.characters);

        this.gamePlay.addCellEnterListener((index) => this.onCellEnter(index));
        this.gamePlay.addCellLeaveListener((index) => this.onCellLeave(index));
        this.gamePlay.addCellClickListener((index) => this.onCellClick(index));
        this.gamePlay.addCellDownListener((index) => this.onCellDown(index));
        this.gamePlay.addCellUpListener((index) => this.onCellUp(index));
    }

    onCellEnter(index) {
        const cell = this.getCell(index);
        const charData = this.getChar(cell);
        const { activePos } = gameState;

        this.gamePlay.setCursor(cursors.pointer);

        if (charData) {
            if (cell.lastElementChild.className === 'tooltip') {
                this.gamePlay.showCellTooltip(cell);
            } else {
                const { level, attack, defence, health } = charData;
                const codes = ['0x1f396', '0x2694', '0x1f6e1', '0x2764'].map((code) => String.fromCodePoint(code));
                const [lPic, aPic, dPic, hPic] = codes;

                this.gamePlay.createToolTip(`${lPic} ${level} ${aPic} ${attack} ${dPic} ${defence} ${hPic} ${health}`, cell);
            }
            this.highlightAttackRange(index);
            gameState.isCellHovered = true;
        }

        if (!charData && typeof activePos === 'number') {
            const posObj = this.gamePlay.getPositions('moveRange', activePos);

            if (posObj.positions.some((position) => position === index)) {
                this.gamePlay.selectCell(index, 'green');
            }
        }

        if (charData.turn === 'AI' && typeof activePos === 'number') {
            const posObj = this.gamePlay.getPositions('attackRange', activePos);

            if (posObj.positions.some((position) => position === index)) {
                this.gamePlay.setCursor(cursors.crosshair);
                this.gamePlay.selectCell(index, 'red');
                return;
            }
            this.gamePlay.setCursor(cursors.notallowed);
        }

        if (charData.turn === 'AI' && typeof activePos !== 'number') {
            this.gamePlay.setCursor(cursors.notallowed);
        }
    }


    onCellLeave(index) {
        const cell = this.getCell(index);

        if (cell.title) {
            this.gamePlay.hideCellTooltip(cell);
        }
        if (cell.className.includes('green') || cell.className.includes('red')) {
            this.gamePlay.deselectCell(index);
        }
        if (gameState.isCellHovered) {
            console.log(gameState.isCellHovered);
            const moveRange = this.gamePlay.getPositions('moveRange', index).positions;
            moveRange.forEach((position) => this.gamePlay.deselectCell(position));
        }
    }



    onCellClick(index) {
        let { activePos } = gameState;
        const cell = this.getCell(index);
        const charData = this.getChar(cell);
        const { teams } = this.gamePlay;

        if (!charData && typeof activePos === 'number') {
            const posObj = this.gamePlay.getPositions('moveRange', activePos);

            if (posObj.positions.some((position) => position === index)) {
                teams.moveActiveChar(index);
                this.gamePlay.redrawPositions(teams.characters);

                this.gamePlay.deselectCell(index);
                this.gamePlay.selectCell(index, 'yellow');
                this.gamePlay.deselectCell(activePos);

                gameState.activePos = index;
                this.turnAI();
            }
            return;
        }

        if (charData.turn !== "player" && typeof activePos === 'number') {
            const posObj = this.gamePlay.getPositions('attackRange', activePos);

            if (posObj.positions.some((position) => position === index)) {
                if (posObj.positions.some((position) => position === index)) {
                    return teams.attackChar(index).then(() => this.turnAI());
                }
            }
        }

        if (charData) {
            this.onPlayerCharClick(index);
            return;
        }
    }

    onCellDown(index) {
        const chardata = this.gamePlay.getChar(this.getCell(index));
        gameState.isCellHovered = true;
        if (chardata) {
            const moveRange = this.gamePlay.getPositions('moveRange', index).positions;
            moveRange.forEach((position) => this.gamePlay.selectCell(position, 'green'));
        }
    }

    onCellUp(index) {
        const moveRange = this.gamePlay.getPositions('moveRange', index).positions;
        moveRange.forEach((position) => this.gamePlay.deselectCell(position));
    }

    highlightAttackRange(index) {
        if (this.gamePlay.getChar(this.getCell(index))) {
            const attackRange = this.gamePlay.getPositions('attackRange', index).positions;
            attackRange.forEach((position) => this.gamePlay.selectCell(position, 'red'));
        }
    }

    onPlayerCharClick(index) {
        const cell = this.getCell(index)
        const charData = this.getChar(cell);
        const { turn, position } = charData;
        let { activePos, isCellHovered: isCellHolded } = gameState;

        if (turn === 'AI') {
            return;
        }

        this.gamePlay.selectCell(index);
        if (typeof activePos === 'number') {
            this.gamePlay.deselectCell(activePos);
        }
        if (activePos === position) {
            activePos = null;
        } else {
            activePos = position;
        }

        if (isCellHolded) {
            this.gamePlay.selectCell(index, 'yellow');
            activePos = position;
            gameState.isCellHovered = false;
        }
        gameState.activePos = activePos;
    }


    initTeams() {
        this.gamePlay.teams = new TeamCommon(generateTeam(2, 3, 'player'), generateTeam(2, 3, 'AI'));
    }

    turnAI() {
        const teamAI = new TeamLogicAI(this.gamePlay.getTeam('AI'));
        const teamPl = new TeamLogicAI(this.gamePlay.getTeam('player'));

        teamAI.makeDecisionAI(teamPl);
    }

    clearDataset(position) {
        const cell = this.getCell(position);
        delete cell.dataset.charData;
        cell.title = '';
    }

    getCell(index) {
        return this.gamePlay.cells[index];
    }

    getChar(cell) {
        try {
            return JSON.parse(cell.dataset.charData);
        }
        catch {
            return false;
        }
    }

    initTest() {
        this.gamePlay.teams = new TeamCommon(testData);
    }
}
