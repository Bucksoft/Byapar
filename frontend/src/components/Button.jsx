const Button = ({ text }) => {
  return (
    <button
      className="px-8 cursor-pointer  text-white w-full py-2 rounded-[2rem] transition-all duration-150 ease-in-out"
      style={{
        boxShadow: `inset 0 4px 6px rgba(255, 255, 255, 0.15), 
                inset 0 -4px 6px rgba(0, 0, 0, 0.5)`,
        background: `linear-gradient(to bottom, #00BAFE, #00BAFE )`,
      }}
    >
      {text}
    </button>
  );
};

export default Button;
