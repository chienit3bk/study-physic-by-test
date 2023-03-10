const BaseController = require('./BaseController');

class ExamController extends BaseController {
  // Generate exam
  static async generate(req, res) {
    try {
      const { totalQuestion, tags, level, time } = req.body;
      const avarageQuestionPerTag = Math.ceil(totalQuestion / tags.length);
      const minQuestionPerTag = Math.floor(totalQuestion / tags.length);

      const userId = req.user.id;

      const { Question, sequelize, Exam } = req.app.get('db');

      const newExam = await Exam.build({
          UserId: userId,
          level,
          totalQuestion,
          time,
      }).save();

      if (!newExam) {
        res.status(400).send('Can not create Exams');
      }

      const question = {};

      const promiseList = tags.map((tag) => {
        return new Promise((resolve, reject) => {
          Question.findAll({
            include: req.app.get('db').Tag,
            where: {
              mainTag: tag,
            },
            order: [sequelize.fn('RANDOM')],
            limit: avarageQuestionPerTag
          }).then(data => {
            console.log('question', data[0])
            return data.map(i => i.dataValues)
          }).then((data) => {
            question[tag] = data;
            resolve();
          })
        });
      });

      await Promise.allSettled(promiseList);

      let result = [];

      Object.keys(question).forEach(tag => {
        if (result.length <  totalQuestion) {
          for (let i = 0; i < minQuestionPerTag; i++) {
            result.push(question[tag][i]);
          }
        }
      });

      Object.keys(question).forEach(tag => {
        if (question[tag].length > minQuestionPerTag && result.length < totalQuestion) {
          result.push(question[tag][minQuestionPerTag]);
        }
      });

      result = result.map(question => question.id);

      newExam.setQuestions(result);

      res.status(200).send(newExam);

    } catch (error) {
      res.status(400).send(error);
    }
  };

  static async getById(req, res) {
    try {
      const { Exam, Question } = req.app.get('db');
      const result = await Exam.findOne({
        where: {
          'id': req.params.id,
        },
        include: Question,
      });
      res.status(200).send(result);
    } catch (error) {
      res.status(400).send(error);
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

  static async getList(req, res) {
    try {
      const result = await super.getList(req, 'Exam');
      res.status(200).send(result);
    } catch (error) {
      res.status(400).send(error);
    }
  }

};

module.exports = ExamController;
