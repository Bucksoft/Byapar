import { Star } from "lucide-react";
import React from "react";
import { pricing_Review } from "../../utils/constants";

const HomePageReview = () => {
  function getRandomColorHash() {
    const hex = Math.floor(Math.random() * 0xffffff).toString(16);
    return `#${hex.padStart(6, "0")}`;
  }
  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Trusted by Thousands of Businesses
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See what our customers have to say about their experience with
            BYAPAR.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4 rounded-md p-2 px-5  mb-10">
          {pricing_Review?.map((review) => (
            // card
            <div
              key={review?.id}
              className="card p-2 w-full  bg-gradient-to-br from-amber-100 to-purple-100  card-xs shadow-lg shadow-zinc-400"
            >
              <div className="card-body  ">
                <div className="flex items-center gap-2 ">
                  <div className="avatar avatar-placeholder">
                    <div
                      className={`w-8 rounded-full text-black`}
                      style={{ backgroundColor: getRandomColorHash() }}
                    >
                      <span className="text-xs">{review?.name[0]}</span>
                    </div>
                  </div>
                  <h2 className="card-title">{review?.name}</h2>
                </div>
                <p >{review?.review}</p>
                <div className="justify-end card-actions text-yellow-500 ">
                  <span className="">{review?.stars}</span>
                  <span className="">{review?.stars}</span>
                  <span className="">{review?.stars}</span>
                  <span className="">{review?.stars}</span>
                  <span className="">{review?.stars}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomePageReview;
