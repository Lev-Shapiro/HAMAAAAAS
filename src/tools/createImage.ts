export const createImage = (src: string) => {
    const img = new Image();
    img.src = src;
    return img;
}