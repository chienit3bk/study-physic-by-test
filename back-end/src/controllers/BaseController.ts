import type { Request } from 'express';
import type {
  Model,
  ModelStatic,
  FindOptions,
  WhereOptions,
  CreationAttributes,
} from 'sequelize';
import type { Db, ModelName } from '../models';

/** Resolve a model class from the typed db registry bound to the app. */
export function getModel(req: Request, modelName: ModelName): ModelStatic<Model> {
  const db = req.app.get('db') as Db;
  return db[modelName] as unknown as ModelStatic<Model>;
}

const DEFAULT_LIMIT = 12;

/** Normalise an :id route param (Express 5 may type it as string | string[]). */
function idParam(req: Request): string {
  const { id } = req.params;
  return Array.isArray(id) ? String(id[0]) : String(id);
}

/**
 * Generic, strongly-typed CRUD helpers shared by every resource controller.
 * Replaces the old `extends BaseController` + `super.*` pattern, which clashed
 * with controller methods of the same name under strict TypeScript.
 */
export const crud = {
  getById(req: Request, modelName: ModelName): Promise<Model | null> {
    return getModel(req, modelName).findByPk(idParam(req));
  },

  getByCustomOptions(req: Request, modelName: ModelName, options: FindOptions): Promise<Model | null> {
    return getModel(req, modelName).findOne(options);
  },

  deleteById(req: Request, modelName: ModelName): Promise<number> {
    return getModel(req, modelName).destroy({ where: { id: idParam(req) } as WhereOptions });
  },

  create(req: Request, modelName: ModelName, data?: Record<string, unknown>): Promise<Model> {
    const payload = (data ?? req.body) as CreationAttributes<Model>;
    return getModel(req, modelName).create(payload);
  },

  updateById(
    req: Request,
    modelName: ModelName,
    data: Record<string, unknown>,
  ): Promise<[affectedCount: number]> {
    return getModel(req, modelName).update(data, { where: { id: idParam(req) } as WhereOptions });
  },

  updateByCustomWhere(
    req: Request,
    modelName: ModelName,
    data: Record<string, unknown>,
    where: WhereOptions,
  ): Promise<[affectedCount: number]> {
    return getModel(req, modelName).update(data, { where });
  },

  getList(req: Request, modelName: ModelName, options: FindOptions = {}): Promise<Model[]> {
    const page = Number(req.query.page);
    let opts: FindOptions = { ...options };
    if (Number.isInteger(page) && page > 0) {
      opts = { ...opts, offset: DEFAULT_LIMIT * (page - 1), limit: DEFAULT_LIMIT };
    }
    return getModel(req, modelName).findAll(opts);
  },
};

export default crud;
