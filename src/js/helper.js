export function printc(message, type){
    let style = "color: black;";
    if(type == "info"){
        style = "color: purple;";
    } else if(type == "error"){
        style = "color: red;";
    }
    console.log("%c " + message, style);
}
export function roundNumber(number){
    return Math.round(number);
}
export function roundSuffix(number){
    if(number >= 1000000000){
        return (number / 1000000000).toFixed(3) + " B";
    } else if(number >= 1000000){
        return (number / 1000000).toFixed(2) + " M";
    } else if(number >= 1000){
        return (number / 1000).toFixed(2) + " K";
    } else {
        return Math.round(number);
    }
}

export function randomFromArray(array, ind = 0){
    //Returns a random element or index 
    let rand = Math.floor(Math.random() * array.length);
    let item = array[rand];
    if(ind){
       item = rand;
    }
    return item;
}

export function randomNumber(min, max, signed){
    let randomNumber = Math.random() * (max - min) + min;
    if(signed){
        let signRandom = Math.random() * 10;
        if(signRandom > 5){
            randomNumber *= -1;
        }
    }
    return randomNumber;
}