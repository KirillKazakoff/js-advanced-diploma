import { onCellLeave, onCellEnter } from "./leaveEnter";
import { onCellUp, onCellDown, onRangeSwitch } from "./rangeSwitch";
import { onCellLeftClick } from "./leftClick";


export function addBoardListeners() {
    document.addEventListener('keydown', (event) => onRangeSwitch.call(this, event));
    this.container.addEventListener('mousedown', (event) => onCellDown.call(this, event));
    this.container.addEventListener('mouseup', () => onCellUp.call(this));

    this.board.cells.forEach((cell, i) => {
        cell.addEventListener('mouseenter', () => onCellEnter.call(this, i));
        cell.addEventListener('mouseleave', () => onCellLeave.call(this, cell));
    })

    this.container.addEventListener('click', (event) => onCellLeftClick.call(this, event));
}
