function WeetjeModal({ activeWeetje, weetjes, onClose }) {
  if (activeWeetje === null) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60">
      <div className="bg-white rounded-2xl p-8 max-w-xs text-center shadow-xl">
        <p className="text-xl font-bold text-orange-600 mb-4">
          Wist je dat?
        </p>
        <p className="text-gray-800">{weetjes[activeWeetje]}</p>
        <button
          className="mt-6 bg-orange-500 text-white px-4 py-1 rounded-xl text-sm hover:bg-orange-600"
          onClick={onClose}
        >
          Sluiten
        </button>
      </div>
    </div>
  );
}
export default WeetjeModal;