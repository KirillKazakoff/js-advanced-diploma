/* eslint-disable no-restricted-globals */
/* eslint-disable no-restricted-syntax */
import { calcHealthLevel, calcTileType } from './utils';

export default class GamePlay {
    constructor() {
        this.boardSize = 4;
        this.container = null;
        this.boardEl = null;
        this.cells = [];

        this.cellClickListeners = [];
        this.cellEnterListeners = [];
        this.cellLeaveListeners = [];

        this.newGameListeners = [];
        this.saveGameListeners = [];
        this.loadGameListeners = [];
    }

    bindToDOM(container) {
        if (!(container instanceof HTMLElement)) {
            throw new Error('container is not HTMLElement');
        }
        this.container = container;
    }

    /**
   * Draws boardEl with specific theme
   *
   * @param theme
   */
    drawUi(theme) {
        this.checkBinding();

        this.container.innerHTML = `
      <div class="controls">
        <button data-id="action-restart" class="btn">New Game</button>
        <button data-id="action-save" class="btn">Save Game</button>
        <button data-id="action-load" class="btn">Load Game</button>
      </div>
      <div class="board-container">
        <div data-id="board" class="board"></div>
      </div>
    `;

        this.newGameEl = this.container.querySelector('[data-id=action-restart]');
        this.saveGameEl = this.container.querySelector('[data-id=action-save]');
        this.loadGameEl = this.container.querySelector('[data-id=action-load]');

        this.newGameEl.addEventListener('click', (event) => this.onNewGameClick(event));
        this.saveGameEl.addEventListener('click', (event) => this.onSaveGameClick(event));
        this.loadGameEl.addEventListener('click', (event) => this.onLoadGameClick(event));

        this.boardEl = this.container.querySelector('[data-id=board]');

        this.boardEl.classList.add(theme);
        this.boardEl.style['grid-template-columns'] = `repeat(${this.boardSize}, 1fr)`;
        for (let i = 0; i < this.boardSize ** 2; i += 1) {
            const cellEl = document.createElement('div');
            cellEl.classList.add('cell', 'map-tile', `map-tile-${calcTileType(i, this.boardSize)}`);
            cellEl.addEventListener('mouseenter', (event) => this.onCellEnter(event));
            cellEl.addEventListener('mouseleave', (event) => this.onCellLeave(event));
            cellEl.addEventListener('click', (event) => this.onCellClick(event));
            this.boardEl.appendChild(cellEl);
        }

        this.cells = Array.from(this.boardEl.children);
    }

    /**
   * Draws positions (with chars) on boardEl
   *
   * @param positionedChars array of PositionedCharacter objects
   */

    redrawPositions(positionedChars) {
        for (const cell of this.cells) {
            cell.innerHTML = '';
        }

        for (const positionedChar of positionedChars) {
            console.log(positionedChar)
            const cellEl = this.boardEl.children[positionedChar.position];
            const charEl = document.createElement('div');
            cellEl.dataset.charData = JSON.stringify(positionedChar);
            charEl.classList.add('character', positionedChar.type);

            const healthEl = document.createElement('div');
            healthEl.classList.add('health-level');

            const healthIndicatorEl = document.createElement('div');
            healthIndicatorEl.classList.add('health-level-indicator', `health-level-indicator-${calcHealthLevel(positionedChar.health)}`);
            healthIndicatorEl.style.width = `${positionedChar.health}%`;
            healthEl.appendChild(healthIndicatorEl);

            charEl.appendChild(healthEl);
            cellEl.appendChild(charEl);
        }
    }




    addNewGameListener(callback) {
        this.newGameListeners.push(callback);
    }

    addSaveGameListener(callback) {
        this.saveGameListeners.push(callback);
    }

    addLoadGameListener(callback) {
        this.loadGameListeners.push(callback);
    }

    addCellLeaveListener(callback) {
        this.cellLeaveListeners.push(callback);
    }

    addCellClickListener(callback) {
        this.cellClickListeners.push(callback);
    }

    addCellEnterListener(callback) {
        this.cellEnterListeners.push(callback);
    }

    onCellEnter(event) {
        event.preventDefault();
        const index = this.cells.indexOf(event.currentTarget);
        this.cellEnterListeners.forEach((listener) => listener(index));
    }

    onCellLeave(event) {
        event.preventDefault();
        const index = this.cells.indexOf(event.currentTarget);
        this.cellLeaveListeners.forEach((o) => o.call(null, index));
    }

    onCellClick(event) {
        const index = this.cells.indexOf(event.currentTarget);
        this.cellClickListeners.forEach((o) => o.call(null, index));
    }

    onNewGameClick(event) {
        event.preventDefault();
        this.newGameListeners.forEach((o) => o.call(null));
    }

    onSaveGameClick(event) {
        event.preventDefault();
        this.saveGameListeners.forEach((o) => o.call(null));
    }

    onLoadGameClick(event) {
        event.preventDefault();
        this.loadGameListeners.forEach((o) => o.call(null));
    }

    static showError(message) {
        alert(message);
    }

    static showMessage(message) {
        alert(message);
    }

    selectCell(index, color = 'yellow') {
        this.deselectCell(index);
        this.cells[index].classList.add('selected', `selected-${color}`);
    }

    deselectCell(index) {
        const cell = this.cells[index];
        cell.classList.remove(...Array.from(cell.classList)
            .filter((o) => o.startsWith('selected')));
    }

    // ShowCellFuncBlock //

    static createToolTip(message, cell) {
        const tip = document.createElement('div');
        const thisCell = cell;

        thisCell.title = message;
        tip.textContent = cell.title;
        tip.className = 'tooltip tooltip-active';
        thisCell.appendChild(tip);

        const cellLocation = GamePlay.getCellCoords(cell);
        const { right, bottom } = cellLocation;

        tip.style.left = `${right - 10}px`;
        tip.style.top = `${bottom - 10}px`;
    }

    static showCellTooltip(cell) {
        cell.lastElementChild.classList.add('tooltip-active');
    }

    static hideCellTooltip(cell) {
        cell.lastElementChild.classList.remove('tooltip-active');
    }

    static getCellCoords(cell) {
        const coords = cell.getBoundingClientRect();

        let {
            top, bottom, left, right,
        } = coords;

        top += pageYOffset;
        bottom += pageYOffset;
        left += pageXOffset;
        right += pageXOffset;

        const cellObj = {
            top, bottom, left, right,
        };
        return cellObj;
    }

    hideCellTooltip(index) {
        const cell = this.cells[index];
        cell.classList.remove('tooltip-active');
    }
    // end showTipBlock

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
    }

    setCursor(cursor) {
        this.boardEl.style.cursor = cursor;
    }

    checkBinding() {
        if (this.container === null) {
            throw new Error('GamePlay not bind to DOM');
        }
    }
}
