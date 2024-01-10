import { useEffect, useState } from "react";
import { axiosInstance, useAxiosLoader } from "../../Axios/AxiosConfig";
import { toast } from "react-toastify";
import { useNavigate, useParams, Link } from "react-router-dom";
import ImageUploader from "../ImageUploader";
import { useQuill } from "react-quilljs";
import "react-quill/dist/quill.snow.css";
import validateFields from "../../Config/Validation";

const AddProducts = () => {
  const { id } = useParams();
  const [category, selectCategory] = useState("");
  const [categoryName, setCategoryName] = useState([]);
  const [brandName, setBrandName] = useState([]);
  const [brand, setBrand] = useState("");
  const [name, ProductName] = useState("");
  const [qtyOnHand, setQty] = useState(0);
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const { quill, quillRef } = useQuill();
  const [isloading] = useAxiosLoader();
  const [imageUrls, setImageUrl] = useState([]);

  const handleImageUrlChange = (newImageUrl) => {
    setImageUrl((prev) => [
      ...prev,
      {
        url: newImageUrl,
        altText: "Product Image",
      },
    ]);
  };

  useEffect(() => {
    if (id) {
      axiosInstance
        .get(`/api/v1/products/find-by-id/${id}`)
        .then((res) => {
          selectCategory(res.data.category);
          setBrand(res.data.brand);
          ProductName(res.data.name);
          setQty(res.data.qtyOnHand);
          setPrice(res.data.price);
          setDescription(res.data.description);
          setImageUrl(res.data.imageUrls);
        })
        .catch((err) => {
          if (err.message) {
            toast.error(err.message);
          } else {
            toast.error(err.response.data.message);
          }
        });
    }

    getCategories();
    getBrand();
  }, [id]);

  useEffect(() => {
    if (quill) {
      if (quill.root.innerHTML !== description) {
        const range = quill.getSelection();
        quill.clipboard.dangerouslyPasteHTML(description);

        if (range) {
          quill.setSelection(range);
        }
      }

      const handleTextChange = () => {
        setDescription(quill.root.innerHTML);
      };

      quill.on("text-change", handleTextChange);

      return () => {
        quill.off("text-change", handleTextChange);
      };
    }
  }, [quill, description]);

  const getCategories = () => {
    axiosInstance
      .get("/api/v1/categories/find-all")
      .then((res) => {
        setCategoryName(res.data);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const getBrand = () => {
    axiosInstance
      .get("/api/v1/brands/find-all")
      .then((res) => {
        setBrandName(res.data);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const navigate = useNavigate();

  const product = {
    category,
    brand,
    name,
    qtyOnHand,
    price,
    description,
    imageUrls,
  };

  // Submit Form Data
  const handleSubmit = (e) => {
    e.preventDefault();
    const isFormValid = validateFields(product, [
      {
        condition: () => imageUrls.length > 0,
        errorMessage: "Please upload atleast one image",
      },
    ]);

    if (isFormValid === false) {
      return;
    }
    axiosInstance
      .post("/api/v1/products/create", product)
      .then((res) => {
        toast.success(res.data.message);
        navigate("/dashboard/products");
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    axiosInstance
      .put(`/api/v1/products/update/${id}`, product)
      .then((res) => {
        toast.success(res.data.message);
        navigate("/dashboard/products");
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  return (
    <div className="card shadow">
      <div className="card-header py-3 d-sm-flex align-items-center justify-content-between">
      <Link to="/dashboard/products"><i className="fas fa-arrow-left"></i> </Link>
        <h6 className="m-0 font-weight-bold text-primary">
          {id ? "Update Product" : "Add new Product"}
        </h6>
      <div>{""}</div>
      </div>
      <div className="card-body">
        <div>
          <form>
            <div className="row mb-4">
              <div className="col">
                <label className="form-label" htmlFor="form6Example7">
                  Select Category
                </label>
                <select
                  className="form-control"
                  id="form6Example7"
                  value={category}
                  onChange={(e) => selectCategory(e.target.value)}
                >
                  <option>Choose your option</option>
                  {categoryName.map((category, index) => (
                    <option key={index} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col">
                <div data-mdb-input-init className="form-outline">
                  <label className="form-label" htmlFor="form6Example7">
                    Select Brand
                  </label>
                  <select
                    className="form-control"
                    id="form6Example7"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                  >
                    <option>Choose your option</option>
                    {brandName.map((brand, index) => (
                      <option key={index} value={brand.name}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="row mb-4">
              <div className="col">
                <div data-mdb-input-init className="form-outline">
                  <label className="form-label" htmlFor="form6Example6">
                    Product Name
                  </label>
                  <input
                    type="text"
                    id="form6Example6"
                    className="form-control"
                    value={name}
                    onChange={(e) => ProductName(e.target.value)}
                  />
                </div>
              </div>
              <div className="col">
                <div data-mdb-input-init className="form-outline">
                  <label className="form-label" htmlFor="form6Example7">
                    Quantity on Hand
                  </label>
                  <input
                    type="number"
                    id="form6Example7"
                    className="form-control"
                    value={qtyOnHand}
                    onChange={(e) => setQty(e.target.value)}
                  />
                </div>
              </div>
              <div className="col">
                <div data-mdb-input-init className="form-outline">
                  <label className="form-label" htmlFor="form6Example">
                    Product Price
                  </label>
                  <input
                    type="number"
                    id="form6Example"
                    className="form-control"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="row mb-5">
              <div className="col">
                <label className="form-label" htmlFor="form6Example7">
                  Product Description (This description will appear on the
                  product page)
                </label>
                <div style={{ width: "100%", height: 200 }}>
                  <div ref={quillRef} />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12 mt-3 mb-4">
                <label className="form-label" htmlFor="form6Example6">
                  Add Product Images (You can add multiple images)
                </label>

                <div>
                  <ImageUploader onImageUrlChange={handleImageUrlChange} />
                </div>
              </div>
            </div>
            <button
              data-mdb-ripple-init
              type="button"
              className={
                isloading
                  ? "btn btn-primary btn-block disabled"
                  : "btn btn-primary btn-block"
              }
              onClick={id ? (e) => handleUpdate(e) : (e) => handleSubmit(e)}
            >
              {isloading ? (
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                "Save Product"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProducts;
