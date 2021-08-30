/* eslint-disable no-restricted-globals */
/* eslint-disable no-restricted-syntax */
import './board.css';
import boardT from "./board.tmp";
import characterT from '../character/character.tmp';
import engine from "../../lib/engine/engine";

const board = {
    isRangeButton: false,

    getContainer(selector) {
        this.container = document.querySelector(selector);
    },

    renderBoard(theme, boardSize) {
        const html = engine(boardT(boardSize, theme));

        this.container.innerHTML = html;
        this.boardSize = boardSize;
        this.cells = this.container.querySelectorAll('.board__cell');
    },

    renderChars(positionedChars) {
        for (const cell of this.cells) {
            cell.innerHTML = '';
        }

        for (const positionedChar of positionedChars) {
            const charHtml = engine(characterT(positionedChar));
            this.cells[positionedChar.position].innerHTML = charHtml;
        }
    },


    clearListeners() {
        this.container.innerHTML = this.container.innerHTML;
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
};

export default board;