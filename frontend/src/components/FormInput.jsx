import { useNavigate } from "react-router-dom";

export function FormInputBox({ type = "text", idAndName, value, onChange, autoFocus = false, placeholder }) {
  return (
    <input
      autoFocus={autoFocus}
      className={`bg-transparent text-edWhite mb-4 text-lg px-2 py-2 border border-edBase placeholder-edGray rounded-lg w-[15vw] min-w-[16rem]`}
      value={value}
      id={idAndName}
      type={type}
      name={idAndName}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
}

export function FormInputButton({ isPrimaryButton = false, navigateTo, children }) {
  const navigate = useNavigate();
  if (isPrimaryButton) {
    return (
      <button
        className="mt-4 w-full border-2 border-transparent px-4 py-2 font-semibold bg-edBlue
        hover:border-white hover:text-white active:scale-[0.97] active:border-[#555]"
        // style={{ transition: "border-color 0.10s, color 0.10s" }}
        type="submit"
      >
        {children}
      </button>
    );
  } else {
    return (
      <button
        className="mt-4 w-full border-2 border-edGray px-4 py-2 font-semibold 
          bg-[#00000000] hover:border-edBlue hover:text-edBlue"
        // style={{ transition: "background 0.2s, color 0.2s" }}
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
    <label className="text-base" htmlFor={htmlFor}>
      {children}
    </label>
  );
}