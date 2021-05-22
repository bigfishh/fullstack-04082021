import axios from "axios";
import { useEffect, useState } from "react";

function Weather({ capital }) {

    const [weather, setWeather] = useState([])

    useEffect(() => {
        axios
            .get(`http://api.weatherstack.com/current?access_key=${process.env.REACT_APP_API_KEY}&query=${capital}`)
            .then(response => {
                if (response.data.current) {
                    setWeather(response.data.current)
                }
            })
    }, [capital])

    function renderWeather() {
        if (weather) {
            return(
                <>
                    <h3>weather in {capital}</h3>
                    <p><strong>temperature: </strong>{weather.temperature} celsius</p>
                    <img src={weather.weather_icons} alt={capital}/>
                    <p><strong>wind: </strong>{weather.wind_speed} mph direction {weather.wind_dir}</p>
                </>
            )
        }
    }

    return(
        <>
            {renderWeather()}
        </>
    )

}

export default Weather;