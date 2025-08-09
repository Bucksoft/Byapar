const CustomLoader = ({ text }) => {
  return (
    <div className="flex items-center gap-2 text-zinc-800 text-xs">
      <span className="loading loading-dots loading-xs"></span> {text}
    </div>
  );
};

export default CustomLoader;
