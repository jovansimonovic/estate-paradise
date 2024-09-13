import React, { useEffect, useRef, useState } from "react";
import PasswordInput from "../components/PasswordInput";
import { useDispatch, useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteFailure,
  deleteStart,
  deleteSuccess,
  logout,
} from "../features/user/userSlice";
import { AxiosAuth } from "../utils/axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
  const UploadState = {
    IDLE: "idle",
    UPLOADING: "uploading",
    SUCCESS: "success",
    ERROR: "error",
  };

  const { user, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadState, setUploadState] = useState(UploadState.IDLE);
  const [formData, setFormData] = useState({});

  const fileRef = useRef(null);
  const navigate = useNavigate();

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    setUploadState(UploadState.UPLOADING);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(Math.round(progress));
      },
      // handles upload error
      () => {
        setUploadState(UploadState.ERROR);
        setUploadProgress(0);
      },
      // handles upload success
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
          setUploadState(UploadState.SUCCESS);
        });
      }
    );
  };

  useEffect(() => {
    if (file) handleFileUpload(file);
  }, [file]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateStart());

    try {
      const response = await AxiosAuth.put(
        `/user/update/${user._id}`,
        formData
      );

      if (response.data.success === true) {
        dispatch(updateSuccess(response.data.user));
        toast.success(response.data.message);
      }
    } catch (error) {
      dispatch(updateFailure(error.response.data.message));
    }
  };

  const handleDelete = async () => {
    dispatch(deleteStart());

    try {
      const response = await AxiosAuth.delete(`/user/delete/${user._id}`);
      if (response.data.success === true) {
        dispatch(deleteSuccess());
        localStorage.removeItem("token");
        toast.success(response.data.message);
        navigate("/login");
      }
    } catch (error) {
      dispatch(deleteFailure(error.response.data.message));
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="mt-20 flex justify-center text-center">
      <div className="w-[380px]">
        <h1 className="text-3xl font-semibold">Profile</h1>
        <form className="flex flex-col mt-4" onSubmit={handleSubmit}>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileRef}
            onChange={(e) => setFile(e.target.files[0])}
          />
          <img
            src={formData.avatar || user.avatar}
            alt="profile avatar"
            className="self-center rounded-full size-32 object-cover cursor-pointer mb-4"
            onClick={() => fileRef.current.click()}
          />
          {uploadState === UploadState.ERROR && (
            <>
              <p className="text-red-500 font-semibold">
                Failed to upload image
              </p>
              <p className="text-red-500 font-semibold mb-4">
                (image must be smaller than 2MB)
              </p>
            </>
          )}
          {uploadState === UploadState.UPLOADING && (
            <p className="text-slate-700 font-semibold mb-4">
              {`Uploading... ${uploadProgress}%`}
            </p>
          )}
          {uploadState === UploadState.SUCCESS && (
            <p className="text-slate-700 font-semibold mb-4">
              ✔️ Image uploaded successfully
            </p>
          )}
          <input
            type="text"
            placeholder="user.username"
            name="username"
            className="input-box mb-4"
            defaultValue={user.username}
            onChange={handleChange}
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            className="input-box mb-4"
            defaultValue={user.email}
            onChange={handleChange}
          />
          <PasswordInput name="password" onChange={handleChange} />
          {error && <p className="text-red-500 font-semibold mb-4">{error}</p>}
          <button
            disabled={loading}
            type="submit"
            className="btn-primary disabled:opacity-80 mb-8"
          >
            {loading ? "Loading..." : "Update Profile"}
          </button>
        </form>
        <div className="grid grid-rows-2 gap-y-2 mb-8">
          <button className="btn-secondary">
            <Link to="/create-listing">Create Listing</Link>
          </button>
          <button className="btn-primary">Show All Listings</button>
        </div>
        <div className="flex justify-between w-full">
          <button type="button" className="btn-primary" onClick={handleLogout}>
            {" "}
            Log Out
          </button>
          <button type="button" className="btn-danger" onClick={handleDelete}>
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
