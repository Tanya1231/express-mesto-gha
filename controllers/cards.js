const Card = require('../models/card');
const ErrorCode = require('../errors/ErrorCode');
const ErrorForbidden = require('../errors/ErrorForbidden');
const ErrorNotFound = require('../errors/ErrorNotFound');
const ErrorServer = require('../errors/ErrorServer');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => next(new ErrorServer('Ошибка по умолчанию')));
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create([{ name, link, owner: req.user._id }], { new: true })
    .then((card) => res.send({ data: card[0] }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorCode('Переданные данные не валидны'));
        return;
      }
      next(new ErrorServer('Ошибка по умолчанию'));
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const owner = req.user._id;
  Card.findByIdAndRemove({ _id: cardId }, { new: true, runValidators: true })
    .then((card) => {
      if (card === null) {
        next(new ErrorNotFound('Карточка с указанным _id не найдена'));
        return;
      }
      if (owner !== card.owner.toString()) {
        next(new ErrorForbidden('Вы не можете удалить чужую карточку'));
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorCode('Переданны неккоректные данные для удаления карточки'));
      } else {
        next(new ErrorServer('Ошибка по умолчанию'));
      }
    });
};

const likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
).then((card) => {
  if (card === null) {
    next(new ErrorNotFound('Карточка с указанным _id не найдена'));
    return;
  }
  res.send(card);
})
  .catch((err) => {
    if (err.name === 'CastError') {
      return next(new ErrorCode('Переданны неккоректные данные для лайка карточки'));
    }
    return next(new ErrorServer('Ошибка по умолчанию'));
  });

const dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
).then((card) => {
  if (card === null) {
    next(new ErrorNotFound('Карточка с указанным _id не найдена'));
    return;
  }
  res.send(card);
})
  .catch((err) => {
    if (err.name === 'CastError') {
      return next(new ErrorCode('Переданны неккоректные данные для лайка карточки'));
    }
    return next(new ErrorServer('Ошибка по умолчанию'));
  });

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
