import React from "react";

const ListingCard = ({ listing, handleDeleteListing }) => {
  const handleUpdateListing = () => {};

  return (
    <div className="flex flex-col h-full bg-white border border-gray-200 rounded-lg shadow max-w-96">
      <a href="#">
        <img
          className="object-cover w-full rounded-t-lg h-48"
          src={listing.images[0]}
          alt="Listing Image"
        />
      </a>
      <div className="flex flex-col flex-1 p-5">
        <a href="#">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">
            {listing.name}
          </h5>
        </a>
        <p className="flex-grow mb-3 font-normal text-gray-700">
          {listing.description}
        </p>
        <div className="flex justify-end gap-x-3">
          <button
            type="button"
            className="px-4 btn-secondary"
            onClick={handleUpdateListing}
          >
            Edit
          </button>
          <button
            type="button"
            className="px-4 btn-danger"
            onClick={() => handleDeleteListing(listing)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
