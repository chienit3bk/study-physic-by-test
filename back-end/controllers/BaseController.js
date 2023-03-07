const _ = require('lodash');
class BaseController {
	constructor(options) {
		this.limit = 20;
		this.options = options;
	}

    /**
    * Get an element by it's id .
    *
    *
    * @return a Promise
	* @return an err if an error occur
    */
	static async getById(req, modelName) {
		const reqParam = req.params.id;
		let result;
		try {
			result = await req.app.get('db')[modelName].findByPk(reqParam);
		} catch (err) {
			return Promise.reject(err);
		}
		return result;
	}

	static async getByCustomOptions(req, modelName, options) {
		let result;
		try {
			result = await req.app.get('db')[modelName].findOne(options);
		} catch (err) {
			return Promise.reject(err);
		}
		return result;
	}

	static async deleteById(req, modelName) {
		const reqParam = req.params.id;
		let result;
		try {
			result = await req.app.get('db')[modelName].destroy({
				where: {
					id: reqParam,
				},
			});
		} catch (err) {
			return Promise.reject(err);
		}
		return result;
	}

	static async create(req, modelName, data) {
		let obj = data;
		if (_.isUndefined(obj)) {
			obj = req.body;
		}
		let result;
		try {
			result = await req.app.get('db')[modelName].build(obj).save().then(
				savedResource => Promise.resolve(savedResource),
			);
		} catch (err) {
			console.log(err);
			return Promise.reject(err);
		}
		return result;
	}


	static async updateById(req, modelName, data) {
		const recordID = req.params.id;
		let result;

		try {
			result = await req.app.get('db')[modelName]
				.update(data, {
					where: {
						id: recordID,
					},
				}).then(
					updatedRecored => Promise.resolve(updatedRecored),
				);
		} catch (err) {
			return Promise.reject(err);
		}
		return result;
	}

	static async updateByCustomWhere(req, modelName, data, options) {
		let result;

		try {
			result = await req.app.get('db')[modelName]
				.update(data, {
					where: options,
				}).then(
					updatedRecored => Promise.resolve(updatedRecored),
				);
		} catch (err) {
			return Promise.reject(err);
		}
		return result;
	}

	static async getList(req, modelName, options) {
		const page = req.query.page;
		let results;
		try {
			if (_.isUndefined(options)) {
				options = {};
			}

			if (parseInt(page, 10)) {
				if (page === 0) {
					options = _.extend({}, options, {});
				} else {
					options = _.extend({}, options, {
						offset: 12 * (page - 1),
						limit: 12,
					});
				}
			} else {
				options = _.extend({}, options, {}); // extend it so we can't mutate
			}

			results = await req.app.get('db')[modelName]
				.findAll(options)
				.then(result => Promise.resolve(result));
		} catch (err) {
			console.log(err)
			return Promise.reject(err);
		}
		return results;
	}
}
module.exports = BaseController;
