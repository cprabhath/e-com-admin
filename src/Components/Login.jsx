import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { axiosInstance, useAxiosLoader } from "../Axios/AxiosConfig";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isloading] = useAxiosLoader();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (email === "" || password === "") {
        toast.info("Please fill all the fields");
      } else {
        const data = { email, password };
        axiosInstance
          .post("/api/v1/admin/admin-login", data)
          .then((res) => {
            const authToken = res.data.message.token;
            const UserName = res.data.message.selectedUser.fullName;
            const Role = res.data.message.selectedUser.role;
            const image = res.data.message.selectedUser.imageUrl;
            if (authToken) {
              if (Role !== "admin") {
                toast.error("You are not authorized to access this page");
                return;
              }
              localStorage.setItem("token", authToken);
              localStorage.setItem("UserName", UserName);
              localStorage.setItem("image", image);
              navigate("/dashboard");
            }
          })
          .catch((error) => {
            if (error.request.readyState === 4) {
              toast.error("Sorry! We're in maintenance mode. Please try again in a few minutes");
            }else{
              toast.error(error.response.data.message);
            }
          });
      }
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-12 col-lg-12 col-md-9">
            <div className="card o-hidden border-0 shadow-lg my-5">
              <div className="card-body p-0">
                <div className="row">
                  <div className="col-lg-6 d-none d-lg-block bg-login-image"></div>
                  <div className="col-lg-6">
                    <div className="p-5">
                      <div className="text-center">
                        <h1 className="h4 text-gray-900 mb-4">Welcome Back!</h1>
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
                        <div className="form-group">
                          <input
                            type="password"
                            className="form-control form-control-user"
                            id="exampleInputPassword"
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <div className="custom-control custom-checkbox small">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id="customCheck"
                            />
                            <label
                              className="custom-control-label"
                              htmlFor="customCheck"
                            >
                              Remember Me
                            </label>
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
                          {isloading ? <div className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div> : "Login"}
                        </button>
                      </form>
                      <hr />
                      <div className="text-center">
                        <Link className="small" to="/forget-password">
                          Forgot Password?
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

export default Login;
