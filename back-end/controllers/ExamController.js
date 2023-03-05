const BaseController = require('./BaseController');

class ExamController extends BaseController {
  static async generate(req, res) {
    try {
      const { totalQuestion, tags, level, time } = req.body;
      const avarageQuestionPerTag = Math.ceil(totalQuestion / tags.length);
      const userId = req.user.id;
      console.log(req.body, userId);
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
            where: {
              mainTag: tag,
            },
            order: [sequelize.fn('RANDOM')],
            limit: avarageQuestionPerTag
          }).then(data => data.map(i => i.dataValues)).then((data) => {
            question[tag] = data;
            resolve();
          })
        });
        // question[tag] = await Question.findAll({
        //   where: {
        //     mainTag: testQuestion[0].mainTag,
        //   },
        //   order: [sequelize.fn('RANDOM')],
        //   limit: avarageQuestionPerTag
        // });

        // question[tag] = question[tag].map(i => i.dataValues);
        // console.log(1, tag, question[tag]);

        // if (question)
      });

      await Promise.allSettled(promiseList);

      console.log(question);

      res.status(200).send(question);
      // const questions = Question.findAll({
      //   where: {
      //     mainTag: tags,
      //   }
      // });



    } catch (error) {
      console.log(1, error)
      res.status(400).send(error)
    }
  }
};

module.exports = ExamController;
