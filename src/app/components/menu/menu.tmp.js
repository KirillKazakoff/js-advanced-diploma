const btnRestart = {
    block: 'button',
    cls: 'btn btn__restart',
    content: 'New Game',
}

const btnSave = {
    block: 'button',
    cls: 'btn btn__save',
    content: 'Save Game',
}

const btnLoad = {
    block: 'button',
    cls: 'btn btn__load',
    content: 'Load Game',
}

const menuButton = (btnT) => ({
    block: 'li',
    cls: 'menu__button',
    content: btnT,
})

const menuButtons = {
    block: 'ul',
    cls: 'menu__buttons',
    content: [btnRestart, btnSave, btnLoad].map(menuButton),
}

const menuIcon = {
    block: 'div',
    cls: 'menu__icon',
    content: '',
}

const menuT = {
    block: 'div',
    cls: 'menu',
    content: [menuIcon, menuButtons],  
}

export default menuT;



// const menuButtons = {
//     block: 'ul',
//     cls: 'menu__buttons',
//     content: genButtons(),
// }

// function genButtons() {
//     const restart = menuButton(btnRestart);
//     const save = menuButton(btnSave);
//     const load = menuButton(btnLoad);
//     return [restart, save, load];       
// }