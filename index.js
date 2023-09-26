const express = require('express');
const app = express();
const jwt = require('jsonwebtoken')

app.use(express.static(__dirname+'/public'))
app.use(express.json());
app.use(express.urlencoded({extended: false}))

app.get('/', (req, res) => {
    res.send('Hola Mundo');
});

app.get('/privada',validateToken, (req,res)=>{
    res.sendFile(__dirname + '/public/index.html')
});

app.get('/login', (req,res)=>{
    res.sendFile(__dirname + '/public/login.html')
})

app.post('/auth', (req, res) => {
    const {username, password} = req.body;

    const user = {username: username};

    const accesToken = generateAccesToken(user);

    res.header('autorization', accesToken).json({
        message: 'Usuario autenticado',
        token: accesToken
    })

});

function generateAccesToken(user){
    return jwt.sign(user,'key',{expiresIn: '5m'});
}

function validateToken(req, res, next){
    const accesToken = req.headers['authorisation'] || req.query.accestoken;
    if(!accesToken) res.send('Acceso denegado');

    jwt.verify(accesToken, 'key', (err, user) =>{
        if(err){
            res.send('Acceso denegado, token incorrecto o expirado');
        }else{
            req.user = user;
            next();
        }
    })
}

app.listen(3000, () => {
    console.log('servidor iniciado');
});