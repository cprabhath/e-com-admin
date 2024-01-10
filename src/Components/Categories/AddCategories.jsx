import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { axiosInstance, useAxiosLoader } from "../../Axios/AxiosConfig";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import validateFields from "../../Config/Validation";

const AddCategories = () => {
  const { id } = useParams();
  const [isloading] = useAxiosLoader();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      axiosInstance
        .get(`/api/v1/categories/find-by-id/${id}`)
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

  const handleUpdate = (e) => {
    e.preventDefault();
    axiosInstance
      .put(`/api/v1/categories/update/${id}`, { name, description })
      .then((res) => {
        navigate("/dashboard/categories");
        toast.success(res.data.message);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  // Submit Form Data
  const handleSubmit = (e) => {
    e.preventDefault();
    const category = {
      name,
      description,
    };
    const isFormValid = validateFields(category, [
      {
        condition: () => name.length > 0,
        errorMessage: "Please enter a valid name",
      },
      {
        condition: () => description.length > 0,
        errorMessage: "Please enter a valid description",
      },
    ]);

    if (isFormValid === false) {
      return;
    }
    axiosInstance
      .post("/api/v1/categories/create", category)
      .then((res) => {
        navigate("/dashboard/categories");
        toast.success(res.data.message);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  return (
    <div className="card shadow" style={{ marginTop: "-530px" }}>
      <div className="card-header py-3 d-sm-flex align-items-center justify-content-between">
      <Link to="/dashboard/categories"><i className="fas fa-arrow-left"></i> </Link>
        <h6 className="m-0 font-weight-bold text-primary">
          {id ? "Update Category" : "Add new Category"}
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
                    Category Name
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
                    type="text"
                    id="form6Example6"
                    className="form-control"
                    onChange={(e) => setDescription(e.target.value)}
                    value={description ? description : ""}
                  />
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
                "Save Category"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCategories;
