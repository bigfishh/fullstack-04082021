import Weather from "./Weather"

function CountryDetail({ country }) {

    const {name, capital, population, languages, flag} = country

    function displayLanguages() {
        return languages.map(({name}) => {
            return <li key={name}>{name}</li>
        })
    }

    return(
        <div>
            <h1>{name}</h1>
            <p>capital: {capital}</p>
            <p>population: {population}</p>
            <h3>spoken languages</h3>
            <ul>{displayLanguages()}</ul>
            <img src={flag} alt={name} style={{width: '300px'}}/>
            <Weather capital={capital} />
        </div>
    )
}

export default CountryDetail;