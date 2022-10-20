const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      res.status(500).send({ message: 'Ошибка по умолчанию', err });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create([{ name, link, owner }, { new: true }])
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданные данные не валидны', err });
        return;
      }
      res.status(500).send({ message: 'Ошибка по умолчанию', err });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card === null) {
        res.status(404).send({ message: 'Карточка с указанным _id не найдена' });
        return;
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданны неккоректные данные для удаления карточки' });
      } else {
        res.status(500).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
).then((card) => {
  if (card === null) {
    res.status(404).send({ message: 'Карточка с указанным _id не найдена' });
    return;
  }
  res.status(200).send(card);
})
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Переданны неккоректные данные для лайка карточки' });
    } else {
      res.status(500).send({ message: 'Ошибка по умолчанию' });
    }
  });

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
).then((card) => {
  if (card === null) {
    res.status(404).send({ message: 'Карточка с указанным _id не найдена' });
    return;
  }
  res.status(200).send(card);
})
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Переданны неккоректные данные для лайка карточки' });
    } else {
      res.status(500).send({ message: 'Ошибка по умолчанию' });
    }
  });
