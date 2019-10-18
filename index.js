const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/database');
const Pergunta = require('./database/Pergunta');
const Resposta = require('./database/Resposta');

//Database

connection
    .authenticate()
    .then(() => {
        console.log('Conexão feita com o banco de dados!');
    })
    .catch((msgErro) => {
        console.log(msgErro);
    });

// Estou dizendo para o express usar o ejs como view engine
app.set('view engine', 'ejs');
app.use(express.static('public'));
//BodyParser - Responsável por disponibilizar o req.body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//Rotas
app.get("/", (req, res) => {
    //SELECT * FROM perguntas
    Pergunta.findAll({
        raw: true, order: [
            ['id', 'DESC']
        ]
    }).then(perguntas => {
        res.render("index", {
            perguntas: perguntas
        });
    });
});


app.get("/perguntar", (req, res) => {
    res.render("perguntar");
})

app.post("/salvarpergunta", (req, res) => {
    const titulo = req.body.titulo;
    const descricao = req.body.descricao;
    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect('/');
    });
});

app.get("/pergunta/:id", (req, res) => {
    const id = req.params.id;
    Pergunta.findOne({
        where: { id: id }
    }).then(pergunta => {
        if (pergunta != undefined) {

            Resposta.findAll({
                where: { perguntaId: pergunta.id },
                order: [
                    ['id', 'DESC']
                ]
            }).then(respostas => {
                res.render("pergunta", {
                    pergunta: pergunta,
                    respostas: respostas
                });
            });
        } else {
            res.render("/")
        }
    })
});

app.post("/responder", (req, res) => {
    const corpo = req.body.corpo;
    const perguntaId = req.body.pergunta;
    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {
        res.redirect("/pergunta/" + perguntaId);
    });
});


app.listen(8080, () => { console.log("Servidor rodando") });