import { useEffect, useState } from "react";
import { axiosInstance, useAxiosLoader } from "../../Axios/AxiosConfig";
import { toast } from "react-toastify";
import { useNavigate, useParams, Link } from "react-router-dom";
import ImageUploade from "../ImageUploader";
import validateFields from "../../Config/Validation";

const AddBrands = () => {
  const { id } = useParams();
  const [imageUrl, setImageUrl] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isloading] = useAxiosLoader();

  const navigate = useNavigate();

  const handleImageUrlChange = (newImageUrl) => {
    setImageUrl(newImageUrl);
  };

  useEffect(() => {
    if (id) {
      axiosInstance
        .get(`/api/v1/brands/find-by-id/${id}`)
        .then((res) => {
          setName(res.data.name);
          setDescription(res.data.description);
        })
        .catch((err) => {
          if (err.message) {
            toast.error(err.message);
          } else {
            toast.error(err.response.data.message);
          }
        });
    }
  }, []);

  // Submit Form Data
  const handleSubmit = (e) => {
    e.preventDefault();
    const brand = {
      name,
      description,
      imageUrl,
    };

    const isFormValid = validateFields(brand, [
      {
        condition: () => imageUrl.length > 0,
        errorMessage: "Please upload at least one image",
      },
    ]);
    if (isFormValid === false) {
      return;
    }
    axiosInstance
      .post("/api/v1/brands/create", brand)
      .then((res) => {
        navigate("/dashboard/brands");
        toast.success(res.data.message);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const brand = {
      name,
      description,
      imageUrl,
    };

    axiosInstance
      .put(`/api/v1/brands/update/${id}`, brand)
      .then((res) => {
        navigate("/dashboard/brands");
        toast.success(res.data.message);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  return (
    <div className="card shadow" style={{ marginTop: "-530px" }}>
      <div className="card-header py-3 d-sm-flex align-items-center justify-content-between">
      <Link to="/dashboard/brands"><i className="fas fa-arrow-left"></i> </Link>
        <h6 className="m-0 font-weight-bold text-primary">
          {id ? "Update Brand" : "Add new Brand"}
        </h6>
        <div>{""}</div>
      </div>
      <div className="card-body">
        <div>
          <form>
            <div className="row mb-4">
              <div className="col">
                <div data-mdb-input-init className="form-outline">
                  <label className="form-label" htmlFor="form6Example1">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    id="form6Example1"
                    className="form-control"
                    value={name ? name : ""}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="row mb-4">
              <div className="col">
                <div data-mdb-input-init className="form-outline">
                  <label className="form-label" htmlFor="form6Example6">
                    Description
                  </label>
                  <input
                    type="email"
                    id="form6Example6"
                    className="form-control"
                    value={description ? description : ""}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <label className="form-label" htmlFor="form6Example6">
                  Add Brand Image
                </label>
                <div data-mdb-input-init className="form-outline mb-4">
                  <ImageUploade onImageUrlChange={handleImageUrlChange} />
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
                "Save Brand"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBrands;
