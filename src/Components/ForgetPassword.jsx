import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { axiosInstance, useAxiosLoader } from "../Axios/AxiosConfig";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [isloading] = useAxiosLoader();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === "") {
      toast.info("Please fill all the fields");
    } else {
      axiosInstance
        .post("/api/v1/admin/admin-forgot-password", { email })
        .then((res) => {
          toast.success(res.data.message);
        })
        .catch((err) => {
          toast.error(err.response.data.message);
        });
    }
  };
  return (
    <div>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-10 col-lg-12 col-md-9">
            <div className="card o-hidden border-0 shadow-lg my-5">
              <div className="card-body p-0">
                <div className="row">
                  <div className="col-lg-6 d-none d-lg-block bg-password-image"></div>
                  <div className="col-lg-6">
                    <div className="p-5">
                      <div className="text-center">
                        <h1 className="h4 text-gray-900 mb-2">
                          Forgot Your Password?
                        </h1>
                        <p className="mb-4">
                          We get it, stuff happens. Just enter your email
                          address below and we`ll send you a link to reset your
                          password!
                        </p>
                      </div>
                      <form className="user">
                        <div className="form-group">
                          <input
                            type="email"
                            className="form-control form-control-user"
                            id="exampleInputEmail"
                            aria-describedby="emailHelp"
                            placeholder="Enter Email Address..."
                            onChange={(e) => setEmail(e.target.value)}
                          />
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
                              <span className="visually-hidden">
                                Loading...
                              </span>
                            </div>
                          ) : (
                            "Reset Password"
                          )}
                        </button>
                      </form>
                      <hr />

                      <div className="text-center">
                        <Link className="small" to="/">
                          Already have an account? Login!
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
