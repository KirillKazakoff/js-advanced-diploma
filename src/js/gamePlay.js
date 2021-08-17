/* eslint-disable no-restricted-globals */
/* eslint-disable no-restricted-syntax */
import { calcHealthLevel, calcTileType, calcPossiblePositions } from './utilsSec';
import TeamLogicAI from './TeamLogicAI';
import Card from './Card';

const gamePlay = {
    boardSize: 8,
    container: null,
    boardEl: null,
    cells: [],
    teams: [],
    
    teamAI: [],
    teamPL: [],
    cardAI: new Card('AI'),
    cardPL: new Card('PL'),
    isRangeButton: false,

    cellClickListeners: [],
    cellUpListeners: [],
    cellDownListeners: [],
    cellEnterListeners: [],
    cellLeaveListeners: [],

    menuListeners: [],
    newGameListeners: [],
    saveGameListeners: [],
    loadGameListeners: [],

    refreshTeams() {
        this.teamAI = new TeamLogicAI(gamePlay.teams.getTeam('AI'));
        this.teamPL = new TeamLogicAI(gamePlay.teams.getTeam('PL'));  
    },

    refreshCards() {
        this.cardAI = new Card('AI');
        this.cardPL = new Card('PL');
    },

    clearListeners() {
        this.container.innerHTML = this.container.innerHTML;
    },


    drawUi(theme) {
        this.container = document.querySelector('#game-container');
        this.container.innerHTML = this.container.innerHTML;

        this.refreshCards();
        this.menuGameEl = this.container.querySelector('.menu-icon');
        this.newGameEl = this.container.querySelector('[data-id=action-restart]');
        this.saveGameEl = this.container.querySelector('[data-id=action-save]');
        this.loadGameEl = this.container.querySelector('[data-id=action-load]');

        this.boardEl = this.container.querySelector('[data-id=board]');
        this.boardEl.innerHTML = '';

        document.addEventListener('keydown', (event) => this.onRangeSwitch(event));
        this.menuGameEl.addEventListener('click', (event) => this.onMenuClick(event)); 
        this.newGameEl.addEventListener('click', (event) => this.onNewGameClick(event));
        this.saveGameEl.addEventListener('click', (event) => this.onSaveGameClick(event));
        this.loadGameEl.addEventListener('click', (event) => this.onLoadGameClick(event));

        this.pickTheme(theme);
        this.boardEl.style['grid-template-columns'] = `repeat(${this.boardSize}, 1fr)`;
        for (let i = 0; i < this.boardSize ** 2; i += 1) {
            const cellEl = document.createElement('div');
            cellEl.classList.add('cell', 'map-tile', `map-tile-${calcTileType(i, this.boardSize)}`);
            cellEl.addEventListener('mouseenter', (event) => this.onCellEnter(event));
            cellEl.addEventListener('mouseleave', (event) => this.onCellLeave(event));
            cellEl.addEventListener('click', (event) => this.onCellClick(event));

            cellEl.addEventListener('mousedown', (event) => this.onCellDown(event));
            cellEl.addEventListener('mouseup', (event) => this.onCellUp(event));
            this.boardEl.appendChild(cellEl);
        }

        this.cells = Array.from(this.boardEl.children);
    },

    pickTheme(theme) {
        this.boardEl.className = `board ${theme}`;
    },

    redrawPositions(positionedChars) {
        for (const cell of this.cells) {
            cell.innerHTML = '';
        }

        for (const positionedChar of positionedChars) {
            const cellEl = this.boardEl.children[positionedChar.position];
            const charEl = document.createElement('div');
            charEl.classList.add('character', positionedChar.type);

            const healthEl = document.createElement('div');
            healthEl.classList.add('health-level');

            const healthIndicatorEl = document.createElement('div');
            healthIndicatorEl.classList.add('health-level-indicator', `health-level-indicator-${calcHealthLevel(positionedChar.health)}`);
            healthIndicatorEl.style.width = `${positionedChar.health * 10}%`;
            healthEl.appendChild(healthIndicatorEl);

            charEl.appendChild(healthEl);
            cellEl.appendChild(charEl);
        }
    },



    addMenuListener(callback) {
        this.menuListeners.push(callback);
    },

    addNewGameListener(callback) {
        this.newGameListeners.push(callback);
    },

    addSaveGameListener(callback) {
        this.saveGameListeners.push(callback);
    },

    addLoadGameListener(callback) {
        this.loadGameListeners.push(callback);
    },

    addCellLeaveListener(callback) {
        this.cellLeaveListeners.push(callback);
    },

    addCellClickListener(callback) {
        this.cellClickListeners.push(callback);
    },

    addCellDownListener(callback) {
        this.cellDownListeners.push(callback);
    },

    addCellUpListener(callback) {
        this.cellUpListeners.push(callback);
    },

    addCellEnterListener(callback) {
        this.cellEnterListeners.push(callback);
    },





    
    onCellEnter(event) {
        event.preventDefault();
        const index = this.cells.indexOf(event.currentTarget);
        this.cellEnterListeners.forEach((listener) => listener(index));
    },

    onCellLeave(event) {
        event.preventDefault();
        const index = this.cells.indexOf(event.currentTarget);
        this.cellLeaveListeners.forEach((listener) => listener(index));
    },

    onCellClick(event) {
        const index = this.cells.indexOf(event.currentTarget);
        this.cellClickListeners.forEach((listener) => listener(index));
    },

    onCellDown(event) {
        const index = this.cells.indexOf(event.currentTarget);
        this.cellDownListeners.forEach((listener) => {
            this.timer = setTimeout(() => listener(index), 500);
        });
    },

    onCellUp(event) {
        const index = this.cells.indexOf(event.currentTarget);
        this.cellUpListeners.forEach((listener) => {
            clearTimeout(this.timer);
            listener(index);
        });
    },

    onRangeSwitch(event) {
        if (event.key === 'r') {
            this.isRangeButton = !this.isRangeButton;
        }
    },




    onMenuClick(event) {
        event.preventDefault();
        this.menuListeners.forEach((listener) => listener(event));
    },

    onNewGameClick(event) {
        event.preventDefault();
        this.newGameListeners.forEach((listener) => listener());
    },

    onSaveGameClick(event) {
        event.preventDefault();
        this.saveGameListeners.forEach((listener) => listener());
    },

    onLoadGameClick(event) {
        event.preventDefault();
        this.loadGameListeners.forEach((listener) => listener());
    },





    showDamage(index, damage) {
        return new Promise((resolve) => {
            const cell = this.cells[index];
            const damageEl = document.createElement('span');
            damageEl.textContent = damage;
            damageEl.classList.add('damage');
            cell.appendChild(damageEl);

            damageEl.addEventListener('animationend', () => {
                cell.removeChild(damageEl);
                resolve();
            });
        });
    },

    setCursor(cursor) {
        this.boardEl.style.cursor = cursor;
    },
    
    selectCell(index, color = 'yellow') {
        this.cells[index].classList.add('selected', `selected-${color}`);
    },

    deselectCell(index) {
        const cell = this.cells[index];
        cell.classList.remove(...Array.from(cell.classList)
            .filter((o) => o.startsWith('selected')));
    },

    deselectAllCells() {
        for (let i = 0; i < this.boardSize ** 2; i += 1) {
            this.deselectCell(i);
        }
    },

    clearDataset(position) {
        const cell = this.cells[position];
        cell.title = '';
    },

    clearAllDataset() {
        for (let i = 0; i < this.boardSize ** 2; i += 1) {
            this.clearDataset(i);
            this.deselectCell(i);
        }
    },

    getPositions(rangeParam, startPos) {
        const char = this.teams.getTeamChar(startPos)
        return calcPossiblePositions.call(this, char[rangeParam], startPos);
    },
};

export default gamePlay;