const express = require('express')
const router = express.Router()

const Book = require('./../models/Book.model')
const { isLoggedIn } = require('../middleware/route-guard')


// books list
router.get('/listado', (req, res) => {

    Book
        .find()
        .then(books => res.render('books/list',
            {
                books: books,
                isAdmin: req.session.currentUser.role === 'ADMIN',
                isEditor: req.session.currentUser.role === 'EDITOR'
            }
        ))
        .catch(err => console.log(err))
})

// books details
router.get('/detalles/:book_id', (req, res) => {

    const { book_id } = req.params

    Book
        .findById(book_id)
        .then(book => res.render('books/details', book))
        .catch(err => console.log(err))
})



// Owned books
router.get('/mis-libros', isLoggedIn, (req, res) => {

    const { _id: owner } = req.session.currentUser

    Book
        .find({ owner })
        .then(books => res.render('books/list', { books }))
        .catch(err => console.log(err))
})



// New book form (render)
router.get('/crear', isLoggedIn, (req, res) => {
    res.render('books/create')
})

// New book form (hanlder)
router.post('/crear', isLoggedIn, (req, res) => {

    const { title, description, author, rating } = req.body
    const { _id: owner } = req.session.currentUser            // destructuración nominal

    Book
        .create({ title, author, description, rating, owner })
        .then(book => res.redirect(`/libros/detalles/${book._id}`))
        .catch(err => console.log(err))
})




// Edit book form (render)
router.get('/editar/:book_id', isLoggedIn, (req, res) => {

    const { book_id } = req.params

    Book
        .findById(book_id)
        .then(book => res.render('books/edit', book))
        .catch(err => console.log(err))
})


// Edit book form (handler)
router.post('/editar/:book_id', isLoggedIn, (req, res) => {

    const { title, description, author, rating } = req.body
    const { book_id } = req.params

    Book
        .findByIdAndUpdate(book_id, { title, description, author, rating })
        .then(() => res.redirect(`/libros/detalles/${book_id}`))
        .catch(err => console.log(err))
})




// Delete book
router.post('/eliminar/:book_id', isLoggedIn, (req, res) => {

    const { book_id } = req.params

    Book
        .findByIdAndDelete(book_id)
        .then(() => res.redirect('/libros/listado'))
        .catch(err => console.log(err))
})



module.exports = router