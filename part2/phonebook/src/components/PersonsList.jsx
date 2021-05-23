import Person from "./Person";

function PersonsList({ persons, removeContact }) {

    function renderPersons() {
        return persons.map((person) => {
            return(
                <Person key={person.id} person={person} removeContact={removeContact} />
            )
        })
    }

    return(
        <div>
            <h3>Numbers</h3>
            {renderPersons()}
        </div>
    )
}

export default PersonsList;