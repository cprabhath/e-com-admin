import { useEffect, useState } from "react";
import { axiosInstance, useAxiosLoader } from "../../Axios/AxiosConfig";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import ImageUploader from "../ImageUploader";
import validateFields from "../../Config/Validation";

const AddUser = () => {
  const { id } = useParams();
  const [role, setRole] = useState("");
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassowrd, setConfirmPassword] = useState("");
  const [mobileNumber, setMobile] = useState(0);
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [isloading] = useAxiosLoader();
  const [imageUrl, setImageUrl] = useState("");
  const [isRoleEnabled, setIsRoleEnabled] = useState(false);
  const navigate = useNavigate();

  const handleImageUrlChange = (newImageUrl) => {
    setImageUrl(newImageUrl);
  };
  useEffect(() => {
    getSettings();
    if (id) {
      axiosInstance
        .get(`/api/v1/users/find-one/${id}`)
        .then((res) => {
          console.log(res.data.message);
          const data = res.data.message;
          const fullName = res.data.message.fullName;
          const parts = fullName.split(" ");
          setfirstName(parts[0]);
          setlastName(parts.slice(1).join(" "));
          setRole(data.role);
          setEmail(data.email);
          setMobile(data.mobileNumber);
          setAddress(data.address);
          setGender(data.gender)
          if (imageUrl == "") {
            setImageUrl(data.imageUrl);
          }
        })
        .catch((err) => {
          toast.error(err.response.data.message);
        });
    }
  }, []);

  const getSettings = () => {
    axiosInstance
      .get("/api/v1/settings/find-all")
      .then((res) => {
        if (res.data.message.length > 0) {
          setIsRoleEnabled(res.data.message[0].isRoleBasedAccess);
        } else {
          setIsRoleEnabled(false);
          toast.error("No settings found. Please configure settings");
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const fullName = firstName + " " + lastName;
  const user = {
    fullName,
    email,
    password,
    role,
    mobileNumber,
    address,
    gender,
  };

  // Submit Form Data
  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validateFields(user, [
      {
        condition: () => password === confirmPassowrd,
        errorMessage: "Password and Confirm Password should be same",
      },
      {
        condition: () => role !== "",
        errorMessage: "Please select user type",
      },
      {
        condition: () => gender !== "",
        errorMessage: "Please select gender",
      }
    ]);

    if (isValid) {
      axiosInstance.post("/api/v1/users/register", user).then((res) => {
        toast.success(res.data.message);
        navigate("/dashboard/users");
      }
      ).catch((err) => {
        toast.error(err.response.data.message);
      });
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    axiosInstance
      .put(`/api/v1/users/update/${id}`, user)
      .then((res) => {
        navigate("/dashboard/users");
        toast.success(res.data.message);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  return (
    <div className="card shadow">
      <div className="card-header py-3 d-sm-flex align-items-center justify-content-between">
        <h6 className="m-0 font-weight-bold text-primary">
          {id ? `Update ${firstName + " " + lastName}` : "Add new user"}
        </h6>
      </div>
      <div className="card-body">
        <div>
          <form>
            <div className="row mb-4">
              <div className="col">
                <div data-mdb-input-init className="form-outline">
                  <label className="form-label" htmlFor="form6Example1">
                    First name
                  </label>
                  <input
                    type="text"
                    id="form6Example1"
                    className="form-control"
                    value={firstName ? firstName : ""}
                    onChange={(e) => setfirstName(e.target.value)}
                  />
                </div>
              </div>
              <div className="col">
                <div data-mdb-input-init className="form-outline">
                  <label className="form-label" htmlFor="form6Example2">
                    Last name
                  </label>
                  <input
                    type="text"
                    id="form6Example2"
                    className="form-control"
                    value={lastName ? lastName : ""}
                    onChange={(e) => setlastName(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="row mb-4">
              <div className="col">
                <div data-mdb-input-init className="form-outline">
                  <label className="form-label" htmlFor="form6Example6">
                    Email
                  </label>
                  <input
                    type="email"
                    id="form6Example6"
                    className="form-control"
                    value={email ? email : ""}
                    disabled={id ? true : false}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="col">
                <div data-mdb-input-init className="form-outline">
                  <label className="form-label" htmlFor="form6Example7">
                    Select User Type (you can enable or disable this feature in
                    settings page)
                  </label>
                  <select
                    className="form-control"
                    id="form6Example7"
                    value={role ? role : ""}
                    onChange={(e) => setRole(e.target.value)}
                    disabled={isRoleEnabled ? false : true}
                  >
                    <option>Select User Type</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="row mb-4">
              <div className="col">
                <div data-mdb-input-init className="form-outline">
                  <label className="form-label" htmlFor="form6Example8">
                    Password
                  </label>
                  <input
                    type="password"
                    id="form6Example8"
                    className="form-control"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <div className="col">
                <div data-mdb-input-init className="form-outline">
                  <label className="form-label" htmlFor="form6Example9">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="form6Example9"
                    className="form-control"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className={role == "admin" ? "visually-hidden" : ""}>
              <div className="row mb-4">
                <div className="col">
                  <div data-mdb-input-init className="form-outline">
                    <label className="form-label" htmlFor="form6Example8">
                      Gender
                    </label>
                    <select
                      className="form-control"
                      id="form6Example7"
                      value={gender ? gender : ""}
                      onChange={(e) => setGender(e.target.value)}
                    >
                      <option>Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>
                <div className="col">
                  <div data-mdb-input-init className="form-outline">
                    <label className="form-label" htmlFor="form6Example9">
                      Mobile Number
                    </label>
                    <input
                      type="number"
                      id="form6Example9"
                      className="form-control"
                      value={mobileNumber ? mobileNumber : ""}
                      onChange={(e) => setMobile(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="row mb-4">
                <div className="col-12">
                  <label className="form-label" htmlFor="form6Example6">
                    Address
                  </label>
                  <textarea
                    value={address ? address : ""}
                    onChange={(e) => setAddress(e.target.value)}
                    className="form-control"
                    id="form4Example3"
                    rows="4"
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <label className="form-label" htmlFor="form6Example6">
                  Add User Image
                </label>
                <div data-mdb-input-init className="form-outline mb-4">
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
                "Save User"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
