import { key, findLocation, findGeolocation } from './coordinates.js'

const getWeatherFromLocation = (location, mode) => {
    return new Promise ((resolve, reject) => {
        findLocation(location).then((coords) => {
            let req = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + 
            coords["lat"] + '&lon=' + coords["lon"] + '&exclude=current&appid=' + key;
            fetch(req).then((response) => {
                response.json().then((data) => {
                    console.log(data);
                    if (mode === 0) {
                        resolve(data["hourly"]);
                    } else {
                        resolve(data["daily"]);
                    }
                }).catch((err) => {
                    reject(new Error(err));
                })
            }).catch((err) => {
                reject (new Error(err));
            })
        }).catch((err) => {
            reject(new Error(err));
        })
    })
}

const getWeatherFromGeolocation = (mode) => {
    return new Promise((resolve, reject) => {
        findGeolocation().then((coords) => {
            let req = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + 
            coords["lat"] + '&lon=' + coords["lon"] + '&exclude=current&appid=' + key;
            fetch(req).then((response) => {
                response.json().then((data) => {
                    console.log(data);
                    if (mode === 0) {
                        resolve(data["hourly"]);
                    } else {
                        resolve(data["daily"]);
                    }
                }).catch((err) => {
                    reject(new Error(err));
                })
            }).catch((err) => {
                reject (new Error(err));
            })
        }).catch((err) => {
            reject(new Error(err));
        })
    })    
}

export { getWeatherFromLocation, getWeatherFromGeolocation }