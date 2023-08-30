// Imports
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express()

// Config JSON response
app.use(express.json())

// Models
const User = require('./models/User')

// Open Route - Public Route
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/frontend/index.html')
})

// Private Route
app.get("/user/:id", checkToken, async (req, res) => {

    const id = req.params.id

    // Checar se usuário existe
    const user = await User.findById(id, '-password')

    if(!user) {
        return res.status(404).json({msg: 'Usuário não encontrado'})
    }
    res.status(200).json({ user })
})

function checkToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
        return res.status(401).json({msg: 'Acesso negado'})
    }

    try {
        const secret = process.env.SECRET

        jwt.verify(token, secret)

        next()
    } catch (error) {
        res.status(400).json({msg: 'Token inválido!'})
    }
}

// Registrar usuário
app.post('/auth/register', async(req, res) => {
    const {name, email, password, confirmpassword} = req.body

    // Validações
    /* 
    Algumas referencias para status HTTP:
    https://www.w3schools.com/tags/ref_httpmessages.asp
    https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
    */
    if (!name) {
        return res.status(422).json({msg: 'O nome é obrigatório!'})
    }

    if (!email) {
        return res.status(422).json({msg: 'O email é obrigatório!'})
    }

    if (!password) {
        return res.status(422).json({msg: 'A senha é obrigatória!'})
    }

    if(password !== confirmpassword) {
        return res.status(422).json({msg: 'As senhas não conferem!'})
    }

    // Checar se usuario já existe
    const userExists = await User.findOne({email: email})
    if(userExists) {
        return res.status(422).json({msg: 'Por favor, utilize outro e-mail!'})
    }

    // Criar senha
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    // Criar usuário
    const user = new User({
        name,
        email,
        password: passwordHash,
    })
    try {
        await user.save()
        res.status(201).json({msg: 'Usuário criado com sucesso!'})
    } catch(error) {
        console.log(error)
        res.status(500).json({msg: 'Aconteceu um erro no servidor, tente novamente mais tarde'})
    }
})

// Login de usuário

app.post('/auth/login', async (req, res) => {
    const {email, password} = req.body
    // Validações
    if (!email) {
        return res.status(422).json({msg: 'O email é obrigatório!'})
    }
    if (!password) {
        return res.status(422).json({msg: 'A senha é obrigatória!'})
    }

    // Checar se usuário existe
    const user = await User.findOne({email: email})
    if(!user) {
        return res.status(404).json({msg: 'Usuário não encontrado!'})
    }
    // Checar se senha é compativel
    const checkPassword = await bcrypt.compare(password, user.password)
    if(!checkPasword) {
        return res.status(422).json({msg: 'Senha inválida'})
    }

    try {
        const secret = process.env.SECRET

        const token = jwt.sign({
            id: user._id,
        },
        secret,
        )
        res.status(200).json({msg: 'Autenticação realizada com sucesso', token})
    } catch(error) {
        console.log(error)
        res.status(500).json({msg: 'Aconteceu um erro no servidor, tente novamente mais tarde'})
    }
})

// Credenciais
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS

mongoose
    .connect(
        `mongodb+srv://${dbUser}:${dbPassword}@cluster0.cr4w0re.mongodb.net/DataBase?retryWrites=true&w=majority`,
        )
    .then(() => {
        app.listen(3000)
        console.log('Conectou ao MongoDB!')
    })
    .catch((err) => console.log(err))