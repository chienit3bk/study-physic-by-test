const BaseController = require('./BaseController');
class TagController extends BaseController {
  static async getById(req, res) {
    try {
      const result = await super.getById(req, 'Tag');
      res.status(200).send(result);
    } catch (error) {
      res.status(400).send(error);
    }
  }

  static async getList(req, res) {
    try {
      const result = await super.getList(req, 'Tag');
      res.status(200).send(result);
    } catch (error) {
      res.status(400).send(error);
    }
  }

  static async create(req, res) {
    try {
      const createdTag = await super.create(req, 'Tag');
      if (!createdTag) {
        res.status(500).send('Somethings went wrong, please contact our support');
      } else {
        res.status(200).send(createdTag);
      }
    } catch (error) {
      console.log(error);
      res.status(500).send('Somethings went wrong, please contact our support');
    }
  }

  static async updateById(req, res) {
    try {
      const result = await super.updateById(req, 'Tag', req.body);
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
      const result = await super.deleteById(req, 'Tag');
      res.send(200, result);
    } catch (err) {
      res.send(400, err);
    }
  }
}

module.exports = TagController;
