import getHpLevel from "./aux/getHpLevel";

const charHealthIndicatorT = (health) => ({
    block: 'div',
    cls: `health-indicator health-indicator-${getHpLevel(health)}`,
    style: `${health * 10}%`,
    content: '',
})

const charHealthContainerT = (health) => ({
    block: 'div',
    cls: '',
    content: charHealthIndicatorT(health),
})

const characterT = (char) => ({
    block: 'div',
    cls: `character ${char.type}`,
    content: charHealthContainerT(char.health),
});

export default characterT;