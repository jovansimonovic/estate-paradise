import React, { useEffect, useState } from "react";
import { Axios } from "../utils/axios";
import { Link, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import {
  FaBath,
  FaBed,
  FaChair,
  FaLocationDot,
  FaSquareParking,
} from "react-icons/fa6";

const Listing = () => {
  SwiperCore.use([Navigation]);

  const [listing, setListing] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const params = useParams();

  useEffect(() => {
    const getListing = async () => {
      try {
        setLoading(true);
        const response = await Axios.get(`/listing/get-one/${params.id}`);
        if (response.data.success === true) {
          setError(false);
          setLoading(false);
          setListing(response.data.listing);
        }
      } catch (error) {
        setLoading(false);
        setError(true);
        console.log(error);
      }
    };
    getListing();
  }, []);

  return (
    <main>
      {loading && <p className="mt-64 text-2xl text-center">Loading...</p>}
      {error && (
        <div className="mt-64 text-center">
          <p className="mb-4 text-2xl">Something went wrong</p>
          <Link to="/">
            <button type="button" className="btn-primary">
              Go back to Home page
            </button>
          </Link>
        </div>
      )}
      {listing && !loading && !error && (
        <div className="max-w-6xl mx-auto mb-8">
          <Swiper navigation>
            {listing.images?.map((image) => (
              <SwiperSlide key={image}>
                <figure>
                  <img
                    src={image}
                    alt="Listing Image"
                    className="w-full max-h-[600px]"
                  />
                </figure>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="p-4">
            <p className="flex mb-2 gap-x-2">
              {listing.type === "sale" ? (
                <span className="p-2 font-semibold text-white rounded-md bg-slate-700">
                  For Sale
                </span>
              ) : (
                <span className="p-2 font-semibold text-white rounded-md bg-slate-700">
                  For Rent
                </span>
              )}
              {listing.isOffered && (
                <span className="p-2 font-semibold text-white bg-green-700 rounded-md">
                  Special Offer
                </span>
              )}
            </p>
            {listing.type === "sale" ? (
              listing.isOffered ? (
                <>
                  <p className="text-2xl font-bold line-through text-slate-600">
                    {listing.regularPrice?.toLocaleString()} €
                  </p>
                  <p className="mb-2 text-3xl font-bold text-green-700">
                    {listing.discountPrice?.toLocaleString()} €{" "}
                    <span className="text-lg">
                      (
                      {Math.round(
                        ((listing.regularPrice - listing.discountPrice) /
                          listing.regularPrice) *
                          100
                      )}
                      % off)
                    </span>
                  </p>
                </>
              ) : (
                <p className="mb-2 text-2xl font-bold">
                  {listing.regularPrice?.toLocaleString()} €
                </p>
              )
            ) : listing.isOffered ? (
              <>
                <p className="text-2xl font-bold line-through text-slate-600">
                  {listing.regularPrice?.toLocaleString()} € / month
                </p>
                <p className="mb-2 text-3xl font-bold text-green-700">
                  {listing.discountPrice?.toLocaleString()} € / month{" "}
                  <span className="text-lg">
                    (
                    {Math.round(
                      ((listing.regularPrice - listing.discountPrice) /
                        listing.regularPrice) *
                        100
                    )}
                    % off)
                  </span>
                </p>
              </>
            ) : (
              <p className="mb-2 text-2xl font-bold">
                {listing.regularPrice?.toLocaleString()} €
              </p>
            )}
            <div className="flex items-center mb-2">
              <FaLocationDot className="text-slate-700" />
              <span className="ml-2 text-slate-700">{listing.address}</span>
            </div>
            <h2 className="text-4xl font-bold">{listing.name}</h2>
            <p className="mt-4 mb-8 text-xl font-semibold text-justify text-slate-700">
              {listing.description}
            </p>
            <div className="grid grid-cols-2 grid-rows-2 mb-8 gap-y-8 place-items-center">
              <div className="flex items-center">
                <FaBed className="text-3xl text-slate-700" />
                <span className="ml-4 font-semibold text-slate-700">
                  {listing.bedrooms} Bedrooms
                </span>
              </div>
              <div className="flex items-center">
                <FaBath className="text-3xl text-slate-700" />
                <span className="ml-4 font-semibold text-slate-700">
                  {listing.bathrooms} Bathrooms
                </span>
              </div>
              <div className="flex items-center">
                <FaSquareParking className="text-3xl text-slate-700" />
                <span className="ml-4 font-semibold text-slate-700">
                  {listing.hasParking ? "Has Parking" : "No Parking"}
                </span>
              </div>
              <div className="flex items-center">
                <FaChair className="text-3xl text-slate-700" />
                <span className="ml-4 font-semibold text-slate-700">
                  {listing.isFurnished ? "Furnished" : "Not Furnished"}
                </span>
              </div>
            </div>
            <button type="button" className="w-full btn-primary">
              {listing.type === "sale" ? "Contact Seller" : "Contact Landlord"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default Listing;
