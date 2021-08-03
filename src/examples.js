// // function calcPossiblePositions(cellAmount) {
// //     const { activePos } = gameState;
// //     const posArray = new Set();

// //     for (let i = 0; i < cellAmount + 1; i += 1) {
// //         const cell = this.getCell(activePos + i);

// //         posArray.add(activePos + i);
// //         if (cell.className.includes('right')) {
// //             break;
// //         }
// //     }

// //     for (let i = 0; i < cellAmount + 1; i += 1) {
// //         const cell = this.getCell(activePos + i);

// //         posArray.add(activePos - i);
// //         if (cell.className.includes('left')) {
// //             break;
// //         }
// //     }

// //     // for (let i = 0; i < cellAmount + 1; i += 1) {
// //     //     const cell = this.getCell(activePos);

// //     //     posArray.add(activePos);
// //     // }

// //     return posArray;
// // }







// import gameState from "./js/gameState";

    // funcGen(cellAmount) {
    //     const { activePos } = gameState;
    //     const posArray = new Set();
    
    //     return (callback) => {
    //         if (this.cells[activePos].className.includes('center')) {
    //             for (let i = 1; i < cellAmount + 1; i += 1) {
    //                 const calcExp = callback.call(this);
    //                 const cell = this.cells[calcExp];
    
    //                 posArray.add(calcExp);
    //                 if (!cell.className.includes('center')) {
    //                     return posArray
    //                 }
    //             }
    //         }
    //     }
    // }
    // // const { boardSize } = this;

    // calcPossiblePositions(cellAmount) {
    //     const generator = this.funcGen(cellAmount);
    //     const { activePos } = gameState;

    //     const calcToRight = generator(() => activePos + i);
    //     console.log(calcToRight);

    // }



