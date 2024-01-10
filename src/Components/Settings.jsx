import { useEffect, useState } from "react";
import { axiosInstance, useAxiosLoader } from "../Axios/AxiosConfig";
import { toast } from "react-toastify";
import currencyList from "../sampleDataset/CurrencyList.json";
import { useErrors } from "./ErrorContext";
import { Link } from "react-router-dom";

const Settings = () => {
  const [isloading] = useAxiosLoader();
  const [currency, setCurrency] = useState("");
  const [isRoleModeEnabled, setRoleMode] = useState(false);
  const [Id, setId] = useState("");
  const { addError } = useErrors();

  useEffect(() => {
    getSettings();
  }, []);

  const getSettings = () => {
    axiosInstance
      .get("/api/v1/settings/find-all")
      .then((res) => {
        if (res.data.message.length > 0) {
          setCurrency(res.data.message[0].systemCurrency);
          setRoleMode(res.data.message[0].isRoleBasedAccess);
          setId(res.data.message[0]._id);
        }else{
          setCurrency("");
          setRoleMode(false);
          toast.error("No settings found. Please configure settings");
          addError("No settings found. Please configure settings");
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const createSettings = (e) => {
    e.preventDefault();
    const data = {
      currency,
      isRoleModeEnabled,
    };
    axiosInstance
      .post("/api/v1/settings/create", data)
      .then((res) => {
        toast.success(res.data.message);
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const updateSettings = (e, id) => {
    e.preventDefault();
    const data = {
      currency,
      isRoleModeEnabled,
    };
    axiosInstance
      .put(`/api/v1/settings/update/${id}`, data)
      .then((res) => {
        toast.success(res.data.message);
      })
      .catch((err) => {
        toast.error(err.message);
      });
  }

  return (
    <div style={{ marginTop: "-530px" }}>
      <div className="card border-left-primary shadow mb-4">
        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
        <Link to="/dashboard"><i className="fas fa-arrow-left"></i> </Link>

          <h6 className="font-weight-bold text-primary">Settings</h6>
          <div>{""}</div>

        </div>
        <div className="card-body">
          <form>
            <div className="row mb-4">
              <div className="col">
                <label className="form-label" htmlFor="form6Example7">
                  Enable Role base login
                </label>
                <select
                  className="form-control"
                  id="form6Example7"
                  value={isRoleModeEnabled}
                  onChange={(e) => setRoleMode(e.target.value)}
                >
                  <option value={false}>Disabled</option>
                  <option value={true}>Enable</option>
                </select>
              </div>
              <div className="col">
                <div data-mdb-input-init className="form-outline">
                  <label className="form-label" htmlFor="form6Example7">
                    Select Currency
                  </label>
                  <select
                    className="form-control"
                    id="form6Example7"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  >
                    <option>Choose your option</option>
                    {currencyList
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((currency, index) => (
                        <option key={index} value={currency.code}>
                          {currency.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>
            <button
              data-mdb-ripple-init
              type="button"
              className="btn btn-primary btn-block"
              onClick={
                currency != "" ? (e) => updateSettings(e, Id) : (e) => createSettings(e)
              }
            >
              {
                isloading ? (
                  <div className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  "Save Settings"
                )
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
