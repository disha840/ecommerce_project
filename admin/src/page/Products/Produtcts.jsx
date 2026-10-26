
import React, { useEffect, useState } from "react";
import AddProduct from "../../components/Products/AddProduct";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import DeleteProductModal from "../../components/Products/DeleteProduct";

const Product = () => {
  const [showModal, setShowModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [editPro, setEditProduct] = useState(false);
  const [productInfo, setProductInfo] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const navigate = useNavigate();

  async function getProducts() {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await api.get("/products/showproducts");

      const productList =
        response.data.products ||
        response.data.product ||
        response.data.data ||
        [];

      setProducts(Array.isArray(productList) ? productList : []);
    } catch (error) {
      console.log("Get products error:", error);

      setErrorMessage(
        error.response?.data?.message || "Failed to fetch products."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getProducts();
  }, []);

  function getName(value) {
    if (!value) return "-";

    if (typeof value === "object") {
      return value.name || "-";
    }

    return value;
  }

  const filteredProducts = products.filter((product) =>
    (product.name || "")
      .toLowerCase()
      .includes(search.toLowerCase().trim())
  );

  const activeProducts = products.filter(
    (product) => product.isActive === true
  ).length;

  const inactiveProducts = products.length - activeProducts;

  function viewHandler(id) {
    navigate(`/admin/viewproduct/${id}`);
  }

  return (
    <div className="min-h-screen bg-[#F0FAFC] p-6 text-[#102A43]">
      {/* Add Product Modal */}
      {showModal && (
        <AddProduct
          onClose={() => setShowModal(false)}
          onCreated={getProducts}
        />
      )}

      {/* Delete Product Modal */}
      {showDelete && (
        <DeleteProductModal
          productId={deleteId}
          onClose={() => {
            setShowDelete(false);
            setDeleteId(null);
          }}
          onDeleted={getProducts}
        />
      )}

      {/* Edit Product Modal */}
      {editPro && (
        <AddProduct
          onClose={() => setEditProduct(false)}
          product={productInfo}
          onCreated={async () => {
            await getProducts();
            setEditProduct(false);
            setProductInfo(null);
          }}
        />
      )}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <p className="mt-1 text-sm text-[#627D98]">
          Manage all your store products
        </p>
      </div>

      {/* Statistics */}
      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {[
          { title: "Total Products", count: products.length },
          { title: "Active Products", count: activeProducts },
          { title: "Inactive Products", count: inactiveProducts },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-[#D9E8EF] bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-[#627D98]">{item.title}</p>
            <h2 className="mt-2 text-3xl font-bold">{item.count}</h2>
          </div>
        ))}
      </div>

      {/* Search and Add */}
      <div className="mb-5 flex flex-col items-stretch justify-between gap-4 rounded-2xl border border-[#D9E8EF] bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search product by name..."
          className="w-full max-w-md rounded-xl border border-[#D9E8EF] bg-[#F8FCFD] px-4 py-3 text-sm outline-none focus:border-[#22B8CF] focus:ring-2 focus:ring-[#D7F2F6]"
        />

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="rounded-xl bg-[#087F95] px-5 py-3 text-sm font-medium text-white hover:bg-[#066779]"
        >
          + Add Product
        </button>
      </div>

      {/* Product Table */}
      <div className="overflow-hidden rounded-2xl border border-[#D9E8EF] bg-white shadow-sm">
        <div className="border-b border-[#D9E8EF] p-5">
          <h2 className="text-lg font-semibold">All Products</h2>
          <p className="mt-1 text-sm text-[#627D98]">
            {filteredProducts.length} product(s) found
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#EAF7FA]">
              <tr>
                {[
                  "S.No",
                  "Product",
                  "Category",
                  "Subcategory",
                  "Brand",
                  "Unit",
                  "Featured",
                  "Status",
                  "Rating",
                  "Action",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="whitespace-nowrap px-5 py-4 font-semibold"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="10"
                    className="px-5 py-16 text-center text-[#627D98]"
                  >
                    Loading products...
                  </td>
                </tr>
              ) : errorMessage ? (
                <tr>
                  <td colSpan="10" className="px-5 py-12 text-center">
                    <p className="mb-4 text-[#087F95]">{errorMessage}</p>

                    <button
                      type="button"
                      onClick={getProducts}
                      className="rounded-lg bg-[#087F95] px-4 py-2 text-white hover:bg-[#066779]"
                    >
                      Try Again
                    </button>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="10" className="px-5 py-16 text-center">
                    <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D7F2F6] text-3xl">
                      📦
                    </div>

                    <h3 className="font-semibold">
                      {search ? "No Matching Products" : "No Products Found"}
                    </h3>

                    <p className="mt-1 text-sm text-[#627D98]">
                      {search
                        ? "Try another product name."
                        : "Add your first product to get started."}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product, index) => (
                  <tr
                    key={product._id || index}
                    className="border-t border-[#D9E8EF] hover:bg-[#F8FCFD]"
                  >
                    <td className="whitespace-nowrap px-5 py-4">
                      {index + 1}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 font-medium">
                      {product.name || "-"}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      {getName(product.category)}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      {getName(product.subcategory)}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      {getName(product.brand)}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      {product.unit || "-"}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          product.isFeatured
                            ? "bg-[#D7F2F6] text-[#087F95]"
                            : "bg-[#F0FAFC] text-[#627D98]"
                        }`}
                      >
                        {product.isFeatured ? "Yes" : "No"}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          product.isActive
                            ? "bg-[#D7F2F6] text-[#087F95]"
                            : "bg-[#EAF7FA] text-[#627D98]"
                        }`}
                      >
                        {product.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      <span className="text-[#087F95]">★</span>{" "}
                      {product.rating ?? 0}
                    </td>

                    {/* Action Buttons */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="rounded-lg border border-[#D9E8EF] px-3 py-2 text-xs text-[#087F95] hover:bg-[#D7F2F6]"
                          onClick={() => viewHandler(product._id)}
                        >
                          View
                        </button>

                        <button
                          type="button"
                          className="rounded-lg bg-[#EAF7FA] px-3 py-2 text-xs text-[#087F95] hover:bg-[#D7F2F6]"
                          onClick={() => {
                            setEditProduct(true);
                            setProductInfo(product);
                          }}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="rounded-lg bg-[#D7F2F6] px-3 py-2 text-xs text-[#087F95] hover:bg-[#BCEAF0]"
                          onClick={() => {
                            setShowDelete(true);
                            setDeleteId(product._id);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Product;
