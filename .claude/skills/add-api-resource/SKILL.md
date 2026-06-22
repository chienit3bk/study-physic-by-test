---
name: add-api-resource
description: Scaffold a complete backend CRUD resource for study-physic-by-test — a typed Sequelize model, a migration, a controller using the shared crud helpers, an Express router, and its registration. Use when adding a new entity/table and REST endpoints to the back-end.
---

# Add a backend API resource

Backend lives in `back-end/` (TypeScript, Express 5, Sequelize 6, strict mode).
Follow the existing patterns exactly. Replace `Thing`/`things` with the real name.

## 1. Model — `src/models/thing.ts`
Use the `InferAttributes` pattern (see `src/models/tag.ts`):
```ts
import { Model, DataTypes, type InferAttributes, type InferCreationAttributes, type CreationOptional, type Sequelize } from 'sequelize';

export class Thing extends Model<InferAttributes<Thing>, InferCreationAttributes<Thing>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initThing(sequelize: Sequelize): typeof Thing {
  Thing.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, { sequelize, modelName: 'Thing', tableName: 'things' });
  return Thing;
}
```
Register it in `src/models/index.ts`: import + call `initThing(sequelize)`, add to the
`db` object, add `'Thing'` to the `ModelName` union, and add any associations.

## 2. Migration — `migrations/<timestamp>-create_things_table.js`
Migrations are CommonJS (run by sequelize-cli). Copy the shape of
`migrations/20230223160102-create_tags_table.js`. Use a real timestamp prefix
(`YYYYMMDDHHMMSS`). Include `createdAt`/`updatedAt` columns.

## 3. Controller — `src/controllers/ThingController.ts`
Do NOT extend a base class. Import the `crud` helper and `sendError`:
```ts
import type { Request, Response } from 'express';
import { crud } from './BaseController';
import { sendError } from '../utils/http';

export class ThingController {
  static async getById(req: Request, res: Response): Promise<void> {
    try { res.status(200).send(await crud.getById(req, 'Thing')); }
    catch (e) { sendError(res, e); }
  }
  static async getList(req: Request, res: Response): Promise<void> {
    try { res.status(200).send(await crud.getList(req, 'Thing')); }
    catch (e) { sendError(res, e); }
  }
  static async create(req: Request, res: Response): Promise<void> {
    try { res.status(200).send(await crud.create(req, 'Thing')); }
    catch (e) { sendError(res, e); }
  }
  static async updateById(req: Request, res: Response): Promise<void> {
    try { const r = await crud.updateById(req, 'Thing', req.body); res.status(200).send({ affected: r[0] }); }
    catch (e) { sendError(res, e); }
  }
  static async deleteById(req: Request, res: Response): Promise<void> {
    try { res.status(200).send({ deleted: await crud.deleteById(req, 'Thing') }); }
    catch (e) { sendError(res, e); }
  }
}
export default ThingController;
```

## 4. Router — `src/routes/api/thingRouter.ts`
Use plain `/:id` params (Express 5 forbids inline regex like `/:id([0-9])`):
```ts
import { Router } from 'express';
import { ThingController } from '../../controllers/ThingController';
const router = Router();
router.get('/:id', ThingController.getById);
router.get('/', ThingController.getList);
router.post('/', ThingController.create);
router.put('/:id', ThingController.updateById);
router.delete('/:id', ThingController.deleteById);
export default router;
```
Mount it in `src/routes/api/index.ts`: `router.use('/things', thingRouter);`
(API routes are behind JWT auth via `src/routes/index.ts`; add the `admin`
middleware for admin-only operations.)

## 5. Verify
```bash
cd back-end
npx tsc --noEmit          # must pass clean
npm run db:migrate        # apply the new migration (needs a running DB)
```
Add tests with the `test-writer` agent and review with `code-reviewer`.
