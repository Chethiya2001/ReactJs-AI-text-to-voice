import { useState, useEffect } from "react"


function App() {

  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [ready, setReady] = useState("false")
  const [currentAudio, setCurrentAudio] = useState("")
  const [audioUrl, setAudioUrl] = useState(null);

  useEffect(() => {
    const checkReady = setInterval(() => {
      if (window.puter && window.puter.ai && typeof window.puter.ai.txt2speech === "function") {
        setReady(true);
        clearInterval(checkReady);
      }
    }, 300);
    return () => clearInterval(checkReady);
  }, []);

  const speechText = async () => {
    if (text.length > 3000) {
      setError("Text is longer than 3000 characters");
      return
    }
    setLoading(true);
    setError("");

    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    try {
      const audio = await window.puter.ai.txt2speech(text, {
        engine: "standard",
        language: "en-US",
      });

      const url = audio.src || URL.createObjectURL(audio);
      setAudioUrl(url);
      setCurrentAudio(audio);
      audio.play();
      audio.addEventListener("ended", () => setLoading(false));
      audio.addEventListener("error", () => setLoading(false))
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }

  }
  const stopSpeech = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
      setLoading(false);
    }
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500
    via-slate-100 to-white flex flex-col items-center justify-center p-3 gap-6
    ">
      <h1 className="text-6xl  sm:text-7xl md:text-8xl font font-light
      bg-gradient-to-r from-green-900 via-lime-500 to-emerald-900
      bg-clip-text text-transparent text-center
      ">AI Text To Voice</h1>

      <div className={`px-4 py-2 rounded-full text-sm font-medium ${ready ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
        : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
        }`}>
        {ready ? " Ready" : "Generating..."}
      </div>

      <div className="w-full max-w-2xl bg-gradient-to-r
        from-gray-800/90 to-gray-700/90 backdrop:blur-md border
        border-gray-600 rounded-3xl p-6 shadow-2xl
      ">
        <textarea className="w-full h-40 p-4 bg-gray-700/80 border border-gray-600 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition duration-300 disabled:opacity-50 resize-none shadow-xl focus:shadow-emerald-700/70"
          placeholder=""
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={!ready}
          maxLength={3000}
        ></textarea>
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-gray-400">
            {text.length}/3000
          </span>
        </div>
        <div className="flex gap-3 mt-4">
          <button
            className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 hover:opacity-80 text-white font-semibold rounded-2xl transition disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={speechText}
            disabled={!ready || loading || !text.trim()}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></div>
                Speaking...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 cursor-pointer">
                <span>🔊</span>
                <span>Speak</span>
              </div>
            )}
          </button>

          {currentAudio && (
            <button
              className="px-6 py-3 bg-gradient-to-r from-gray-600
            to-gray-700 hover:opacity-80 text-white font-semibold rounded-2xl border border-neutral-500/30 transition cursor-pointer"
              onClick={stopSpeech}>
              Stop
            </button>
          )}
        </div>
        <div>
          {error && (
            <div className="p-4 bg-red-100 text-red-700 border border-red-300 rounded-2xl">
              {error}
            </div>
          )}
        </div>
        {audioUrl && (
          <div className="pt-6">
 <a
            href={audioUrl}
            download="speech.mp3"
            className="px-6 py-3 bg-gradient-to-r from-green-50-600
            to-gray-700 hover:opacity-80 text-white font-semibold rounded-2xl border border-neutral-500/30 transition cursor-pointer"
          >
           <span role="img" aria-label="download">⬇️ Mp3</span>
          </a>
          </div>
         
        )}


      </div>

    </div>
  )
}

export default App
