import { useState, useEffect } from "react";
import ReactDOM from "react-dom";

interface ModalProps {
  open: boolean;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ children, open }) => {
  const [isBrowser, setIsBrowser] = useState(false);
  useEffect(() => {
    setIsBrowser(true);
  }, []);

  return isBrowser && open
    ? ReactDOM.createPortal(
        children,
        document.getElementById("portal") as Element
      )
    : null;
};

export default Modal;
