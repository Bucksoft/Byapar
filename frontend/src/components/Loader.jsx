const CustomLoader = ({ text }) => {
  return (
    <div
      className={`flex items-center gap-2  ${
        text === "Deleting..."
          ? "text-[var(--error-text-color)]"
          : "text-zinc-600"
      }  text-xs`}
    >
      <span className="loading loading-dots loading-sm"></span> {text}
    </div>
  );
};

export default CustomLoader;
