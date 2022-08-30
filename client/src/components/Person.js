import React from "react";

const Person = ({person, delOnePerson}) => {
    return (
        <p>{person.name} {person.number} <button onClick={delOnePerson}>delete</button></p>
    )
}

export default Person