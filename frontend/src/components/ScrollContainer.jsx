function ScrollContainer({ children }) {
  return (
    <div className="overflow-y-auto overflow-x-hidden max-h-[60vh] relative scrollbar-hidden">
      <div className="relative">
        {children}
      </div>
    </div>
  );
}

export default ScrollContainer;