const express = require('express');

const cardRoutes = express.Router();
const auth = require('../middlewares/auth');

const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

cardRoutes.get('/cards', auth, getCards);
cardRoutes.post('/cards', auth, createCard);
cardRoutes.delete('/cards/:cardId', auth, deleteCard);
cardRoutes.put('/cards/:cardId/likes', auth, likeCard);
cardRoutes.delete('/cards/:cardId/likes', auth, dislikeCard);

module.exports = { cardRoutes };
