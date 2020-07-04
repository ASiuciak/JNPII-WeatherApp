// Converts Kelvin to Celsius
const toCelsius = (degrees) => {
    return degrees - 273;
}

const countAverage = (weather) => {
    let len = weather.length;
    let total = 0;
    for (var i = 0; i < len; i++) {
        // Daily forecast - takes average of four measures taken in one day.
        if (len === 8) {
            let dayAVG = Math.round((weather[i]["temp"]["day"] + weather[i]["temp"]["eve"] +
            weather[i]["temp"]["morn"] + weather[i]["temp"]["night"]) / 4);
            total += dayAVG
        } else {
            total += weather[i]["temp"];
        }
    }
    return toCelsius(Math.round(total / len));
}

const countMax = (weather) => {
    let len = weather.length;
    let highest = 0;
    for (var i = 0; i < len; i++) {
        let h = 0;
        if (len === 8) {
            h = Math.round(weather[i]["temp"]["max"])
        } else {
            h = Math.round(weather[i]["temp"])
        }
        if (h > highest) { highest = h; }
    }
    return toCelsius(highest);
}

const countMin = (weather) => {
    let len = weather.length;
    let lowest = 10000;
    for (var i = 0; i < len; i++) {
        let l = 0;
        if (len === 8) {
            l = Math.round(weather[i]["temp"]["min"])
        } else {
            l = Math.round(weather[i]["temp"])
        }
        if (l < lowest) { lowest = l; }
    }
    return toCelsius(lowest);
}

const countRainy = (weather) => {
    let len = weather.length;
    let total = 0;
    for (var i = 0; i < len; i++) {
        if (weather[i]["weather"][0]["main"] === "Rain") {
            total++;
        }
    }
    return total;
}

const getType = (avg, min, max, rainy) => {
    let points = 0;
    if (avg >= 18 && avg <= 25) { points++; }
    if (min >= 15 && max <= 30) { points++; }
    if (rainy === 0) { points++; }
    if (points < 2) {
        return "Not nice"
    }
    if (points === 2) {
        return "Passable"
    }
    if (points === 3) {
        return "Nice"
    }
}

const getText = (weather) => {
    if (weather.length === 8) {
        return 'days'
    } else {
        return 'hours'
    }
}

const getWeatherParams = (weather) => {
    if (weather) {
        let w = JSON.parse(weather);
        let avg = countAverage(w);
        let max = countMax(w);
        let min = countMin(w);
        let rainy = countRainy(w);
        return {
            'avg': avg,
            'max': max,
            'min': min,
            'rainy': rainy,
            'type': getType(avg, min, max, rainy),
            'text': getText(w)
        }
    } else {
        return {
            'avg': '',
            'max': '',
            'min': '',
            'rainy': '',
            'type': '',
            'text': ''
        }
    }
}

export { getWeatherParams } 