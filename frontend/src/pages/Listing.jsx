import React, { useEffect, useState } from "react";
import { Axios } from "../utils/axios";
import { Link, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";

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
        <div className="max-w-6xl mx-auto">
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
        </div>
      )}
    </main>
  );
};

export default Listing;
