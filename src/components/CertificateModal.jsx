function CertificateModal({
  certificateRef,
  playerName,
  setPlayerName,
  isDownloading,
  downloadCertificate,
  resetGame
}) {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-black bg-opacity-80 fixed inset-0 z-50">
      {/* Alleen dit blok komt op het certificaat */}
      <div
        ref={certificateRef}
        className="w-full max-w-md mx-auto bg-yellow-100 p-8 rounded-2xl shadow-2xl text-center space-y-4"
      >
        <h2 className="text-3xl font-extrabold text-orange-700">
          🎖️ Officieel Certificaat 🎖️
        </h2>
        <p className="text-lg text-orange-600">Dit certificeert dat</p>
        <h3 className="text-4xl font-bold text-green-700">{playerName}</h3>
        <p className="text-lg text-orange-600">
          met succes Tembo heeft verzorgd!
        </p>
        <p className="text-sm text-gray-500">
          Tembo's Grote Circusavontuur - {new Date().toLocaleDateString()}
        </p>
      </div>
      {/* Deze knoppen/input komen NIET op het certificaat */}
      {!isDownloading && (
        <div className="flex flex-col items-center mt-6 space-y-2 w-full max-w-md">
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="border-2 border-white p-2 rounded-lg text-lg bg-black text-white placeholder-white mb-2 w-full"
            placeholder="Jouw naam"
          />
          <button
            onClick={async () => {
              await downloadCertificate();
            }}
            className="bg-orange-500 text-white px-8 py-4 rounded-2xl text-xl hover:bg-orange-600 w-full"
          >
            Download Certificaat
          </button>
          <button
            onClick={resetGame}
            className="bg-green-500 text-white px-8 py-4 rounded-2xl text-xl hover:bg-green-600 w-full"
          >
            Speel opnieuw
          </button>
        </div>
      )}
    </div>
  );
}
export default CertificateModal;