import Modal from "../ui/Modal";
import ReceiptDropzone from "./ReceiptDropzone";
import ReceiptForm from "./ReceiptForm";
import { useState } from "react";

export default function ReceiptUploadModal({ open, onClose }) {
  const [file, setFile] = useState(null);
  const [extracted, setExtracted] = useState(null);

  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose} title="Beleg scannen">
      {!file ? (
        <ReceiptDropzone onFileSelected={setFile} />
      ) : (
        <ReceiptForm
          file={file}
          extracted={extracted}
          onCancel={onClose}
        />
      )}
    </Modal>
  );
}
