const { Op } = require('sequelize');
const { NotFoundError } = require('../utils/errors');

class BaseService {
  constructor(model) {
    this.model = model;
  }

  async findAll(options = {}) {
    const {
      where = {},
      include = [],
      order = [['created_at', 'DESC']],
      limit,
      offset,
      attributes
    } = options;

    where.deleted_at = { [Op.is]: null };

    return this.model.findAll({
      where,
      include,
      order,
      limit,
      offset,
      attributes
    });
  }

  async findById(id, options = {}) {
    const { include = [], attributes } = options;
    
    const record = await this.model.findByPk(id, {
      where: { deleted_at: { [Op.is]: null } },
      include,
      attributes
    });

    if (!record) {
      throw new NotFoundError(this.model.name);
    }

    return record;
  }

  async findOne(options = {}) {
    const { where = {}, include = [], attributes } = options;
    where.deleted_at = { [Op.is]: null };

    return this.model.findOne({
      where,
      include,
      attributes
    });
  }

  async create(data, options = {}) {
    return this.model.create(data, options);
  }

  async update(id, data, options = {}) {
    const record = await this.findById(id);
    await record.update(data, options);
    return record.reload();
  }

  async delete(id, options = {}) {
    const record = await this.findById(id);
    await record.update({ deleted_at: new Date() }, options);
    return record;
  }

  async count(options = {}) {
    const { where = {} } = options;
    where.deleted_at = { [Op.is]: null };

    return this.model.count({ where });
  }

  async paginate(page = 1, pageSize = 10, options = {}) {
    const offset = (page - 1) * pageSize;
    const limit = pageSize;

    const { where = {}, include = [], order = [['created_at', 'DESC']] } = options;
    where.deleted_at = { [Op.is]: null };

    const { count, rows } = await this.model.findAndCountAll({
      where,
      include,
      order,
      limit,
      offset
    });

    return {
      data: rows,
      pagination: {
        page,
        pageSize,
        total: count,
        totalPages: Math.ceil(count / pageSize)
      }
    };
  }
}

module.exports = BaseService;



