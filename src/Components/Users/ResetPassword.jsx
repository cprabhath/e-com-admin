import { useParams } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { axiosInstance, useAxiosLoader } from "../../Axios/AxiosConfig";

const ResetPassword = () => {
  const { token, email } = useParams();
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [isloading] = useAxiosLoader();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === "" || repeatPassword === "") {
      return toast.info("Please fill all the fields");
    } else if (password !== repeatPassword) {
      return toast.info("Password does not match");
    }
    const user = {
      email,
      password,
    };

    axiosInstance
      .post(`/api/v1/admin/admin-reset-password/${token}/${email}`, user)
      .then((res) => {
        toast.success(res.data.message);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  return (
    <div className="container">
      <div className="card o-hidden border-0 shadow-lg my-5">
        <div className="card-body p-0">
          <div className="row">
            <div className="col-lg-5 d-none d-lg-block bg-register-image"></div>
            <div className="col-lg-7">
              <div className="p-5">
                <div className="text-center">
                  <h1 className="h4 text-gray-900 mb-4">
                    Reset your password!
                  </h1>
                </div>
                <form className="user">
                  <div className="form-group row">
                    <div className="col-sm-6 mb-3 mb-sm-0">
                      <input
                        type="password"
                        className="form-control form-control-user"
                        id="exampleInputPassword"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <div className="col-sm-6">
                      <input
                        type="password"
                        className="form-control form-control-user"
                        id="exampleRepeatPassword"
                        placeholder="Repeat Password"
                        onChange={(e) => setRepeatPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleSubmit(e)}
                    className={
                      isloading
                        ? "btn btn-primary btn-user btn-block disabled"
                        : "btn btn-primary btn-user btn-block"
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
                      "Reset your password"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
