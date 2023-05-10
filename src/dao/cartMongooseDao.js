import { cartModel } from "../model/cart.model.js";

class CartMongooseDao {
  async createCart(cart) {
    const document = await cartModel.create({ products: cart });

    return {
      id: document._id,
      products: document.products.map((product) => ({
        product: product.id,
        quantity: product.quantity,
      })),
    };
  }

  async findCartById(cid) {
    const document = await cartModel
      .findOne({ _id: cid })
      .populate("products._id");
    if (!document) return null;

    return {
      id: document._id,
      products: document.products,
    };
  }

  async updateCart(idCart, idProduct) {
    let document = await cartModel.findOneAndUpdate(
      { _id: idCart, "products._id": idProduct },
      { $inc: { "products.$.quantity": 1 } },
      { new: true }
    );

    if (!document) {
      document = await cartModel.findOneAndUpdate(
        { _id: idCart },
        { $push: { products: { _id: idProduct, quantity: 1 } } },
        { new: true }
      );
    }

    if (!document) return null;

    return {
      id: document._id,
      products: document.products.map((product) => ({
        product: product._id,
        quantity: product.quantity,
      })),
    };
  }

  async deleteProduct(cid, pid) {
    const document = await cartModel.findByIdAndUpdate(
      { _id: cid },
      { $pull: { products: { _id: pid } } },
      { new: true }
    );
    if (!document) return null;

    return {
      id: document._id,
      products: document.products.map((product) => ({
        product: product._id,
        quantity: product.quantity,
      })),
    };
  }

  async deleteAllProducts(id) {
    const document = await cartModel.findByIdAndUpdate(
      { _id: id },
      { $set: { products: [] } },
      { new: true }
    );

    if (!document) return null;

    return {
      id: document._id,
      products: document.products,
    };
  }

  async changeProducts(cid, data) {
    const document = await cartModel.findOneAndUpdate(
      { _id: cid },
      { $set: { products: data } },
      { new: true }
    );

    if (!document) return null;

    return {
      id: document._id,
      products: document.products.map((product) => ({
        product: product._id,
        quantity: product.quantity,
      })),
    };
  }

  async newQuantity(cid, pid, quantity) {
    const document = await cartModel.findOneAndUpdate(
      { _id: cid, "products._id": pid },
      { $set: { "products.$.quantity": quantity } },
      { new: true }
    );

    if (!document) return null;

    return {
      id: document._id,
      products: document.products.map((product) => ({
        product: product._id,
        quantity: product.quantity,
      })),
    };
  }
}

export default CartMongooseDao;
