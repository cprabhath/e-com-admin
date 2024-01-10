import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { axiosInstance } from "../Axios/AxiosConfig";
import { useEffect, useState } from "react";

const AccountActivated = () => {
  const { token } = useParams();
  const [error, setError] = useState("");

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await axiosInstance.get(`/api/v1/users/verify/${token}`);
        toast.success(res.data.message);
      } catch (err) {
        setError(err.response.data.message);
        toast.error(err.response.data.message);
      }
    };

    // Call the function
    verifyUser();
  }, [token]); 

  return (
    <div className="container">
      <div className="card o-hidden border-0 shadow-lg my-5">
        <div className="card-body p-0">
          <div className="row">
            <div className="p-5">
              <div className="text-center">
                <h1 className="h4 text-gray-900 mb-4">
                  {error
                    ? `Oops.. ${error}`
                    : "Your account has been activated!"}
                </h1>
                <p className="mb-4">
                  {error
                    ? "Please try again with correct token."
                    : "Your account has been activated successfully. You can now login to your account."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountActivated;
