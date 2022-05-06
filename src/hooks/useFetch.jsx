import { useEffect, useState } from "react";

const apiKey = process.env.REACT_APP_GIPHY_API;

const useFetch = ({ keyword }) => {
  const [gifUlr, setGifUrl] = useState("");

  const fetchGifs = async () => {
    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${keyword
          .split(" ")
          .join("")}&limit=1`
      );
      const { data } = await response.json();

      setGifUrl(data[0]?.images?.downsized_medium.url);
    } catch (err) {
      console.error(err);
      setGifUrl("https://media.giphy.com/media/l44Qdv43pGxw9giuA/giphy.gif");
    }
  };

  useEffect(() => {
    if (keyword) fetchGifs();
  }, [keyword]);

  return gifUlr;
};

export default useFetch;
