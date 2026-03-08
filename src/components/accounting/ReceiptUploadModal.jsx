// src/components/accounting/ReceiptUpload.jsx

import Modal from "../ui/Modal";
import { useState } from "react";
import api from "../../services/api";

export default function ReceiptUploadModal({ open, onClose, onCreated }) {

  const [loading,setLoading]=useState(false);
  const [error,setError]=useState(null);
  const [invoice,setInvoice]=useState(null);


  if(!open) return null;


  const handleUpload=async(file)=>{

    try{

      setLoading(true);
      setError(null);

      const formData=new FormData();
      formData.append("file",file);

      const res=await api.post(
        "/accounting/invoices/from-photo",
        formData,
        {headers:{ "Content-Type":"multipart/form-data"}}
      );

      setInvoice(res.data);

    }catch(err){

      console.error(err);

      setError(
        err?.response?.data?.detail ||
        "Beleg konnte nicht verarbeitet werden."
      );

    }finally{

      setLoading(false);

    }

  };


  const handleFileChange=(e)=>{

    const file=e.target.files?.[0];

    if(file){
      handleUpload(file);
    }

  };


  const handleClose=()=>{

    setInvoice(null);
    setError(null);
    onClose();

  };


  if(invoice){

    return(

      <Modal open={open} onClose={handleClose} title="Rechnung erkannt">

        <div className="space-y-2 text-sm">

          <p><b>Titel:</b> {invoice.title}</p>
          <p><b>Anbieter:</b> {invoice.vendor || "-"}</p>
          <p><b>Betrag:</b> {invoice.amount || "-"} €</p>

        </div>

        <button
          className="mt-4 bg-green-600 px-4 py-2 rounded text-white"
          onClick={()=>{

            onCreated?.(invoice);
            handleClose();

          }}
        >
          Speichern
        </button>

      </Modal>

    );

  }


  return(

    <Modal open={open} onClose={handleClose} title="Beleg scannen">

      {error && (
        <div className="text-red-500 text-sm mb-3">
          {error}
        </div>
      )}

      <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer">

        Datei auswählen

        <input
          type="file"
          accept="image/*,application/pdf"
          className="hidden"
          onChange={handleFileChange}
          disabled={loading}
        />

      </label>

      {loading && (
        <p className="text-blue-400 mt-3 text-sm">
          🤖 KI analysiert den Beleg...
        </p>
      )}

    </Modal>

  );

}
