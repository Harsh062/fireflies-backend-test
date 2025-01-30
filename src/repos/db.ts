export const db = {
  find: async (
    model: any,
    query: any,
    { page, limit }: { page: number; limit: number }
  ) => {
    return model
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit);
  },

  findById: async (model: any, id: string) => {
    return model.findById(id);
  },

  create: async (model: any, data: any) => {
    const doc = new model(data);
    return doc.save();
  },

  updateById: async (model: any, id: string, updateData: any) => {
    return model.findByIdAndUpdate(id, updateData, { new: true });
  },
};
