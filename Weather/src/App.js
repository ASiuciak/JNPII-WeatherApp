import React from 'react';
import sun from './pictures/sun.svg';
import { connect } from 'react-redux'
import { getWeatherFromLocation, getWeatherFromGeolocation } from './API/weather.js'
import { getGIF } from './API/GIF.js'
import { getWeatherParams } from './weather/weather.js'
import { getStyle } from './style/style.js'
import './style/app.css';

// TODO: import cities list
const suggestions = ['Warsaw', 'London', 'New York', 'Madrid', 'Tehran', 'Tokio', 'Legionowo'];

// Limit for showing suggestions.
const maxSuggestions = 5;


class Weather extends React.Component{
  constructor(props) {
    super(props)
    this.handleInput = this.handleInput.bind(this)
    this.search = this.search.bind(this)
    this.setMode = this.setMode.bind(this)
    this.setSearching = this.setSearching.bind(this)
    this.setWeatherMode = this.setWeatherMode.bind(this)
    this.enterSuggestion = this.enterSuggestion.bind(this)
    this.clickSuggestion = this.clickSuggestion.bind(this)

    /* Apart from mapped props, I created a state just to handle
    autocompleting suggestions. */
    this.state = {
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
    };

    // This interval will be handling GIF display after searching.
    this.interval = setInterval(() => {
      //console.log('I am doing nothing...')
    }, 10000);
  }
  handleInput(e){
    e.preventDefault();
    this.props.dispatch({ type: "INPUT", data: e.target.value});

    // Filtering appropriate suggestions
    const newSuggestions = suggestions.filter(
      suggestion =>
        suggestion.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1
    );
    const newTopSuggestions = newSuggestions.slice(0, maxSuggestions);
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions: newTopSuggestions,
      showSuggestions: true,
    });
  }

  // Handling of suggestion click.
  enterSuggestion(e){
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
    });
    
    /* After clicking on suggestion, input gets its content
      (and so do this.props.location). */
    this.props.dispatch({ type: "INPUT", data: e.currentTarget.innerText});
  }
  
  // Managing key pressing.
  clickSuggestion(e) {
    // Enter key.
    if (e.keyCode === 13) {

      // Change handling only if suggestions are displayed.
      if (this.state.showSuggestions &&
          this.props.location &&
          this.state.filteredSuggestions.length > 0 &&
          this.props.searchBy === 0) {
        e.preventDefault();
        const chosen = this.state.filteredSuggestions[this.state.activeSuggestion]
        this.setState({
            activeSuggestion: 0,
            filteredSuggestions: [],
            showSuggestions: false,
        });
        this.props.dispatch({ type: "INPUT", data: chosen});
      }
    }

    // Up arrow.
    if (e.keyCode === 38) {
      // Change handling only if suggestions are displayed.
      if (this.state.showSuggestions &&
          this.props.location &&
          this.state.filteredSuggestions.length > 0 &&
          this.props.searchBy === 0) {
            e.preventDefault();
            if (this.state.activeSuggestion > 0) {
              this.setState({
                activeSuggestion: this.state.activeSuggestion - 1
              })
            }
      }
    }

    // Down arrow.
    if (e.keyCode === 40) {
      // Change handling only if suggestions are displayed.
      if (this.state.showSuggestions &&
          this.props.location &&
          this.state.filteredSuggestions.length > 0 &&
          this.props.searchBy === 0) {
            if (this.state.activeSuggestion <
                this.state.filteredSuggestions.length - 1) {
              this.setState({
                activeSuggestion: this.state.activeSuggestion + 1
              })
            }
      }
    }
  }

  // Searching for weather forecast.
  search(e){
    e.preventDefault();

    // Do not call API when actual query is same as last one.
    if (this.props.query !== this.props.lastQuery) {
      this.props.dispatch({ type: "SEARCH", data: this.props.query});
      if (this.props.searchBy === 0) {
        getWeatherFromLocation(this.props.location, this.props.weatherMode)
          .then((weather) => {
            // Getting keyword for new GIFs
            let type = weather[0]["weather"][0]["description"];

            getGIF(type, 0).then((GIF) => {
              // If GIFs found, set props.GIF and app's interval.
              this.props.dispatch({type: "GIF", data: GIF});
              clearInterval(this.interval);
              this.interval = setInterval(() => {
                getGIF(type, Math.floor(Math.random() * 5)).then((GIF) => {
                  this.props.dispatch({type: "GIF", data: GIF});
                })
              }, 10000);
            }).finally(() => {
              this.props.dispatch({type: "RECEIVED", data: JSON.stringify(weather)});
            })
          }).catch(() => {
            this.props.dispatch({ type: "ERROR"});
          })
      } else {
        getWeatherFromGeolocation(this.props.weatherMode)
          .then((result) => {
            this.props.dispatch({ type: "RECEIVED", data: JSON.stringify(result)})
          }).catch(() => {
            this.props.dispatch({ type: "ERROR"});
          })
      }
    }
  }

  // Light / dark mode.
  setMode(e){
    e.preventDefault();
    this.props.dispatch({ type: "MODE" });
  }

  // Searching mode - city name / geolocation.
  setSearching(e){
    e.preventDefault();
    this.props.dispatch({ type: "SEARCHING_MODE" });
  }

  // Weather mode - hourly / daily.
  setWeatherMode(e){
    this.props.dispatch({ type: "WEATHER_MODE"});
  }
  render(){
    // Creating suggestions list if necessary.
    let suggestionsList;
    if (this.props.location && this.state.showSuggestions
        && this.props.searchBy === 0) {
      suggestionsList = (
        <ul id="suggestions">
              {this.state.filteredSuggestions.map((suggestion, index) => {
                let id;
                // Give the active suggestion an id.
                if (index === this.state.activeSuggestion) {
                  id = "active";
                }
                return (
                  <li id={id} key={index}
                  onClick={this.enterSuggestion}>{suggestion}
                  </li>
                );
              })}
        </ul>
      )
    }

    return (
      <div id="body" style={this.props.style.bodyBackground}
      onKeyDown={this.clickSuggestion}>
          <h1 style={this.props.style.text}>JNP II Weather</h1>
          <button onClick={this.setSearching}>{this.props.style.butVal1}</button>
          <br></br>


          <form onSubmit={this.search}>
            <input type="radio" id="hourly" name="weatherMode" value={0}
            checked={(this.props.weatherMode === 0)}
            onChange={this.setWeatherMode}>
            </input>
            <label htmlFor="hourly" style={this.props.style.text}>
            Hourly forecast for 2 days</label>
            <input type="radio" id="daily" name="weatherMode" value={1}
            checked={(this.props.weatherMode === 1)}
            onChange={this.setWeatherMode}>
            </input>
            <label htmlFor="daily" style={this.props.style.text}>
            Daily forecast for 7 days</label>
            <br></br>

            <input type="text" placeholder="Enter your location"
            onInput={this.handleInput}
            style={this.props.style.input}
            value={this.props.location}>
            </input>
            {suggestionsList}
            <button type="submit">Search</button>
          </form>
          <form onSubmit={this.setMode} id="mode">
            <button type="submit">{this.props.style.butVal2}</button>
          </form>
          <p id="error">{this.props.style.error}</p>
          <img id="logo" src={sun} alt="pic"></img>
          <div id="weather" style={this.props.style.weatherDisplay}>
            <img id="GIF1" src={this.props.GIF} alt="this slowpoke moves"></img>
            <div id="weather-data">
              <p id="type" style={this.props.style.text}>
                {this.props.weatherData.type + " weather"}</p>
              <p className="param" style={this.props.style.text}>
                {"Average temperature: " + this.props.weatherData.avg + "\xB0C"}</p>
              <p className="param" style={this.props.style.text}>
                {"Max temperature: " + this.props.weatherData.max + "\xb0C"}</p>
              <p className="param" style={this.props.style.text}>
                {"Min temperature: " + this.props.weatherData.min + "\xB0C"}</p>
              <p className="param" style={this.props.style.text}>
                {"Rainy " + this.props.weatherData.text + ": " +
                this.props.weatherData.rainy}</p>
            </div>
            <img id="GIF2" src={this.props.GIF} alt="this slowpoke moves"></img>
          </div>
      </div>
    )
  }
}

/* Query selector providing access to precise
 * description of actual query. Depends on 3 values:
 * state.searchBy, state.weatherMode (those 2 are
 * boolen, so we store them as a number from range [0,3]:
 * queryCode parameter) and state.location (actual state of
 * input field). This also allows to store last query by
 * passing an actual one as a parameter with "SEARCH" action. */
const querySelector = (state) => {
  let json =  {
    'queryCode': (state.searchBy * 2) + state.weatherMode,
    'location': state.location
  };
  return JSON.stringify(json);
}

// Style selector using function from './style/style.js'.
const styleSelector = (state) => {
  return getStyle(state);
}

// Weather parameters selector using function from './weather/weather.js'.
const weatherSelector = (state) => {
  return getWeatherParams(state.weather);
}

const mapStateToProps = (state) => ({
  location: state.location,
  searchBy: state.searchBy,
  weatherMode: state.weatherMode,
  mode: state.mode,
  status: state.status,
  query: querySelector(state),
  style: styleSelector(state),
  weather: state.weather,
  weatherData: weatherSelector(state),
  GIF: state.GIF,
  lastQuery: state.lastQuery
})

export default connect(mapStateToProps)(Weather);
