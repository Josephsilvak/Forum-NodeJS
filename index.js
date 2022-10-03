const express = require('express')
const app = express()

app.use(express.static('public'))
app.set('view engine', 'ejs')

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: false})) //disponibiliza o req".body"...
app.use(bodyParser.json()) // permite manipulação de aquivos.JSON

PerguntaModel = require('./database/Pergunta')
RespostaModel = require('./database/Resposta')

const connection  = require('./database/database')
const { render } = require('ejs')

connection
    .authenticate()
    .then(() => { console.log('Conexão feita com o Banco de Dados!') })
    .catch(() => { console.log('Houve um *Erro ao se conectar com o Banco de Dados!') })




app.get('/', (req, res) => {
    PerguntaModel.findAll({raw: true, order:[['createdAt', 'DESC']]}).then(perguntas => {
        res.render('index', {
            perguntas: perguntas,
        })
    })

})

app.post('/salvarPergunta', (req, res) => {
    let titulo = req.body.titulo
    let descricao = req.body.descricao

    PerguntaModel.create({
        titulo: titulo,
        descricao: descricao,
    }).then(() => {
        res.redirect('/')
    })
})

app.get('/pergunta/:id', (req, res) => {
    let id = req.params.id

    PerguntaModel.findOne({
        where: {id:id}
    }).then(pergunta => {
        if(pergunta != undefined){

            RespostaModel.findAll({
                where: {perguntaId:pergunta.id},
                order: [['createdAt', 'DESC']]
            }).then(respostas => {

                res.render('pergunta', {
                    pergunta:pergunta,
                    respostas: respostas,
                })
            })
            

        } else {
            res.redirect('/')
        }
    })
})

app.post('/responder', (req, res) => {
    let corpo = req.body.corpo
    let perguntaId = req.body.pergunta

    RespostaModel.create({
        corpo:corpo,
        perguntaId:perguntaId

    }).then(() => {
        res.redirect('pergunta/'+perguntaId)
    })
})





app.listen(444, () => {console.log('Servidor iniciado com sucesso!')})