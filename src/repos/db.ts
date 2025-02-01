import {
  Model,
  FilterQuery,
  UpdateQuery,
  AnyKeys,
  ProjectionType,
  SortOrder,
} from "mongoose";

export const db = {
  // Find a single document matching the filter criteria
  findOne: <T>(model: Model<T>, filter: FilterQuery<T>) => {
    return model.findOne(filter);
  },

  // Find multiple documents with pagination and sorting
  find: async <T>(
    model: Model<T>,
    query: FilterQuery<T>,
    { page, limit }: { page: number; limit: number },
    sort: Record<string, SortOrder> = { date: -1 }
  ) => {
    return model
      .find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);
  },

  // Find a document by its ID
  findById: async <T>(model: Model<T>, id: string): Promise<T | null> => {
    return model.findById(id);
  },

  // Create a new document and save it to the database
  create: async <T>(model: Model<T>, data: T): Promise<T> => {
    const doc = new model(data);
    return doc.save();
  },

  // Update a document by its ID and return the updated version
  updateById: async <T>(
    model: Model<T>,
    id: string,
    updateData: UpdateQuery<T>
  ) => {
    return model.findByIdAndUpdate(id, updateData, { new: true });
  },

  // Find documents with a specific projection (select only required fields)
  findWithProjection: <T>(
    model: Model<T>,
    filter: FilterQuery<T>,
    projection: ProjectionType<T>
  ) => {
    return model.find(filter, projection);
  },

  // Count the number of documents that match the filter criteria
  countDocuments: <T>(model: Model<T>, filter: FilterQuery<T>) => {
    return model.countDocuments(filter);
  },

  // Update a single document matching the filter criteria
  updateOne: <T>(
    model: Model<T>,
    filter: FilterQuery<T>,
    update: UpdateQuery<T>
  ) => {
    return model.updateOne(filter, update, { new: true }); // `new: true` ensures the updated document is returned
  },

  // Insert multiple documents into the collection in bulk
  insertMany: <T>(model: Model<T>, documents: AnyKeys<T>[]) => {
    return model.insertMany(documents);
  },
};
