import React, { useEffect, useState } from "react";
import { app } from "../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { IoMdCloseCircle } from "react-icons/io";
import { Axios, AxiosAuth } from "../utils/axios.js";
import { useSelector, useDispatch } from "react-redux";
import {
  createFailure,
  createStart,
  createSuccess,
} from "../features/listing/listingSlice.js";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const UpdateListing = () => {
  const UploadState = {
    IDLE: "idle",
    UPLOADING: "uploading",
    SUCCESS: "success",
    ERROR: "error",
  };

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    regularPrice: 1,
    discountPrice: 0,
    bathrooms: 1,
    bedrooms: 1,
    isFurnished: false,
    hasParking: false,
    type: "",
    isOffered: false,
    images: [],
  });

  const [files, setFiles] = useState([]);
  const [uploadState, setUploadState] = useState(UploadState.IDLE);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { loading, error } = useSelector((state) => state.listing);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    const getListing = async () => {
      try {
        const response = await Axios.get(`/listing/get-one/${params.id}`);
        if (response.data.success === true) setFormData(response.data.listing);
      } catch (error) {
        console.log(error.response.data);
      }
    };

    getListing();
  }, []);

  const handleUploadImage = () => {
    if (files.length < 1) {
      setUploadState(UploadState.IDLE);
      dispatch(createFailure("At least 1 image must be uploaded"));
      return;
    }

    if (files.length + formData.images.length > 20) {
      setUploadState(UploadState.IDLE);
      dispatch(createFailure("You can only upload up to 20 images"));
      return;
    }

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

  const handleChange = (e) => {
    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    if (e.target.name === "sale" || e.target.name === "rent") {
      setFormData({ ...formData, type: e.target.name });
    }

    if (
      e.target.name === "hasParking" ||
      e.target.name === "isFurnished" ||
      e.target.name === "isOffered"
    ) {
      setFormData({ ...formData, [e.target.name]: e.target.checked });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(createStart());

    try {
      const response = await AxiosAuth.put(`/listing/update/${params.id}`, formData);

      if (response.data.success === true) {
        dispatch(createSuccess());
        toast.success(response.data.message);
        navigate("/profile");
      }
    } catch (error) {
      console.log(error);
      dispatch(createFailure(error.response.data.message));
    }
  };

  return (
    <main className="max-w-4xl px-4 mx-auto mt-20 mb-8 lg:mb-0">
      <h1 className="text-3xl font-semibold text-center">Edit Listing</h1>
      <form
        className="flex flex-col gap-4 mt-8 lg:flex-row"
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
            value={formData.name}
            onChange={handleChange}
          />
          <textarea
            name="description"
            placeholder="Description"
            minLength={10}
            maxLength={500}
            rows={5}
            className="input-box"
            required
            value={formData.description}
            onChange={handleChange}
          ></textarea>
          <input
            type="text"
            name="address"
            placeholder="Address"
            minLength={10}
            maxLength={50}
            className="input-box"
            required
            value={formData.address}
            onChange={handleChange}
          />
          <div className="flex flex-col flex-wrap text-lg gap-x-4">
            <div className="flex items-center gap-x-4">
              <span className="flex items-center gap-x-2">
                <input
                  type="radio"
                  name="sale"
                  checked={formData.type === "sale"}
                  onChange={handleChange}
                />
                <label>For Sale</label>
              </span>
              <span className="flex items-center gap-x-2">
                <input
                  type="radio"
                  name="rent"
                  checked={formData.type === "rent"}
                  onChange={handleChange}
                />
                <label>For Rent</label>
              </span>
            </div>
            <div className="flex items-center gap-x-4">
              <span className="flex items-center gap-x-2">
                <input
                  type="checkbox"
                  name="hasParking"
                  checked={formData.hasParking}
                  onChange={handleChange}
                />
                <label> Parking Spot</label>
              </span>
              <span className="flex items-center gap-x-2">
                <input
                  type="checkbox"
                  name="isFurnished"
                  checked={formData.isFurnished}
                  onChange={(e) =>
                    setFormData({ ...formData, isFurnished: e.target.checked })
                  }
                />
                <label>Furnished</label>
              </span>
              <span className="flex items-center gap-x-2">
                <input
                  type="checkbox"
                  name="isOffered"
                  checked={formData.isOffered}
                  onChange={handleChange}
                />
                <label>Offer</label>
              </span>
            </div>
          </div>
          <div className="flex gap-x-6">
            <span className="flex items-center gap-x-2">
              <input
                type="number"
                name="bedrooms"
                min={1}
                max={100}
                className="input-box"
                required
                value={formData.bedrooms}
                onChange={handleChange}
              />{" "}
              Bedrooms
            </span>
            <span className="flex items-center gap-x-2">
              <input
                type="number"
                name="bathrooms"
                min={1}
                max={100}
                className="input-box"
                required
                value={formData.bathrooms}
                onChange={handleChange}
              />{" "}
              Bathrooms
            </span>
          </div>
          <div className="flex items-center gap-x-2">
            <input
              type="number"
              name="regularPrice"
              min={1}
              max={100000000}
              className="input-box"
              required
              value={formData.regularPrice}
              onChange={handleChange}
            />
            <div className="flex flex-col items-center">
              <span>Regular Price</span>
              <span className="text-xs">($ / Month)</span>
            </div>
          </div>
          {formData.isOffered && (
            <div className="flex items-center gap-x-2">
              <input
                type="number"
                name="discountPrice"
                min={0}
                max={100000000}
                className="input-box"
                required
                value={formData.discountPrice}
                onChange={handleChange}
              />
              <div className="flex flex-col items-center">
                <span>Discount Price</span>
                <span className="text-xs">($ / Month)</span>
              </div>
            </div>
          )}
          {error && <p className="font-semibold text-red-500">{error}</p>}
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
                className="flex-1 input-box"
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
            <div className="flex flex-wrap justify-center w-full gap-2 mt-2">
              {formData.images.length > 0 &&
                formData.images.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt="listing image"
                      className="object-cover rounded size-20"
                    />
                    <IoMdCloseCircle
                      className="absolute top-0 right-0 text-white cursor-pointer size-6 opacity-80 hover:opacity-90"
                      onClick={() => handleDeleteImage(index)}
                    />
                  </div>
                ))}
            </div>
            {uploadState === UploadState.ERROR && (
              <p className="mt-2 font-semibold text-red-500">
                Failed to upload images (images must be smaller than 2MB)
              </p>
            )}
            {uploadState === UploadState.UPLOADING && (
              <p className="mt-2 font-semibold text-slate-700">
                Uploading images... {uploadProgress}%
              </p>
            )}
            {uploadState === UploadState.SUCCESS && (
              <p className="mt-2 font-semibold text-slate-700">
                ✔️ Images uploaded successfully
              </p>
            )}
          </div>
          <button type="submit" className="mt-2 btn-primary" disabled={loading}>
            {loading ? "Updating..." : "Confirm"}
          </button>
        </div>
      </form>
    </main>
  );
};

export default UpdateListing;
