let randomWords = require('random-words');


export function generateName() {
    let name = randomWords();
    return name;
}


export function printc(message, type) {
    let style = "color: black;";
    if (type == "info") {
        style = "color: purple;";
    } else if (type == "error") {
        style = "color: red;";
    }
    console.log("%c " + message, style);
}
export function roundNumber(number) {
    return Math.round(number);
}
export function roundSuffix(number) {
    let absNumber = Math.abs(number);


    if(absNumber >= 1000000000000){
        return (number / 1000000000).toFixed(1) + " T";   
    }else if (absNumber >= 1000000000) {
        return (number / 1000000000).toFixed(1) + " B";
    } else if (absNumber >= 1000000) {
        return (number / 1000000).toFixed(2) + " M";
    } else if (absNumber >= 1000) {
        return (number / 1000).toFixed(2) + " K";
    } else {
        return Math.round(number);
    }
}

export function randomFromArray(array, ind = 0) {
    //Returns a random element or index 
    let rand = Math.floor(Math.random() * array.length);
    let item = array[rand];
    if (ind) {
        item = rand;
    }
    return item;
}

export function randomNumber(min, max, signed) {
    let randomNumber = Math.random() * (max - min) + min;
    if (signed) {
        let signRandom = Math.random() * 10;
        if (signRandom > 5) {
            randomNumber *= -1;
        }
    }
    return randomNumber;
}

export function getTime() {
    let date = new Date();
    let h = date.getHours();
    let m = date.getMinutes();
    let s = date.getSeconds();
    if (m < 10) {
        m = "0" + m;
    }
    if (s < 10) {
        s = "0" + s;
    }
    let time = h + ":" + m + ":" + s;
    return time;
}