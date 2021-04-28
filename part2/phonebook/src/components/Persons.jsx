function Persons({ persons }) {

    function renderPersons() {
        return persons.map(({ name, number }) => {
            return <p key={name}>{ name } { number }</p>
        })
    }

    return(
        <div>
            <h3>Numbers</h3>
            {renderPersons()}
        </div>
    )
}

export default Persons;