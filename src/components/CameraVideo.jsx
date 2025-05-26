function CameraVideo({ showCertificate }) {
  if (showCertificate) return null;
  return (
    <video
      id="camera"
      autoPlay
      playsInline
      muted
      className="absolute inset-0 w-full h-full object-cover"
    />
  );
}
export default CameraVideo;