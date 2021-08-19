function getImgCoords(img) {
    const coords = img.getBoundingClientRect();

    let {top, left} = coords;
    top = top + pageYOffset;
    left = left + pageXOffset;

    const imgObj = {top, left}
    return imgObj;
}