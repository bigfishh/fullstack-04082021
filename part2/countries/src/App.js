import {useEffect, useState} from'react';
import axios from 'axios';
import CountriesList from './CountriesList';
import CountryDetail from './CountryDetail';
import './App.css';

function App() {

  const [searchTerm, setSearchTerm] = useState('')
  const [countries, setCountries] = useState([])

  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  function filterCountries() {
    // return countries
    if (searchTerm === '' ) return ; 
    let foundCountries = countries.filter(({name}) => name.toLowerCase().includes(searchTerm.toLowerCase()))
    
    if (foundCountries.length > 10) {
      return "too many matches, specify another filter"
    } else if (foundCountries.length === 1) {
      return <CountryDetail country={foundCountries[0]}/>
    } else {
      return <CountriesList foundCountries={foundCountries}/>
    }
  }

  return (
    <div className="App">
      <p>find countries <input value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value)}} /></p>
      {filterCountries()}
    </div>
  );
}

export default App;
