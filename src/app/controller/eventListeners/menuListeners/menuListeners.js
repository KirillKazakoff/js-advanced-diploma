import onMenuClick from "./menuClick"
import onLoadGameClick from "./loadGame"
import onSaveGameClick from "./saveGame"
import onNewGameClick from "./newGame";

export default function addMenuListeners() {
    this.menu.menu.addEventListener('click', onMenuClick);
    this.menu.load.addEventListener('click', onLoadGameClick);
    this.menu.save.addEventListener('click', onSaveGameClick);
    this.menu.restart.addEventListener('click', onNewGameClick);
}