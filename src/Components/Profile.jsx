import { useEffect, useState } from "react";
import { axiosInstance, useAxiosLoader } from "../Axios/AxiosConfig";
import { toast } from "react-toastify";
import ImageUploader from "./ImageUploader";
import { useErrors } from "./ErrorContext";

const Profile = () => {
  const { addError } = useErrors();
  const [isloading] = useAxiosLoader();
  const [profile, setProfile] = useState([]);
  const [isEdit, setIsEdit] = useState("none");
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleImageUrlChange = (newImageUrl) => {
    setImageUrl(newImageUrl);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = () => {
    if (!profile) {
      addError("No Profile Found. Please logout and login again");
      toast.error("No Profile Found. Please logout and login again");
      return;
    }
    axiosInstance
      .get("/api/v1/admin/admin-find-all")
      .then((response) => {
        setProfile(response.data.message);
        setfirstName(response.data.message[0].fullName.split(" ")[0]);
        setlastName(
          response.data.message[0].fullName.split(" ").slice(1).join(" ")
        );

        if (imageUrl === "") {
          setImageUrl(response.data.message[0].imageUrl);
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const showEdit = (e) => {
    e.preventDefault();
    isEdit === "none" ? setIsEdit("") : setIsEdit("none");
  };

  const updateProfile = (e, id) => {
    e.preventDefault();

    if (password === "") {
      toast.error("Please enter your password to confirm your identity");
      return;
    }
    const user = {
      fullName: firstName + " " + lastName,
      password,
      imageUrl,
    };
    axiosInstance
      .put(`/api/v1/admin/update-admin/${id}`, user)
      .then((res) => {
        toast.success(
          res.data.message +
            " Your details will be updated in next time when you login"
        );
        fetchProfile();
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  return (
    <div className="card shadow">
      <div className="card-header py-3 d-sm-flex align-items-center justify-content-between">
        <h6 className="m-0 font-weight-bold text-primary">
          Administrator`s Profile
        </h6>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          {isloading ? (
            <div className="spinner-border text-primary" role="status"></div>
          ) : profile.length == 0 ? (
            ""
          ) : (
            profile.map((profile, index) => (
              <section key={index}>
                <div className="container py-5">
                  <div className="row">
                    <div className="col-lg-4">
                      <div className="card mb-4">
                        <div className="card-body text-center">
                          {isloading ? (
                            "loading"
                          ) : (
                            <img
                              src={profile.imageUrl}
                              alt="avatar"
                              className="rounded-circle img-fluid mb-4"
                              style={{ width: "150px" }}
                            />
                          )}
                          <div className="d-flex justify-content-center mb-3 mt-4">
                            <button
                              type="button"
                              onClick={(e) => showEdit(e)}
                              className="btn btn-primary"
                            >
                              Edit Profile
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-8">
                      <div className="card mb-4">
                        <div className="card-body">
                          <div className="row">
                            <div className="col-sm-3">
                              <p className="mb-0">Full Name</p>
                            </div>
                            <div className="col-sm-9">
                              <p className="text-muted mb-0">
                                {profile.fullName}
                              </p>
                            </div>
                          </div>
                          <hr />
                          <div className="row">
                            <div className="col-sm-3">
                              <p className="mb-0">Email</p>
                            </div>
                            <div className="col-sm-9">
                              <p className="text-muted mb-0">{profile.email}</p>
                            </div>
                          </div>
                          <hr />
                          <div className="row">
                            <div className="col-sm-3">
                              <p className="mb-0">Email verified</p>
                            </div>
                            <div className="col-sm-9">
                              <p className="text-muted mb-0">
                                {profile.emailVerified == true ? (
                                  <span className="badge badge-success">
                                    Verified
                                  </span>
                                ) : (
                                  <span className="badge badge-danger">
                                    Not Verified
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                          <hr />
                          <div className="row">
                            <div className="col-sm-3">
                              <p className="mb-0">Create Date</p>
                            </div>
                            <div className="col-sm-9">
                              <p className="text-muted mb-0">
                                {new Date(
                                  profile.createdAt
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <hr />
                          <div className="row">
                            <div className="col-sm-3">
                              <p className="mb-0">Update Date</p>
                            </div>
                            <div className="col-sm-9">
                              <p className="text-muted mb-0">
                                {new Date(
                                  profile.updatedAt
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            ))
          )}
        </div>

        <div className="card" style={{ display: isEdit }}>
          <div className="card-header py-3 d-sm-flex align-items-center justify-content-between">
            <h6 className="m-0 font-weight-bold text-primary">
              Update Admin Profile
            </h6>
          </div>
          <div className="card-body">
            {profile.map((profile, index) => (
              <form key={index}>
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
                      <label className="form-label" htmlFor="form6Example8">
                        New Password
                      </label>
                      <input
                        type="password"
                        id="form6Example8"
                        className="form-control"
                        onChange={(e) => newPassword(e.target.value)}
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
                  onClick={(e) => updateProfile(e, profile._id)}
                  className={
                    isloading
                      ? "btn btn-primary btn-block disabled"
                      : "btn btn-primary btn-block"
                  }
                >
                  {isloading ? (
                    <div
                      className="spinner-border spinner-border-sm"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  ) : (
                    "Save User"
                  )}
                </button>
              </form>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
