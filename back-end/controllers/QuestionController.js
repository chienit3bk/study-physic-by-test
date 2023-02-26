const BaseController = require('./BaseController');
class QuestionController extends BaseController {
  static async getById(req, res) {
    try {
      const { Question, Tag } = req.app.get('db');
      const result = await Question.findOne({
        where: {
          'id': req.params.id,
        },
        include: Tag,
      });
      res.status(200).send(result);
    } catch (error) {
      res.status(400).send(error);
    }
  }

  static async getList(req, res) {
    try {
      const result = await super.getList(req, 'Question', {
        include: req.app.get('db').Tag,
      });
      res.status(200).send(result);
    } catch (error) {
      res.status(400).send(error);
    }
  }

  static async create(req, res) {
    try {
      const createdQuestion = await super.create(req, 'Question');
      if (!createdQuestion) {
        res.status(500).send('Somethings went wrong, please contact our support');
      } else {
        res.status(200).send(createdQuestion);
      }
    } catch (error) {
      console.log(error);
      res.status(500).send('Somethings went wrong, please contact our support');
    }
  }

  static async updateById(req, res) {
    try {
      const result = await super.updateById(req, 'Question', req.body);
      if (result) {
        res.status(200).send(result);
      } else {
        res.status(500).send('Somethings went wrong, please try again in a few minute');
      }
    } catch (error) {
      console.log(error);
      res.status(500).send('Somethings went wrong, please contact our support');
    }
  }

  static async deleteById(req, res) {
    try {
      const result = await super.deleteById(req, 'Question');
      res.send(200, result);
    } catch (err) {
      res.send(400, err);
    }
  }

  static async attachTags(req, res) {
    const { Tag, Question } = req.app.get('db');
    const question = await Question.findByPk(req.params.id);
    if (!question) {
      res.status(400).send('Not found');
      return;
    }
    const tagIds = req.body.tagIds;
    if (Array.isArray(tagIds)) {
      const tags = await Tag.findAll({
        where: {
          id: tagIds,
        },
      });

      tags.forEach(tag => {
        question.addTag(tag);
      });
    }
    res.status(200).send(question);
  }
}

module.exports = QuestionController;
