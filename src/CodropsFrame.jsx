const CodropsFrame = () => {
  return (
    <div className="frame">
      <header className="frame__header">
        <h1 className="frame__title">
          Vishoo Verma
        </h1>
        <a
          aria-label="Read Article"
          className="frame__back"
          href="https://vishoov.vercel.app"
          target="_blank"
        >
          Contact
        </a>
        <a
          className="frame__prev" 
          target="_blank" 
          href="mailto:vishooverma@gmail.com"
        >
          Connect
        </a>
        <a
          className="frame__github"
          target="_blank" 
          href="https://github.com/vishoov/"
        >
          Github
        </a>
      </header>
      <button className="click__anywhere">Click Anywhere || Drag</button>
    </div>
  );
};

export default CodropsFrame;
