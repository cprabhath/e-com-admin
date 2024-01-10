import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAxiosLoader, axiosInstance } from "../Axios/AxiosConfig";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [isloading] = useAxiosLoader();


  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      fullName === "" ||
      email === "" ||
      password === "" ||
      repeatPassword === ""
    ) {
      toast.info("Please fill all the fields");
    } else if (password !== repeatPassword) {
      toast.info("Password does not match");
    } else {
      const data = {
        fullName,
        email,
        password,
      };
      axiosInstance
        .post("/api/v1/users/register", data)
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
        <div className="card o-hidden border-0 shadow-lg my-5">
          <div className="card-body p-0">
            <div className="row">
              <div className="col-lg-5 d-none d-lg-block bg-register-image"></div>
              <div className="col-lg-7">
                <div className="p-5">
                  <div className="text-center">
                    <h1 className="h4 text-gray-900 mb-4">
                      Create an Account!
                    </h1>
                  </div>
                  <form className="user">
                    <div className="form-group row">
                      <div className="col-sm-12 mb-3 mb-sm-0">
                        <input
                          type="text"
                          className="form-control form-control-user"
                          id="exampleFirstName"
                          placeholder="Full Name"
                          onChange={(e) => setFullName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <input
                        type="email"
                        className="form-control form-control-user"
                        id="exampleInputEmail"
                        placeholder="Email Address"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
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
                        {isloading ? "Loading..." : "Register Account"}
                    </button>
                    <hr />
                    <a
                      href="index.html"
                      className="btn btn-google btn-user btn-block"
                    >
                      <i className="fab fa-google fa-fw"></i> Register with
                      Google
                    </a>
                  </form>
                  <hr />
                  <div className="text-center">
                    <Link className="small" to="/forget-password">
                      Forgot Password?
                    </Link>
                  </div>
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
  );
};

export default Register;
