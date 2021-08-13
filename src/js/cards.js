import { getCoords } from "./utilsSec";

export default function createPicture(charTurn, charType) {
    const card = document.querySelector(`.${charTurn}-card`);
    const charPic = document.createElement('div');

    charPic.className = `character ${charType}`;
    card.appendChild(charPic);

    const cardLocation = getCoords(card);
    const { top, left } = cardLocation;

    charPic.style.top = `${top + 40}px`;
    charPic.style.left = `${left + 40}px`;
}
