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
import ListingCard from "../components/ListingCard";

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
  const [listings, setListings] = useState([]);

  const fileRef = useRef(null);
  const navigate = useNavigate();

  const loadUserListings = async () => {
    try {
      const response = await AxiosAuth.get("/listing/get-all-by-id");
      setListings(response.data.listings);
    } catch (error) {
      console.log(error.response.data);
    }
  };

  useEffect(() => {
    loadUserListings();
  }, []);

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

  const handleDeleteListing = async (listing) => {
    try {
      const response = await AxiosAuth.delete(`/listing/delete/${listing._id}`);

      if (response.data.success === true) {
        setListings(listings.filter((l) => l._id !== listing._id));
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      <div className="flex justify-center mt-20 text-center">
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
              className="self-center object-cover mb-4 rounded-full cursor-pointer size-32"
              onClick={() => fileRef.current.click()}
            />
            {uploadState === UploadState.ERROR && (
              <>
                <p className="font-semibold text-red-500">
                  Failed to upload image
                </p>
                <p className="mb-4 font-semibold text-red-500">
                  (image must be smaller than 2MB)
                </p>
              </>
            )}
            {uploadState === UploadState.UPLOADING && (
              <p className="mb-4 font-semibold text-slate-700">
                {`Uploading... ${uploadProgress}%`}
              </p>
            )}
            {uploadState === UploadState.SUCCESS && (
              <p className="mb-4 font-semibold text-slate-700">
                ✔️ Image uploaded successfully
              </p>
            )}
            <input
              type="text"
              placeholder="user.username"
              name="username"
              className="mb-4 input-box"
              defaultValue={user.username}
              onChange={handleChange}
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              className="mb-4 input-box"
              defaultValue={user.email}
              onChange={handleChange}
            />
            <PasswordInput name="password" onChange={handleChange} />
            {error && (
              <p className="mb-4 font-semibold text-red-500">{error}</p>
            )}
            <button
              disabled={loading}
              type="submit"
              className="mb-8 btn-primary disabled:opacity-80"
            >
              {loading ? "Loading..." : "Update Profile"}
            </button>
          </form>
          <div className="grid grid-rows-2 mb-8 gap-y-2">
            <button className="btn-secondary">
              <Link to="/create-listing">Create Listing</Link>
            </button>
            <button className="btn-primary">Show All Listings</button>
          </div>
          <div className="flex justify-between w-full">
            <button
              type="button"
              className="btn-primary"
              onClick={handleLogout}
            >
              {" "}
              Log Out
            </button>
            <button type="button" className="btn-danger" onClick={handleDelete}>
              Delete Account
            </button>
          </div>
        </div>
      </div>
      <div className="mx-4 my-8">
        <h2 className="text-3xl font-semibold">Your Listings</h2>
        <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 place-items-center">
          {listings.map((listing) => (
            <ListingCard
              key={listing._id}
              listing={listing}
              handleDeleteListing={handleDeleteListing}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Profile;
