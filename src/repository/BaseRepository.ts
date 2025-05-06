import { Document, FilterQuery, Model } from "mongoose";

abstract class BaseRepository<T extends Document> {
  protected model: Model<T>;
  constructor(model: Model<T>) {
    this.model = model;
  }

  async find(query: FilterQuery<T> = {}): Promise<T[]> {
    return this.model.find(query).exec();
  }

  async findOne(query: FilterQuery<T> = {}): Promise<T | null> {
    return this.model.findOne(query).exec();
  }

  async paginatedFind(query: FilterQuery<T> = {}, page: number = 1, perPage: number = 20): Promise<T[]> {
    const prevPage = page >= 1 ? page - 1 : 0;
    return this.model
      .find(query)
      .skip(perPage * prevPage)
      .limit(perPage)
      .exec();
  }

  async countDocuments(query: FilterQuery<T> = {}): Promise<number> {
    return this.model.countDocuments(query);
  }

  async create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }

  async findOneAndDelete(query: FilterQuery<T> = {}): Promise<T | null> {
    return this.model.findOneAndDelete(query).exec();
  }
}

export default BaseRepository;
