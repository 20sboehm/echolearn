function ScrollContainer({ className, children }) {
  return (
    <div className={`${className} overflow-y-auto overflow-x-hidden max-h-[60vh] relative scrollbar-hidden`} style={{ scrollbarGutter: "stable" }}>
      <div className="relative">
        {children}
      </div>
    </div>
  );
}

export default ScrollContainer;