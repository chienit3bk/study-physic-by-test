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
  };

  static async getListById(req, res) {
    try {
      const { ids } = req.body;
      const { Question, Tag } = req.app.get('db');

      const questions = await Question.findAll({
        include: Tag,
        where: {
          id: ids,
        }
      });

      if (questions) {
        res.status(200).send(questions);
      }

    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  };

  static async getList(req, res) {
    try {
      const mainTag = req.query.mainTag;
      const queryOptions = {
        include: req.app.get('db').Tag,
      }
      if (mainTag) {
        queryOptions.where = {
          mainTag: mainTag,
        };
      }
      const result = await super.getList(req, 'Question', queryOptions);
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
        await QuestionController.attachTags(req, createdQuestion);
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
      const question = await super.getById(req, 'Question');
      if (result && question) {
        res.status(200).send(result);
        await QuestionController.attachTags(req, question);
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

  static async attachTags(req, question) {
    const { Tag } = req.app.get('db');
    const tagIds = req.body.tagIds;
    if (Array.isArray(tagIds)) {
      const tags = await Tag.findAll({
        where: {
          id: tagIds,
        },
      });

      question.setTags(tags);
    }
  }
}

module.exports = QuestionController;
