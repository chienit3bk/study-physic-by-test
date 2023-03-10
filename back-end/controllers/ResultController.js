const BaseController = require('./BaseController');
class ResultController extends BaseController {

  static async create(req, res) {
    try {
      const createReuslt = await super.create(req, 'Result');
      const { questions } = req.body;

      if (!createReuslt) {
        res.status(500).send('Somethings went wrong, please contact our support');
      } else {
        const { Question } = req.app.get('db');

        const questionIds = questions.map(question => question.id);

        const listQuestion = await Question.findAll({
          where: {
            id: questionIds,
          }
        });

        const promiseList = listQuestion.map((question) => {
          return new Promise((resolve, reject) => {
            const questionTime = questions.find(item => item.id === question.id).time;

            if (questionTime) {
              const { id, totalUser, averateTime } = question;

              const newTotalUser = totalUser + 1;
              const newTime = parseInt((totalUser * averateTime + questionTime) / newTotalUser);

              const newQuestion = { ...question, averateTime: newTime, totalUser: newTotalUser };
              Question.update(newQuestion, {
                where: {
                  id
                }
              })
                .then((result) => resolve(result))
                .catch((error) => {
                  console.log(error);
                  reject(error);
                })
            } else {
              resolve(null);
            }
          })
        })

        await Promise.allSettled(promiseList);

        res.status(200).send(createReuslt);
      }
    } catch (error) {
      console.log(error);
      res.status(400).send('Invalid data');
    }
  }

  static async updateQuestionInformation(req, res) {
    try {
      { id, time }

      const { Question, sequelize } = req.app.get('db');
      const promiseList = questions.map(question => {
        return Promise((resolve, reject) => {
          Question.upda
        })
      })
    } catch (error) {
      res.status(400).send(error);
    }
  }

  static async getList(req, res) {
    try {
      const result = await super.getList(req, 'Result');
      res.status(200).send(result);
    } catch (error) {
      res.status(400).send(error);
    }
  }
}

module.exports = ResultController;
