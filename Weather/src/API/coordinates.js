// Functions returning coordinates.

// My OpenWeather API key.
const key = '0c57e9cadf598213edf8bb3ab57dba93'

/* Returns Promise containing coordinates of given location.
  Uses Current Weather API to get it. */
const findLocation = (location) => {
    let req = 'http://api.openweathermap.org/data/2.5/weather?q=' + 
               location + '&APPID=' + key;
    return new Promise(function(resolve, reject){
        fetch(req).then((response) => {
            response.json().then((data) => {
                resolve(data["coord"]);
            }).catch((err) => {
                reject(new Error(err))
            })
        }).catch((err) => {
            reject(new Error(err))
        })
    })
}

/* Returns Promise containing coordinates of our actual geolocation.
  Object, in which coordinates are stored looks same as one resolved
  in Promise returned by findLocation. */
const findGeolocation = () => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("no navigator"))
        } else {
            navigator.geolocation.getCurrentPosition((position) => {
                resolve ({
                    'lat': position["coords"]["latitude"],
                    'lon': position["coords"]["longitude"]
                })
            })
        }
    })
}

export { key, findLocation, findGeolocation }