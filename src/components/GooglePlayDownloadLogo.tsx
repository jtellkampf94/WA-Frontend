import image from "../assets/images/gpi.png";

interface GooglePlayDownloadLogoProps {
  width: number;
  height: number;
}

const GooglePlayDownloadLogo: React.FC<GooglePlayDownloadLogoProps> = ({
  width,
  height,
}) => {
  return (
  <img
      src={image}
      alt="google_play_download_logo"
      width={width}
      height={height}
      style={{ objectFit: "cover" }}
    />
  );
};

export default GooglePlayDownloadLogo;
