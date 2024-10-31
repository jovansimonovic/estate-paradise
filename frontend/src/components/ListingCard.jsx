import React from "react";
import { Link } from "react-router-dom";

const ListingCard = ({ listing, handleDeleteListing }) => {
  return (
    <div className="flex flex-col h-full bg-white border border-gray-200 rounded-lg shadow max-w-96">
      <img
        className="object-cover w-full h-48 rounded-t-lg"
        src={listing.images[0]}
        alt="Listing Image"
      />
      <div className="flex flex-col flex-1 p-5">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">
          {listing.name}
        </h5>
        <p className="flex-grow mb-3 font-normal text-gray-700">
          {listing.description}
        </p>
        <div className="flex justify-end gap-x-3">
          <Link to={`/update-listing/${listing._id}`}>
            <button type="button" className="px-4 btn-secondary">
              Edit
            </button>
          </Link>
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
