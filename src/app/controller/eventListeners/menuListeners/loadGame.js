export default function onLoadGameClick() {
    const { state, characters, board } = this;

    const loadedChars = state.load();
    const classifiedChars = recreateLoadedChars(loadedChars);

    board.setTheme(state.theme);
    characters.heroes = classifiedChars;
    board.renderChars(classifiedChars);

    const { activePos } = state;
    if (activePos) {
        board.selectCell(state.activePos);
    }
    refreshTeams();
}

function recreateLoadedChars(chars) {
    return chars.map((char) => {
        let classedChar;
        const { level } = char;

        switch (char.type) {
            case 'vampire':
                classedChar = new Vampire(level);
                break;

            case 'undead':
                classedChar = new Undead(level);
                break;

            case 'daemon':
                classedChar = new Daemon(level);
                break;

            case 'bowman':
                classedChar = new Bowman(level);
                break;

            case 'magician':
                classedChar = new Magician(level);
                break;

            case 'swordsman':
                classedChar = new Swordsman(level);
                break;

            default:
                break;
        }

        for (let prop in char) {
            classedChar[prop] = char[prop];
        }
        return classedChar;
    })
}