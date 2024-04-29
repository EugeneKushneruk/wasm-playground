"use client"

import React, { useEffect, useState } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

const ffmpeg = new FFmpeg()

const GifCreator = () => {
  const [loaded, setLoaded] = useState(false);
  const [video, setVideo] = useState();
  const [gif, setGif] = useState();

  const load = async () => {
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'

    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    })

    ffmpeg.on('log', ({message}) => {
      console.log(message);
    });

    setLoaded(true)
  }

  const convertToGif = async () => {
    // Write the file to memory
    await ffmpeg.writeFile('test.mp4', await fetchFile(video));

    // Run the FFMpeg command
    await ffmpeg.exec(['-i', 'test.mp4', '-t', '2.5', '-ss', '2.0', '-f', 'gif', 'out.gif']);

    // Read the result
    const data = await ffmpeg.readFile('out.gif');

    // Create a URL
    const url = URL.createObjectURL(new Blob([data.buffer], {type: 'image/gif'}));
    setGif(url)
  }

  useEffect(() => {
    load()
  }, [])

  if (!loaded) {
    return <div>Loading...</div>
  }

  return (
    <div>
      {video && <video controls width="250" src={URL.createObjectURL(video)}></video>}
      <input type="file" onChange={(e) => setVideo(e.target.files?.item(0))}/>

      <h3>Result</h3>
      <button onClick={convertToGif}>Convert</button>

      {gif && <img src={gif} width="250"/>}
    </div>
  );
}

export default GifCreator;
