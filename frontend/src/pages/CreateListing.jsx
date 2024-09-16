import React, { useState } from "react";
import { app } from "../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { IoMdCloseCircle } from "react-icons/io";

const CreateListing = () => {
  const UploadState = {
    IDLE: "idle",
    UPLOADING: "uploading",
    SUCCESS: "success",
    ERROR: "error",
  };

  const [formData, setFormData] = useState({ images: [] });
  const [error, setError] = useState(null);
  const [files, setFiles] = useState([]);
  const [uploadState, setUploadState] = useState(UploadState.IDLE);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleUploadImage = () => {
    if (files.length < 1) {
      setUploadState(UploadState.IDLE);
      setError("At least 1 image must be uploaded");
      return;
    }

    if (files.length + formData.images.length > 20) {
      setUploadState(UploadState.IDLE);
      setError("You can only upload up to 20 images");
      return;
    }

    setError(null);
    setUploadState(UploadState.UPLOADING);

    const promises = [];

    for (const file of files) {
      promises.push(storeImage(file));
    }

    Promise.all(promises)
      .then((urls) => {
        setFormData({ ...formData, images: urls });
        setUploadState(UploadState.SUCCESS);
      })
      .catch(() => {
        setUploadState(UploadState.ERROR);
      });
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
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
          reject(error);
          setUploadState(UploadState.ERROR);
          setUploadProgress(0);
        },
        // handles upload success
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleDeleteImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <main className="mt-20 mb-8 lg:mb-0 px-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center">Create a Listing</h1>
      <form
        className="mt-8 flex flex-col lg:flex-row gap-4"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            minLength={10}
            maxLength={50}
            className="input-box"
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            minLength={10}
            maxLength={50}
            className="input-box"
            required
          ></textarea>
          <input
            type="text"
            name="address"
            placeholder="Address"
            minLength={10}
            maxLength={50}
            className="input-box"
            required
          />
          <div className="text-lg flex flex-wrap gap-x-4">
            <span className="flex items-center gap-x-2">
              <input type="checkbox" name="sale" />
              <label>For Sale</label>
            </span>
            <span className="flex items-center gap-x-2">
              <input type="checkbox" name="rent" />
              <label>For Rent</label>
            </span>
            <span className="flex items-center gap-x-2">
              <input type="checkbox" name="hasParking" />
              <label> Parking Spot</label>
            </span>
            <span className="flex items-center gap-x-2">
              <input type="checkbox" name="isFurnished" />
              <label>Furnished</label>
            </span>
            <span className="flex items-center gap-x-2">
              <input type="checkbox" name="isOffered" />
              <label>Offer</label>
            </span>
          </div>
          <div className="flex gap-x-6">
            <span className="flex items-center gap-x-2">
              <input
                type="number"
                defaultValue={1}
                min={1}
                max={99}
                className="input-box"
                required
              />{" "}
              Bedrooms
            </span>
            <span className="flex items-center gap-x-2">
              <input
                type="number"
                defaultValue={1}
                min={1}
                max={99}
                className="input-box"
                required
              />{" "}
              Bathrooms
            </span>
          </div>
          <div className="flex items-center gap-x-2">
            <input
              type="number"
              defaultValue={1}
              min={1}
              max={99999999}
              className="input-box"
              required
            />
            <div className="flex flex-col items-center">
              <span>Regular Price</span>
              <span className="text-xs">($ / Month)</span>
            </div>
          </div>
          <div className="flex items-center gap-x-2">
            <input
              type="number"
              defaultValue={1}
              min={1}
              max={99999999}
              className="input-box"
              required
            />
            <div className="flex flex-col items-center">
              <span>Discount Price</span>
              <span className="text-xs">($ / Month)</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-y-2">
          <div>
            <span className="font-semibold">Images:</span>{" "}
            <span className="text-slate-600">
              The first image will be the cover (max 6)
            </span>
          </div>
          <div className="flex flex-col">
            <div className="flex justify-between gap-x-4">
              <input
                type="file"
                accept="image/*"
                multiple
                className="input-box flex-1"
                onChange={(e) => setFiles(e.target.files)}
              />
              <button
                type="button"
                className="btn-secondary disabled:opacity-80"
                disabled={uploadState === UploadState.UPLOADING}
                onClick={handleUploadImage}
              >
                {uploadState === UploadState.UPLOADING
                  ? "Uploading..."
                  : "Upload"}
              </button>
            </div>
            <div className="w-full mt-2 flex justify-center flex-wrap gap-2">
              {formData.images.length > 0 &&
                formData.images.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt="listing image"
                      className="size-20 object-cover rounded"
                    />
                    <IoMdCloseCircle
                      className="absolute top-0 right-0 text-white size-6 cursor-pointer opacity-80 hover:opacity-90"
                      onClick={() => handleDeleteImage(index)}
                    />
                  </div>
                ))}
            </div>
            {uploadState === UploadState.ERROR && (
              <p className="text-red-500 font-semibold mt-2">
                Failed to upload images (images must be smaller than 2MB)
              </p>
            )}
            {uploadState === UploadState.UPLOADING && (
              <p className="text-slate-700 font-semibold mt-2">
                Uploading images... {uploadProgress}%
              </p>
            )}
            {uploadState === UploadState.SUCCESS && (
              <p className="text-slate-700 font-semibold mt-2">
                ✔️ Images uploaded successfully
              </p>
            )}
            {error && (
              <p className="text-red-500 font-semibold mt-2">{error}</p>
            )}
          </div>
          <button type="submit" className="btn-primary mt-2">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
