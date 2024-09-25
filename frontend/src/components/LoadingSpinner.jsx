const styles = "absolute border-edBlue rounded-full border-[3px] mt-[5rem] size-[4rem] border-t-transparent animate-spin"

function LoadingSpinner() {
  return (
    <>
      <div className={`${styles}`}></div>
    </>
  );
}

export default LoadingSpinner;