const Content = (props) => {

    function returnProps() {
        return props.parts.map(part => {
            return <p key={part.name}>{part.name} {part.exercises}</p>
        });
    }

    return (
        <div>
            {returnProps()}
        </div>
    )
}

export default Content;