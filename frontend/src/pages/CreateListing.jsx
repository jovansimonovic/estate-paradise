import React from "react";

const CreateListing = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();
  };
  // form: grid grid-cols-1 lg:grid-cols-2 gap-x-4
  return (
    <main className="mt-20 px-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center">Create a Listing</h1>
      <form className="mt-8 flex flex-col lg:flex-row gap-x-4">
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
        <div className="flex flex-col flex-1 gap-y-4">
          <div>
            <span className="font-semibold">Images:</span>{" "}
            <span className="text-slate-600">
              The first image will be the cover (max 6)
            </span>
          </div>
          <div className="flex justify-between gap-x-4">
            <input
              type="file"
              accept="image/*"
              multiple
              className="input-box flex-1"
            />
            <button className="btn-secondary">Upload</button>
          </div>
          <button type="submit" className="btn-primary">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
