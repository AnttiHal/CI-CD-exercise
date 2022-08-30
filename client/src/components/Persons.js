import React from "react";
import Person from "./Person";


const Persons = ({persons, delPerson}) => {
    return (
        <div>{persons.map(person => <Person key={person.name} person={person} delOnePerson={() => delPerson(person)}/>)}</div>
    )
}

export default Persons