import "./styles.scss";
import { useEffect, useState } from "react";
import Selector from "./components/Selector";
import axios from "axios";
import { FiArrowRightCircle } from "react-icons/fi";


var URLSearchParams = require("url-search-params");

function App() {
  const [options, setOptions] = useState([]);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [translateFrom, setTranslateFrom] = useState("en");
  const [translateTo, setTranslateTo] = useState("en");

  const [imgIndex, setImgIndex] = useState(0);

  // List that will hold images from teamates service
  const [urls, setUrls] = useState([]);


  // get resquest to teamates service
  function updateImage() {
    axios
      .get(`/api/v1/images/${input}`)
      .then((response) => {
        setUrls(response.data.urls);
  
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });

   
  }

  // Function that will 1) proccess translation, 2) render image if teamate service is up
  const translate = async () => {
    updateImage();
    const params = new URLSearchParams();
    params.append("q", input);
    params.append("source", translateFrom);
    params.append("target", translateTo);

    const res = await fetch("https://libretranslate.de/translate", {
      method: "POST",
      body: JSON.stringify({
        q: input,
        source: translateFrom,
        target: translateTo,
        format: "text",
      }),
      headers: { "Content-Type": "application/json" },

    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setOutput(data.translatedText);
      });
  };

  // for rendering list of languages
  useEffect(() => {
    axios
      .get("https://libretranslate.com/languages", {
        headers: { accept: "application/json" },
      })
      .then((res) => {
        console.log(res.data);
        setOptions(res.data);
      });
  }, []);

  //Cycle between the 10 images in a loop
  function cycleImg() {
    setImgIndex((imgIndex + 1) % urls.length);
  };

  
  return (
    <div className="outerContainer">
      <div className="innerContainer">
        <h1>Easy Translations</h1>
        {urls.length !== 0 && (
          <div
            className="innerImg"
            onClick={cycleImg}
            key={urls[imgIndex]}
            style={{ background: `url(${urls[imgIndex]})` }}
          >
            {urls.length === 0 ? "Image of translated text" : ""}
          </div>
        )}
        <div className="dropSelect">
          <span>Translate from:</span>
          <Selector options={options} setValue={setTranslateFrom} />
          <span>to:</span>
          <Selector options={options} setValue={setTranslateTo} />
        </div>
        <div className="textField">
          <div className="input">
            <textarea
              placeholder="Type what you wish to translate"
              cols="50"
              row="4"
              onChange={(e) => setInput(e.target.value)}
            ></textarea>
          </div>
          <button onClick={translate}>
            <p>Translate</p> <FiArrowRightCircle />
          </button>
          <div className="output" key={output}>
            <p>{output}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
