import { getCoords } from "./utilsSec";

// charPic.classList.add(`character ${charType}`);
export default function showFeatures(char) {
    const {turn, type} = char;

    showPicture(turn, type);
    // showData();
    // showSkills();
}

function showPicture(charTurn, charType) {
    const card = document.querySelector(`.${charTurn}-card`);
    const imgClassName = `character ${charType} bigger`;
    const { firstElementChild } = card;

    if (firstElementChild) {
        const charPic = card.querySelector(`.character`);;
        charPic.className = imgClassName;
        return;
    }

    const charPic = document.createElement('div');

    charPic.className = imgClassName;
    card.appendChild(charPic);

    const cardLocation = getCoords(card);
    const { top, left } = cardLocation;

    charPic.style.top = `${top + 90}px`;
    charPic.style.left = `${left + 115}px`;
}

function showData() {
    
}