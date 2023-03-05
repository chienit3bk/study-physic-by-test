const _ = require('lodash');
const BaseController = require('./BaseController');
class UserController extends BaseController {
  static async getUserById(req, res) {
    try {
      const result = await super.getById(req, 'User');
      res.status(200).send(_.pick(result, [
        'id',
        'name',
        'email',
        'phone',
        'address',
        'role',
        'level',
        'createdAt',
        'updatedAt',
      ]));
    } catch (error) {
      res.status(400).send(error);
    }
  };

  static async deleteById(req, res) {
    try {
      const result = await super.deleteById(req, 'User');
      res.send(200, result);
    } catch (err) {
      res.send(400, err);
    }
  };

  static async getList(req, res) {
    try {
      const result = await super.getList(req, 'User');
      res.status(200).send(result);
    } catch (error) {
      res.status(400).send(error);
    }
  };


  // static async getProfile(req, res) {
  // 	try {
  // 		const tokenFromHeader = auth.getJwtToken(req);
  // 		const user = jwt.decode(tokenFromHeader);
  // 		const options = {
  // 			where: { id: user.payload.id },
  // 		};
  // 		const userProfile = await super.getByCustomOptions(req, 'Users', options);
  // 		const profile = _.omit(userProfile.dataValues, ['createdAt', 'updatedAt', 'last_login_date', 'password']);
  // 		return requestHandler.sendSuccess(res, 'User Profile fetched Successfully')({ profile });
  // 	} catch (err) {
  // 		return requestHandler.sendError(req, res, err);
  // 	}
  // }
}

module.exports = UserController;
