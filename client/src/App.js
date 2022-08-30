import React, { useState, useEffect } from 'react'

import Persons from './components/Persons'
import PersonForm from './components/PersonForm'

import personService from './services/persons'

const App = () => {
  const [ persons, setPersons] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ notificationMessage, setNotificationMessage] = useState(null)
  const [ notificationType, setNotificationType] = useState('confirm')



  useEffect(() => {
    console.log('effect')
    personService
    .getAll()
    .then(initialPersons => {
      setPersons(initialPersons)
    })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const nameObject = {
      name: newName, 
      number: newNumber
    }
    console.log('nameObject.name: ' +nameObject.name)
    if (persons.map(person => person.name).includes(nameObject.name)) {
      setNotificationType('error')
      setNotificationMessage(`nimi ${nameObject.name} on jo käytössä!`)
        setTimeout(() => {
          setNotificationMessage(null)
        }, 5000)
      
    } else {
      personService
        .create(nameObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNotificationType('confirm')
          setNotificationMessage(`kohde ${nameObject.name} lisätty onnistuneesti.`)
        
        }).catch(error => {
          setNotificationType('error')
          console.log(error.response.data)
          setNotificationMessage(JSON.stringify(error.response.data))         
        })        
    }   
    setNewName('')
          setNewNumber('')   
  }

  const delPerson = (person) => {
    const id = person.id
    if (window.confirm(`haluatko varmasti poistaa kohteen ${person.name}?`)) {
      personService
      .del(id)
      .then(setPersons(persons.filter(person => person.id !== id)))
      .catch(error => {
        setNotificationType('error')
        setNotificationMessage(`kohde ${person.name} on jo poistettu palvelimelta.`)
      })
      setNotificationType('confirm')
      setNotificationMessage(`kohde ${person.name} poistettu onnistuneesti.`)
        setTimeout(() => {
          setNotificationMessage(null)
        }, 5000)
    }
    



  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
    
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
    
  }

  const Notification = ({message, type }) => {
    if (message === null) {
      return null
    }
    return (
      <div className={type}>
        {message}
      </div>
    )
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} type={notificationType}/>
      <PersonForm 
      newName={newName} 
      newNumber={newNumber}
      handleNameChange={handleNameChange} 
      handleNumberChange={handleNumberChange}
      onSubmit={addPerson}/>      
      <h2>Numbers</h2>            
      <Persons persons={persons} delPerson={delPerson}/>             
    </div>
  )

}

export default App