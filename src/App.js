import { useEffect, useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDroplet,
  faEye,
  faCloudRain,
  faTemperatureThreeQuarters,
  faMagnifyingGlass,
  faSun,
  faWind,
} from "@fortawesome/free-solid-svg-icons";
import "./App.css";

function App() {
  const [data, changeData] = useState("");
  const [city, changeCity] = useState("Miami");
  const [location, changeLocation] = useState("");
  const [condition, changeCondition] = useState("");
  const [forecast, changeForecast] = useState("");

  const getData = useCallback(async (city) => {
    const info = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=77f552816a9043c686941503221012&q=${city}&days=1&aqi=yes&alerts=no
      `
    );
    const response = await info.json();
    changeData(response.current);
    changeLocation(response.location);
    changeCondition(response.current.condition);
    changeForecast(response.forecast);

    window.localStorage.setItem("city", JSON.stringify(city));
    window.localStorage.setItem("data", JSON.stringify(response.current));
    window.localStorage.setItem(
      "condition",
      JSON.stringify(response.current.condition)
    );
    window.localStorage.setItem("forecast", JSON.stringify(response.forecast));
    window.localStorage.setItem("location", JSON.stringify(response.location));

    const checkUV = () => {
      let uvScale = document.querySelector("#uv-div").lastElementChild;
      let uv = response.current.uv;
      if (uv <= 2) {
        uvScale.textContent = "Low";
      } else if (uv >= 3 && uv <= 7) {
        uvScale.textContent = "Moderate";
      } else {
        uvScale.textContent = "High";
      }
    };

    checkUV();

    const toggleBgImg = () => {
      let weather = response.current.condition.text.toLowerCase();
      if (weather) {
        let img = document.querySelector(".bg-imgs");
        if (weather.includes("sun") || weather.includes("clear")) {
          img.src =
            "https://bestgifs.makeagif.com/wp-content/uploads/2016/07/flowers.gif";
        } else if (weather.includes("rain") || weather.includes("shower")) {
          img.src =
            "https://gifimage.net/wp-content/uploads/2017/07/animated-rain-gif-12.gif";
        } else if (
          weather.includes("cloud") ||
          weather.includes("mist") ||
          weather.includes("overcast")
        ) {
          img.src =
            "https://media.tenor.com/images/06e92cf035bc408da6d8249888d3256b/tenor.gif";
        } else if (weather.includes("snow")) {
          img.src =
            "https://media.giphy.com/media/xTcnThWTvBZGrgx2dW/giphy.gif";
        }
      }
    };

    toggleBgImg();
  }, []);

  const setCity = () => {
    let city = document.querySelector(".city");
    if (city.value !== "") {
      changeCity(city.value);
    }
    city.value = "";
  };

  const searchToggle = () => {
    let input = document.querySelector(".city-search").style;
    if (input.display === "initial") {
      input.display = "none";
    } else {
      input.display = "initial";
    }
  };

  useEffect(() => {
    // navigator.geolocation.getCurrentPosition(
    //   (pos) => {
    //     let crd = pos.coords;
    //     let lat = crd.latitude.toString();
    //     let lng = crd.longitude.toString();
    //     changeCity(lat, lng);
    //   },
    //   (err) => {
    //     console.warn("error" + err.code, err.message);
    //   }
    // );

    changeData(JSON.parse(window.localStorage.getItem("data")));
    changeForecast(JSON.parse(window.localStorage.getItem("forecast")));
    changeCity(JSON.parse(window.localStorage.getItem("city")));
    changeLocation(JSON.parse(window.localStorage.getItem("location")));
    changeCondition(JSON.parse(window.localStorage.getItem("condition")));

    let city = document.querySelector(".city");
    city.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        setCity(city.value);
      }
    });
  }, []);

  useEffect(() => {
    getData(city);
  }, [city, getData]);

  if (data) {
    return (
      <div className="app-div">
        <img
          src="https://media.tenor.com/gznLWsJjaMAAAAAC/daytime-miving.gif"
          alt="daytime"
          className="day bg-imgs"
        />

        <div className="weather-header">
          <h2 onClick={searchToggle}>
            {location.name}{" "}
            <FontAwesomeIcon icon={faMagnifyingGlass} className="search" />
          </h2>
          <div className="city-search">
            <input type="text" className="city" />
            <button className="change-city" onClick={setCity}>
              Search
            </button>
          </div>
          <p className="temp">{data.temp_f}˚</p>
          <p className="weather-text">{condition.text}</p>
          <div className="hi-lo">
            <div>
              <p className="forecast-header">Hi</p>
              <p className="forecast-temp">
                {forecast.forecastday[0].day.maxtemp_f}˚
              </p>
            </div>
            <div>
              <p className="forecast-header">Lo</p>
              <p className="forecast-temp">
                {forecast.forecastday[0].day.mintemp_f}˚
              </p>
            </div>
          </div>
        </div>
        <div className="other-weather">
          <div id="humidity-div">
            <h3>
              Humidity <FontAwesomeIcon icon={faDroplet} />
            </h3>
            <p>{data.humidity}%</p>
          </div>
          <div id="feels-div">
            <h3>
              Feels Like <FontAwesomeIcon icon={faTemperatureThreeQuarters} />
            </h3>
            <p>{data.feelslike_f}˚</p>
          </div>
          <div id="visible-div">
            <h3>
              Visibility <FontAwesomeIcon icon={faEye} />
            </h3>
            <p>{data.vis_miles} mi</p>
          </div>
          <div id="precipitation-div">
            <h3>
              Precipitation <FontAwesomeIcon icon={faCloudRain} />
            </h3>
            <p>{data.precip_in}"</p>
          </div>
          <div id="uv-div">
            <h3>
              UV Index <FontAwesomeIcon icon={faSun} />
            </h3>
            <p className="uv"> {data.uv}</p>
            <h4 className="uv-level">{""}</h4>
          </div>
          <div id="wind-div">
            <h3>
              Wind <FontAwesomeIcon icon={faWind} />
            </h3>
            <p>{data.wind_mph} mph</p>
          </div>
        </div>
        <img src={condition.icon} alt="day icon" className="condition-img" />
      </div>
    );
  } else {
    return <div></div>;
  }
}

export default App;
