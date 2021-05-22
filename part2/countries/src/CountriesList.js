import {useState} from 'react'
import CountryDetail from './CountryDetail'

function CountriesList({ foundCountries }) {

    const [clickedCountry, setClickedCountry] = useState({})

    function mappedCountries() {
        return foundCountries.map((country) => {
            return(
                <p key={country.name}>
                    {country.name}  <button onClick={() => {setClickedCountry(country)}}>show</button>
                </p>
            )
        })
    }

    return(
        <>
            { clickedCountry.name ? <CountryDetail country={clickedCountry} /> : mappedCountries() }
        </>
    )
}

export default CountriesList;