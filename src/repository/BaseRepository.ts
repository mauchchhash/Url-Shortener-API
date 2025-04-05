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
