import React, { useEffect, useRef, useState } from "react";
import PasswordInput from "../components/PasswordInput";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

const Profile = () => {
  const UploadState = {
    IDLE: "idle",
    UPLOADING: "uploading",
    SUCCESS: "success",
    ERROR: "error",
  };

  const { user, loading, error } = useSelector((state) => state.user);

  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadState, setUploadState] = useState(UploadState.IDLE);
  const [formData, setFormData] = useState({});

  const fileRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

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
      (error) => {
        setUploadState(UploadState.ERROR);
        setUploadProgress(0);
      },
      // handles upload success
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, image: downloadURL });
          setUploadState(UploadState.SUCCESS);
        });
      }
    );
  };

  useEffect(() => {
    if (file) handleFileUpload(file);
  }, [file]);

  return (
    <div className="mt-20 flex justify-center text-center">
      <div className="w-[380px]">
        <h2 className="text-3xl font-semibold">Profile</h2>
        <form className="flex flex-col my-8 " onSubmit={handleSubmit}>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileRef}
            onChange={(e) => setFile(e.target.files[0])}
          />
          <img
            src={formData.image || user.avatar}
            alt="profile image"
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
              Image uploaded successfully
            </p>
          )}
          <input
            type="text"
            placeholder="user.username"
            className="input-box mb-4"
            value={user.username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="input-box mb-4"
            value={user.email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500 font-semibold mb-4">{error}</p>}
          <button
            disabled={loading}
            type="submit"
            className="btn-primary disabled:opacity-80 mb-8"
          >
            {loading ? "Loading..." : "Update Profile"}
          </button>
          <div className="grid grid-rows-2 gap-y-2 mb-4">
            <button className="btn-primary">Create Listing</button>
            <button className="btn-secondary">Show All Listings</button>
          </div>
        </form>
        <div className="flex justify-between w-full">
          <button type="button" className="btn-primary">
            {" "}
            Sign Out
          </button>
          <button type="button" className="btn-danger">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
