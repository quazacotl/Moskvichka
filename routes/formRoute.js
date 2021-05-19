const {Router} = require('express')
const multer = require('multer')
const upload = multer()
const router = Router()
const UserModel = require('../models/UserModel')


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

router.post('/api/postform', upload.none(), async (req, res) => {
    const candidate = new UserModel({
        name: req.body.name,
        surname: req.body.surname,
        appartmentNumber: req.body.appnum,
        phone: req.body.phone,
        status: req.body.status,
        telegramNick: req.body.nickname,
        telegramUniqueNick: req.body.uniqueNickname,
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