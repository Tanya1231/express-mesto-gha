const Card = require('../models/card');
const ErrorCode = require('../errors/ErrorCode');
const ErrorForbidden = require('../errors/ErrorForbidden');
const ErrorNotFound = require('../errors/ErrorNotFound');
const ErrorServer = require('../errors/ErrorServer');

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    return res.send(cards);
  } catch (err) {
    return next(new ErrorServer('Ошибка по умолчанию'));
  }
};

const createCard = async (req, res, next) => {
  const { name, link } = req.body;
  try {
    const card = await Card.create({ name, link, owner: req.user._id });
    return res.send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new ErrorCode('Переданные данные не валидны'));
    }
    return next(new ErrorServer('Ошибка по умолчанию'));
  }
};

const deleteCard = async (req, res, next) => {
  const { cardId } = req.params;
  const owner = req.user._id;
  try {
    const card = await Card.findByIdAndRemove({ _id: cardId }, { new: true, runValidators: true });
    if (card === null) {
      return next(new ErrorNotFound('Карточка с указанным _id не найдена'));
    }
    if (owner !== card.owner.toString()) {
      return next(new ErrorForbidden('Вы не можете удалить чужую карточку'));
    }
    Card.findByIdAndRemove(cardId);
    return res.send({ message: 'Карточка удалена' });
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new ErrorCode('Переданны неккоректные данные для удаления карточки'));
    }
    return next(new ErrorServer('Ошибка по умолчанию'));
  }
};

const likeCard = async (req, res, next) => {
  const { cardId } = req.params;
  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    );
    if (card === null) {
      return next(new ErrorNotFound('Карточка с указанным _id не найдена'));
    }
    return res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new ErrorCode('Переданны неккоректные данные для лайка карточки'));
    }
    return next(new ErrorServer('Ошибка по умолчанию'));
  }
};

const dislikeCard = async (req, res, next) => {
  const { cardId } = req.params;
  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    );
    if (card === null) {
      return next(new ErrorNotFound('Карточка с указанным _id не найдена'));
    }
    return res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new ErrorCode('Переданны неккоректные данные для лайка карточки'));
    }
    return next(new ErrorServer('Ошибка по умолчанию'));
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
