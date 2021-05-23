function Person({ person: {id, name, number}, removeContact }) {

    function handleDelete() {
        if (window.confirm(`Delete ${name}?`)) {
            removeContact(id, name)
        }
    }


    return(
        <p>
            { name } { number } <button onClick={handleDelete}>delete</button>
        </p>
    )
}

export default Person;