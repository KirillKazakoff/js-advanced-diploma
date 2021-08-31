import getHpLevel from "./aux/getHpLevel";

const charHealthIndicatorT = (health) => ({
    block: 'div',
    cls: `health-indicator health-indicator-${getHpLevel(health)}`,
    style: {
        'width': `${health * 10}%`,   
    },
    content: '',
})

const characterT = (char) => ({
    block: 'div',
    cls: `character ${char.type}`,
    content: charHealthIndicatorT(char.health),
});

export default characterT;