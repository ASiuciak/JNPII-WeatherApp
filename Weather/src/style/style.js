/* Interface of functions creating style props depending
 on app's state. */

const getBodyBackground = (mode) => {
    if (mode === 0) {
        return {
            'backgroundColor': 'wheat'
        }
    } else {
        return {
            'backgroundColor': '#00001a'
        }
    }
}

const getTextColor = (mode) => {
    if (mode === 0) {
        return {
            'color': '#660000'
        }
    } else {
        return {
            'color': 'aliceblue'
        }
    }
}

const getInputDisplay = (searchBy) => {
    if (searchBy === 0) {
        return {
            'display': 'inline'
        }
    } else {
        return {
            'display': 'none'
        }
    }
}

const getError = (status) => {
    if (status === 'error') {
        return "Sorry, we didn't find weather forecast for your location."
    } else {
        return ""
    }
}

const getWeatherDisplay = (weather, status) => {
    if (weather && status === 'success') {
        return {
            display: 'grid'
        }
    } else {
        return {
            display: 'none'
        }
    }
}
 
const getStyle = (state) => {
    return {
        'bodyBackground': getBodyBackground(state.mode),
        'text': getTextColor(state.mode),
        'input': getInputDisplay(state.searchBy),
        'error': getError(state.status),
        'weatherDisplay' : getWeatherDisplay(state.weather, state.status),
        'butVal2': modeButtonValue(state.mode),
        'butVal1': searchButtonValue(state.searchBy)
    }
}

const modeButtonValue = (mode) => {
    if (mode === 0) {
        return 'Dark mode'
    } else {
        return 'Light mode'
    }
}

const searchButtonValue = (searchBy) => {
    if (searchBy === 0) {
        return 'Search by geolocation'
    } else {
        return 'Search by city name'
    }
}

export { getStyle, modeButtonValue, searchButtonValue }