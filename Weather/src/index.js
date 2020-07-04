import React from 'react';
import ReactDOM from 'react-dom';
import Weather from './App';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

// Supplying the initial state.
const initial = {
  location: '', // actual state of input field
  searchBy: 0, // searching option - 0 = by city, 1 = by geolocation
  weatherMode: 0, // result display option - 0 = hourly for 2 days, 1 = daily for 7 days
  mode: 0, // mode - 0 = 'light', 1 = 'dark'
  status: 'initial', /* 'initial' at the beginning,
                        'fetching' when waiting for searching results,
                        'success' when results have been found,
                        'error' when have not */

  // Actually displayed weather.
  weather: '',
  
  // Link to actually displayed GIF, initial one is just random.
  GIF: 'https://media.tenor.com/images/78edbb1f8c34b17b20e9e0987914001e/tenor.gif',

  // Last query requested, encoded in specific format.
  lastQuery: ''
}

// A reducer for action handling.
const reducer = (state = initial, action) => {
  switch(action.type) {
    case "INPUT":
      return {
        location: action.data,
        searchBy: state.searchBy,
        weatherMode: state.weatherMode,
        mode: state.mode,
        status: state.status,
        weather: state.weather,
        GIF: state.GIF,
        lastQuery: state.lastQuery
      };
    case "SEARCH":
      return {
        location: state.location,
        searchBy: state.searchBy,
        weatherMode: state.weatherMode,
        mode: state.mode,
        status: 'fetching',
        weather: state.weather,
        GIF: state.GIF,
        lastQuery: action.data // saving code of recently requested query
      }
    case "ERROR":
      return {
        location: state.location,
        searchBy: state.searchBy,
        weatherMode: state.weatherMode,
        mode: state.mode,
        status: 'error',
        weather: '', // do not display any weather after bad request
        GIF: state.GIF,
        lastQuery: state.lastQuery
      }
    case "RECEIVED":
      return {
        location: state.location,
        searchBy: state.searchBy,
        weatherMode: state.weatherMode,
        mode: state.mode,
        status: 'success',
        weather: action.data,
        GIF: state.GIF,
        lastQuery: state.lastQuery
      }
    case "MODE":
      return {
        location: state.location,
        searchBy: state.searchBy,
        weatherMode: state.weatherMode,
        mode: 1 - state.mode,
        status: state.status,
        weather: state.weather,
        GIF: state.GIF,
        lastQuery: state.lastQuery
      }
    case "SEARCHING_MODE":
      return {
        location: state.location,
        searchBy: 1 - state.searchBy,
        weatherMode: state.weatherMode,
        mode: state.mode,
        status: state.status,
        weather: state.weather,
        GIF: state.GIF,
        lastQuery: state.lastQuery
      }
    case "WEATHER_MODE":
      return {
        location: state.location,
        searchBy: state.searchBy,
        weatherMode: 1 - state.weatherMode,
        mode: state.mode,
        status: state.status,
        weather: state.weather,
        GIF: state.GIF,
        lastQuery: state.lastQuery
      }
    case "GIF":
      return {
        location: state.location,
        searchBy: state.searchBy,
        weatherMode: state.weatherMode,
        mode: state.mode,
        status: state.status,
        weather: state.weather,
        GIF: action.data,
        lastQuery: state.lastQuery
      }
    default:
      return state;
  }
}

const store = createStore(reducer);

const App = () => {
  return <Provider store={store}>
    <Weather />
  </Provider>
}

ReactDOM.render(<App />, document.getElementById('root'));