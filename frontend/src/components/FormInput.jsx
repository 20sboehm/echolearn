import { useNavigate } from "react-router-dom";

export function FormInputBox({ type = "text", idAndName, value, onChange, autoFocus = false }) {
  return (
    <input
      autoFocus={autoFocus}
      className={`bg-[#ffffff6e] mb-4 text-xl px-2 py-2 text-black border border-black placeholder-gray-500 
        focus:outline-none focus:shadow-lg focus:shadow-[#00000030]`}
      value={value}
      id={idAndName}
      type={type}
      name={idAndName}
      onChange={onChange}
    />
  );
}

export function FormInputButton({ isPrimaryButton = false, navigateTo, children }) {
  const navigate = useNavigate();
  if (isPrimaryButton) {
    return (
      <button
        className="mt-4 w-full border-2 border-transparent px-4 py-2 font-semibold bg-[#111111] 
        hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] active:border-[#555]"
        style={{ transition: "border-color 0.10s, color 0.10s" }}
        type="submit"
      >
        {children}
      </button>
    );
  } else {
    return (
      <button
        className="mt-4 w-full border-2 text-black border-black bg-white px-4 py-2 font-semibold 
          bg-[#00000000] hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] active:border-[#555]"
        style={{ transition: "border-color 0.10s, color 0.10s" }}
        type="button"
        onClick={() => navigate(navigateTo)}
      >
        {children}
      </button>
    );
  }
}

export function FormInputLabel({ htmlFor, children }) {
  return (
    <label className="text-base text-black" htmlFor={htmlFor}>
      {children}
    </label>
  );
}