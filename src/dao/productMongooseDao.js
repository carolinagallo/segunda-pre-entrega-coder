import { productModel } from "../model/product.model.js";

class productMongooseDao {
  async find(limit, type, sort, stock) {
    const aggregation = [];

    if (type) {
      console.log("agregando type");
      aggregation.push({
        $match: {
          category: type,
        },
      });
    }
    aggregation.push({
      $sort: {
        price: sort,
      },
    });

    aggregation.push({
      $match: {
        stock: { $gte: stock },
      },
    });

    aggregation.push({
      $limit: limit,
    });

    const filtered = await productModel.aggregate(aggregation);

    console.log(filtered);

    return filtered.map((document) => ({
      id: document._id,
      title: document.title,
      description: document.description,
      price: document.price,
      thumbnail: document.thumbnail,
      code: document.code,
      stock: document.stock,
      category: document.category,
    }));
  }

  async create(product) {
    const document = await productModel.create(product);

    return {
      id: document._id,
      title: document.title,
      description: document.description,
      price: document.price,
      thumbnail: document.thumbnail,
      code: document.code,
      stock: document.stock,
      category: document.category,
    };
  }

  async getByCode(productCode) {
    const product = await productModel.findOne({ code: productCode });
    return product;
  }

  async getProductById(id) {
    const document = await productModel.findOne({ _id: id }).catch(() => {
      return null;
    });
    if (!document) return null;

    return {
      id: document._id,
      title: document.title,
      description: document.description,
      price: document.price,
      thumbnail: document.thumbnail,
      code: document.code,
      stock: document.stock,
      category: document.category,
    };
  }

  async updateProduct(id, data) {
    const document = await productModel.findOneAndUpdate({ _id: id }, data, {
      new: true,
    });

    if (!document) return null;

    return {
      id: document._id,
      title: document.title,
      description: document.description,
      price: document.price,
      thumbnail: document.thumbnail,
      code: document.code,
      stock: document.stock,
      category: document.category,
    };
  }

  async deleteProduct(id) {
    const document = await productModel.deleteOne({ _id: id });
    return {
      id: document._id,
      title: document.title,
      description: document.description,
      price: document.price,
      thumbnail: document.thumbnail,
      code: document.code,
      stock: document.stock,
      category: document.category,
    };
  }
}

export default productMongooseDao;
