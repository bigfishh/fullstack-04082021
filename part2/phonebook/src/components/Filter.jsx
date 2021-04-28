function Filter({ searchVal, setSearchVal }) {
    return(
        <div>
            Search: <input onChange={(e) => {setSearchVal(e.target.value)}} value={searchVal} />
        </div>
    )
}

export default Filter;