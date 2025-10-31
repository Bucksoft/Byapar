const DashboardCard = ({ details }) => {
  return (
    <div
      className={`relative w-full px-5 py-3 mt-3 rounded-3xl overflow-hidden inset-shadow-[1px_1px_10px_rgba(0,0,0,0.2)] shadow-lg border border-white ${
        details.id === 2
          ? "bg-gradient-to-r from-cyan-400 to-cyan-600"
          : "bg-gradient-to-r bg-rose-600 to-rose-400"
      }`}
    >
      <div
        className="absolute inset-0 bg-cover opacity-90 left-40 top-12"
        style={{
          backgroundImage: `url(${details.img})`,
        }}
      ></div>

      <div className="relative z-10">
        <h1 className="text-white font-semibold">{details.title}</h1>
        <p
          className={`${
            details.id === 2 ? "text-md text-white" : "text-xs"
          } text-white mt-2`}
        >
          {details.content}
        </p>
        <button className="btn btn-sm mt-8 rounded-xl">Coming Soon</button>
      </div>
    </div>
  );
};

export default DashboardCard;
