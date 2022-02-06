import "./Comic.css";
import { NavLink } from "react-router-dom";

export const Comic = () => {
  return (
    <article className="comic">
      <div className="panel">
        <p className="text top-left">Enters the Road to Web3 hackathon ...</p>
        <p className="text bottom-right">...Chris and Regina</p>
      </div>
      <div className="panel">
        <p className="text top-left">Looking to be creative...</p>
        <p className="text bottom-right">...with NFTs in mind</p>
      </div>
      <div className="panel">
        <p className="speech-left">
          People should be able to come together and collaborate. Sharing and
          creating collections of stories.
        </p>
      </div>
      <div className="panel">
        <p className="speech-right">...Okay, that sounds fun.</p>
      </div>
      <div className="panel">
        <p className="speech-left">I have got an idea!</p>
      </div>
      <div className="panel">
        <p className="speech-right">Go on...</p>
      </div>
      <div className="panel">
        <p className="text top-left">
          In an alternate universe, all events and stories written <br /> on
          this site will happen and can be represented as a comic.
        </p>
        <p className="text bottom-right">
          Create and browse infinite comic books online, <br />
          writtern by the comic babel community.
        </p>
      </div>
      <div className="panel">
        <p className="speech-left">
          Click <NavLink to="/homepage">🔮 here</NavLink> to make history
        </p>
        <p className="speech-right">Wow, let's do it!</p>
      </div>
      <div className="panel">
        <p className="text top-left">
          Universe 232873: <br />
          Maintainer u8: We have detected a local breach in human's ideology
          progression. <br />
          [redacted]: What's the impact score? <br />
          Maintainer u8: It seems to be growing by the minute. <br />
          [redacted]: Hold on ... this conversion has been comprised ... <br />
          [redacted]: You know what to do ...
          <br />
        </p>
        <p className="text bottom-right">THE END</p>
      </div>
    </article>
  );
};
