const {Router} = require('express')
const multer = require('multer')
const _ = require('lodash/string')
const upload = multer()
const router = Router()
const date = require('date-and-time');
const UserModel = require('../models/UserModel')
const {getUsersByDefault, getUsersByAppNum} = require('../public/getUsers/getUsers')


router.get('/', (req, res) => {
    res.status(200)
    res.render('form-page', {
        title: 'Данные ЖК Москвичка'
    })
})

router.get('/consent', (req, res) => {
    res.status(200)
    res.render('consent-page', {
        title: 'Согласие'
    })
})

router.get('/users', (req, res) => {
    res.status(200)
    res.render('get-users-page', {
        title: 'GetUser',
        layout: 'getUsers'
    })
})

router.get('/get-users-by-default',  getUsersByDefault)
router.get('/get-users-by-num',  getUsersByAppNum)

router.post('/api/postform', upload.none(), async (req, res) => {
    const candidate = new UserModel({
        timeAdded: date.format(new Date(), 'DD/MM/YYYY HH:mm:ss'),
        name: _.trim(req.body.name),
        surname: _.trim(req.body.surname),
        appartmentNumber: _.trim(req.body.appnum).split(/\D+/),
        phone: req.body.phone,
        status: req.body.status,
        telegramNick: _.trim(req.body.nickname),
        telegramUniqueNick: _.trim(req.body.uniqueNickname),
        comment: req.body.comment
    })
    try {
        await candidate.save()
        res.status(200).json({message: 'Данные успешно отправлены.'})
    } catch (e) {
        console.log(e)
        res.status(500).json({message: 'Ошибка записи в базу данных'})
    }
})


module.exports = router