function Form({ setNewName, setNewNumber, handleSubmit}) {
    return(
        <div>
            <h3>Add New</h3>
            <form onSubmit={handleSubmit}>
                <div>name: <input onChange={(e) => setNewName(e.target.value)} /></div>
                <div>number: <input onChange={(e) => setNewNumber(e.target.value)} /></div>
                <div><button type="submit">add</button></div>
            </form>
        </div>
    )
}

export default Form;