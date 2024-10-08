import React from "react";

const ListingCard = ({ listing }) => {
  return (
    <div
      className="bg-white border border-gray-200 rounded-lg shadow h-full flex flex-col"
    >
      <a href="#">
        <img
          className="rounded-t-lg"
          src={listing.images[0]}
          alt="Listing Image"
        />
      </a>
      <div className="p-5 flex flex-col flex-1">
        <a href="#">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">
            {listing.name}
          </h5>
        </a>
        <p className="mb-3 font-normal text-gray-700 flex-grow">
          {listing.description}
        </p>
        <div className="flex justify-end gap-x-3">
          <a href="#" className="px-4 btn-secondary">
            Edit
          </a>
          <a href="#" className="px-4 btn-danger">
            Delete
          </a>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
