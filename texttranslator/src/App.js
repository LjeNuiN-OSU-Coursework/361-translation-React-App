import "./styles.scss";
import { useEffect, useState } from "react";
import Selector from "./components/Selector";
import axios from "axios";

// import customButton from "./components/customButton";

// axios.<method> will now provide autocomplete and parameter typings
var URLSearchParams = require("url-search-params");

function App() {
  const [options, setOptions] = useState([]);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [translateFrom, setTranslateFrom] = useState("en");
  const [translateTo, setTranslateTo] = useState("en");

  const [imgIndex, setImgIndex] = useState(0)

// List holding images from teamates service
  const [urls, setUrls] = useState([]);
  

// get resquest to teamates service
function updateImage() {
    // request to teamates service
    
    axios.get(`/api/v1/images/${input}`)  
    .then(response => {
      setUrls(response.data.urls);
      // setImg(
      //   urls[0]
      // );
      
      // this.setState({urls: res.data});
      
    })
      .catch(error => {
        console.error('There was an error!', error);
    });   


    // if response is good
    // setImg(response.url)
    // Set the image to first url matching keyword
  };
  const translate = async () => {
    updateImage()
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

function cycleImg () 
{
setImgIndex((imgIndex + 1) % urls.length)
}; 

  return (
    <div className="outerContainer">
      <div className="innerContainer">
        <h1>Easy Translations</h1>

        <div className="dropSelect">
          <div className="innerImg" onClick={cycleImg} style={{ background: `url(${urls[imgIndex]})` }}>
            {/* <img
              src={img}
              alt="Image will only be shown for single word translations"
            /> */}
          </div>
          Translate from({translateFrom}):
          <Selector options={options} setValue={setTranslateFrom} />
          to ({translateTo}):
          <Selector options={options} setValue={setTranslateTo} />
          <div className="textField">
            <div className="input">
              <textarea
                cols="50"
                row="4"
                onChange={(e) => setInput(e.target.value)}
              ></textarea>
            </div>
            <div className="output">
              {/* <textarea cols="50" row="4" value={output}></textarea> */}
              <p>{output}</p>
            </div>
          </div>


          <button onClick={translate}>Translate </button>
          
        </div>
      </div>
    </div>
  );
}

export default App;
