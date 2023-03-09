const BaseController = require('./BaseController');
class ResultController extends BaseController {

  static async create(req, res) {
    try {
      const createReuslt = await super.create(req, 'Result');

      if (!createReuslt) {
        res.status(500).send('Somethings went wrong, please contact our support');
      } else {
        res.status(200).send(createReuslt);
      }
    } catch (error) {
      console.log(error);
      res.status(400).send('Invalid data');
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
