const BaseController = require('./BaseController');
class DocumentController extends BaseController {
  static async getById(req, res) {
    try {
      const { Document, Tag } = req.app.get('db');
      const result = await Document.findOne({
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
      const result = await super.getList(req, 'Document', {
        include: req.app.get('db').Tag,
      });
      res.status(200).send(result);
    } catch (error) {
      res.status(400).send(error);
    }
  }

  static async create(req, res) {
    try {
      const createdDocument = await super.create(req, 'Document');
      if (!createdDocument) {
        res.status(500).send('Somethings went wrong, please contact our support');
      } else {
        await DocumentController.attachTags(req, createdDocument);
        res.status(200).send(createdDocument);
      }
    } catch (error) {
      console.log(error);
      res.status(500).send('Somethings went wrong, please contact our support');
    }
  }

  static async updateById(req, res) {
    try {
      const result = await super.updateById(req, 'Document', req.body);
      const document = await super.getById(req, 'Document');
      if (result && document) {
        res.status(200).send(result);
        await DocumentController.attachTags(req, document);
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
      const result = await super.deleteById(req, 'Document');
      res.send(200, result);
    } catch (err) {
      res.send(400, err);
    }
  }

  static async attachTags(req, document) {
    const { Tag } = req.app.get('db');
    const tagIds = req.body.tagIds;
    if (Array.isArray(tagIds)) {
      const tags = await Tag.findAll({
        where: {
          id: tagIds,
        },
      });

      document.setTags(tags);
    }
  }
}

module.exports = DocumentController;
