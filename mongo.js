const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
  `mongodb+srv://anttihalmetoja:${password}@cluster0.ae9vc.mongodb.net/puhelinluettelo?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String  
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length===3) {
    console.log('Phonebook:')
    Person.find({}).then(result => {
        result.forEach(person => {
          console.log(person.name + ' ' + person.number)
        })
        mongoose.connection.close()
      })
  }

  if (process.argv.length===5) {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
      })
      person.save().then(response => {
        console.log('Added '+person.name + ' number '+person.number+' to phonebook.')
        mongoose.connection.close()
      })
      
  }
/*
const note = new Note({
  content: 'HTML is Easy',
  date: new Date(),
  important: true,
})

const note2 = new Note({
    content: 'JS is not Hard',
    date: new Date(),
    important: true,
  })

note.save().then(response => {
  console.log('note saved!')
  mongoose.connection.close()
})
note2.save().then(response => {
    console.log('note2 saved!')
    mongoose.connection.close()
  })
  */
  