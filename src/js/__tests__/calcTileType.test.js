import { calcTileType } from "../../lib/utils/utils";

const boardSize = 8;


test('top-left cell test', () => {
    const cellIndex = 0;
    const expected = 'top-left';
    const result = calcTileType(cellIndex, boardSize);

    expect(result).toBe(expected);
})

test('top-right cell test', () => {
    const cellIndex = boardSize - 1;
    const expected = 'top-right';
    const result = calcTileType(cellIndex, boardSize);

    expect(result).toBe(expected);
})

test('top cell test', () => {
    const cellIndex = boardSize - 2;
    const expected = 'top';
    const result = calcTileType(cellIndex, boardSize);

    expect(result).toBe(expected);
})


const allCells = boardSize ** 2;
test('bottom-left cell test', () => {
    const cellIndex = allCells - boardSize;
    const expected = 'bottom-left';
    const result = calcTileType(cellIndex, boardSize);

    expect(result).toBe(expected);
})

test('bottom-right cell test', () => {
    const cellIndex = allCells - 1;
    const expected = 'bottom-right';
    const result = calcTileType(cellIndex, boardSize);

    expect(result).toBe(expected);
})

test('bottom cell test', () => {
    const cellIndex = allCells - boardSize + 2;
    const expected = 'bottom';
    const result = calcTileType(cellIndex, boardSize);

    expect(result).toBe(expected);
})

test('left cell test', () => {
    const cellIndex = boardSize;
    const expected = 'left';
    const result = calcTileType(cellIndex, boardSize);

    expect(result).toBe(expected);
})

test('right cell test', () => {
    const cellIndex = (boardSize * 2) - 1;
    const expected = 'right';
    const result = calcTileType(cellIndex, boardSize);

    expect(result).toBe(expected);
})

test('center cell test', () => {
    const cellIndex = boardSize + 2;
    const expected = 'center';
    const result = calcTileType(cellIndex, boardSize);

    expect(result).toBe(expected);
})