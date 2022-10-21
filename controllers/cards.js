const Card = require('../models/card');
const {
  ERROR_CODE, NOT_FOUND, SERVER__ERROR,
} = require('../utils/utils');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => {
      res.status(SERVER__ERROR).send({ message: 'Ошибка по умолчанию' });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create([{ name, link, owner: req.user._id }], { new: true })
    .then((card) => res.send({ data: card[0] }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'Переданные данные не валидны' });
        return;
      }
      res.status(SERVER__ERROR).send({ message: 'Ошибка по умолчанию' });
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove({ _id: cardId }, { new: true, runValidators: true })
    .then((card) => {
      if (card === null) {
        res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Переданны неккоректные данные для удаления карточки' });
      } else {
        res.status(SERVER__ERROR).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

const likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
).then((card) => {
  if (card === null) {
    res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
    return;
  }
  res.send(card);
})
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(ERROR_CODE).send({ message: 'Переданны неккоректные данные для лайка карточки' });
    } else {
      res.status(SERVER__ERROR).send({ message: 'Ошибка по умолчанию' });
    }
  });

const dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
).then((card) => {
  if (card === null) {
    res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
    return;
  }
  res.send(card);
})
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(ERROR_CODE).send({ message: 'Переданны неккоректные данные для лайка карточки' });
    } else {
      res.status(SERVER__ERROR).send({ message: 'Ошибка по умолчанию' });
    }
  });

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
