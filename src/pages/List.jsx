import axios from "axios";
import React, { useEffect, useState } from "react";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // States for edit form
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editCategory, setEditCategory] = useState("Men");
  const [editSubCategory, setEditSubCategory] = useState("Topwear");
  const [editBestseller, setEditBestseller] = useState(false);
  const [editSizes, setEditSizes] = useState([]);
  const [editImage1, setEditImage1] = useState(null);
  const [editImage2, setEditImage2] = useState(null);
  const [editImage3, setEditImage3] = useState(null);
  const [editImage4, setEditImage4] = useState(null);

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");

      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/product/remove",
        { id },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const startEdit = (product) => {
    setEditingProduct(product);
    setEditName(product.name);
    setEditDescription(product.description);
    setEditPrice(product.price);
    setEditCategory(product.category);
    setEditSubCategory(product.subCategory);
    setEditBestseller(product.bestseller);
    setEditSizes(product.sizes);
    // Assuming images are URLs, set to null for re-upload
    setEditImage1(null);
    setEditImage2(null);
    setEditImage3(null);
    setEditImage4(null);
    setShowEditModal(true);
  };

  const cancelEdit = () => {
    setShowEditModal(false);
    setEditingProduct(null);
  };

  const onEditSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("id", editingProduct._id);
      formData.append("name", editName);
      formData.append("description", editDescription);
      formData.append("price", editPrice);
      formData.append("category", editCategory);
      formData.append("subCategory", editSubCategory);
      formData.append("bestseller", editBestseller);
      formData.append("sizes", JSON.stringify(editSizes));

      editImage1 && formData.append("image1", editImage1);
      editImage2 && formData.append("image2", editImage2);
      editImage3 && formData.append("image3", editImage3);
      editImage4 && formData.append("image4", editImage4);

      const response = await axios.post(
        backendUrl + "/api/product/update", // Assuming update endpoint exists
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        fetchList();
        cancelEdit();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <p className="mb-2">All Products List</p>
      <div className="flex flex-col gap-2">
        {/* List Table Title */}
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className="text-center">Action</b>
        </div>
        {/* Product List */}
        {list.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm"
          >
            <img className="w-12" src={item.image[0]} alt="product-image" />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>
              {currency}
              {item.price}
            </p>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => startEdit(item)}
                className="text-blue-500 hover:text-blue-700"
              >
                Edit
              </button>
              <p
                onClick={() => removeProduct(item._id)}
                className="cursor-pointer text-lg text-red-500 hover:text-red-700"
              >
                X
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl mb-4">Edit Product</h2>
            <form onSubmit={onEditSubmitHandler} className="flex flex-col gap-3">
              {/* Upload Images */}
              <div>
                <p className="mb-2">Upload Image</p>
                <div className="flex gap-2">
                  <label className="cursor-pointer" htmlFor="editImage1">
                    <img
                      className="w-20"
                      src={
                        !editImage1
                          ? editingProduct.image[0] || "default-upload-area"
                          : URL.createObjectURL(editImage1)
                      }
                      alt="upload_area"
                    />
                    <input
                      onChange={(e) => setEditImage1(e.target.files[0])}
                      type="file"
                      id="editImage1"
                      hidden
                    />
                  </label>
                  {/* Repeat for image2, image3, image4 */}
                  <label className="cursor-pointer" htmlFor="editImage2">
                    <img
                      className="w-20"
                      src={
                        !editImage2
                          ? editingProduct.image[1] || "default-upload-area"
                          : URL.createObjectURL(editImage2)
                      }
                      alt="upload_area"
                    />
                    <input
                      onChange={(e) => setEditImage2(e.target.files[0])}
                      type="file"
                      id="editImage2"
                      hidden
                    />
                  </label>
                  <label className="cursor-pointer" htmlFor="editImage3">
                    <img
                      className="w-20"
                      src={
                        !editImage3
                          ? editingProduct.image[2] || "default-upload-area"
                          : URL.createObjectURL(editImage3)
                      }
                      alt="upload_area"
                    />
                    <input
                      onChange={(e) => setEditImage3(e.target.files[0])}
                      type="file"
                      id="editImage3"
                      hidden
                    />
                  </label>
                  <label className="cursor-pointer" htmlFor="editImage4">
                    <img
                      className="w-20"
                      src={
                        !editImage4
                          ? editingProduct.image[3] || "default-upload-area"
                          : URL.createObjectURL(editImage4)
                      }
                      alt="upload_area"
                    />
                    <input
                      onChange={(e) => setEditImage4(e.target.files[0])}
                      type="file"
                      id="editImage4"
                      hidden
                    />
                  </label>
                </div>
              </div>

              {/* Product Name */}
              <div className="w-full">
                <p className="mb-2">Product Name</p>
                <input
                  className="w-full max-w-[500px] px-3 py-2"
                  type="text"
                  placeholder="Type Here"
                  onChange={(e) => setEditName(e.target.value)}
                  value={editName}
                  required
                />
              </div>

              {/* Product Description */}
              <div className="w-full">
                <p className="mb-2">Product Description</p>
                <textarea
                  className="w-full max-w-[500px] px-3 py-2"
                  placeholder="Add Product Description"
                  onChange={(e) => setEditDescription(e.target.value)}
                  value={editDescription}
                  required
                />
              </div>

              {/* Category, SubCategory, Price */}
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
                <div>
                  <p className="mb-2">Product Category</p>
                  <select
                    onChange={(e) => setEditCategory(e.target.value)}
                    value={editCategory}
                    className="w-full px-3 py-2"
                  >
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Kids">Kids</option>
                  </select>
                </div>
                <div>
                  <p className="mb-2">Sub Category</p>
                  <select
                    onChange={(e) => setEditSubCategory(e.target.value)}
                    value={editSubCategory}
                    className="w-full px-3 py-2"
                  >
                    <option value="Topwear">Topwear</option>
                    <option value="Bottomwear">Bottomwear</option>
                    <option value="Winterwear">Winterwear</option>
                  </select>
                </div>
                <div>
                  <p className="mb-2">Product Price</p>
                  <input
                    className="w-full px-3 py-2 sm:w-[120px]"
                    type="number"
                    placeholder="25"
                    onChange={(e) => setEditPrice(e.target.value)}
                    value={editPrice}
                    required
                  />
                </div>
              </div>

              {/* Sizes */}
              <div>
                <p className="mb-2">Product Sizes</p>
                <div className="flex gap-3">
                  {["S", "M", "L", "XL", "XXL"].map((size) => (
                    <div
                      key={size}
                      onClick={() =>
                        setEditSizes((prev) =>
                          prev.includes(size)
                            ? prev.filter((item) => item !== size)
                            : [...prev, size]
                        )
                      }
                    >
                      <p
                        className={`${
                          editSizes.includes(size)
                            ? "bg-pink-100"
                            : "bg-slate-200"
                        } px-3 py-1 cursor-pointer`}
                      >
                        {size}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bestseller */}
              <div className="flex gap-2 mt-2">
                <input
                  onChange={() => setEditBestseller((prev) => !prev)}
                  checked={editBestseller}
                  type="checkbox"
                  id="editBestseller"
                />
                <label className="cursor-pointer" htmlFor="editBestseller">
                  Add to bestseller
                </label>
              </div>

              {/* Buttons */}
              <div className="flex gap-2">
                <button
                  className="w-28 py-3 bg-black text-white"
                  type="submit"
                >
                  UPDATE
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="w-28 py-3 bg-gray-500 text-white"
                >
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default List;
