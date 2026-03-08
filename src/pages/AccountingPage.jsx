import { useEffect, useState } from "react";
import PageLayout from "../components/layout/PageLayout";
import Card from "../components/ui/Card";
import ExpensePieChart from "../components/accounting/ExpensePieChart";
import InvoiceList from "../components/accounting/InvoiceList";
import ReceiptUploadModal from "../components/accounting/ReceiptUpload";
import InvoiceCreateModal from "../components/accounting/InvoiceCreateModal";
import api from "../services/api";

export default function AccountingPage() {

  const [stats,setStats]=useState([]);
  const [invoices,setInvoices]=useState([]);
  const [loading,setLoading]=useState(true);

  const [createOpen,setCreateOpen]=useState(false);
  const [uploadOpen,setUploadOpen]=useState(false);


  const loadData=async()=>{

    try{

      const [statsRes,invoicesRes]=await Promise.all([
        api.get("/accounting/stats"),
        api.get("/accounting/invoices")
      ]);

      setStats(statsRes.data||[]);
      setInvoices(invoicesRes.data||[]);

    }catch(err){

      console.error("Accounting fetch error:",err);

    }finally{

      setLoading(false);

    }

  };


  useEffect(()=>{

    loadData();

  },[]);


  // AI updates automatisch refreshen
  useEffect(()=>{

    const interval=setInterval(()=>{

      loadData();

    },5000);

    return ()=>clearInterval(interval);

  },[]);


  return (

    <PageLayout>

      <h1 className="text-2xl font-bold mb-6 text-white">
        Buchhaltung
      </h1>


      {/* 📊 Statistik */}

      <Card className="mb-6 p-4">

        <h2 className="font-semibold mb-2">
          Ausgaben nach Kategorie
        </h2>

        {stats.length>0?(
          <ExpensePieChart data={stats}/>
        ):(
          <p className="text-gray-400 text-sm">
            Keine Daten vorhanden
          </p>
        )}

      </Card>



      {/* 🧾 Rechnungen */}

      <Card className="mb-6 p-4">

        <div className="flex justify-between items-center mb-4">

          <h2 className="font-semibold">
            Rechnungen
          </h2>

          <div className="flex gap-2">

            <button
              onClick={()=>setCreateOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
            >
              + Neue Rechnung
            </button>

            <button
              onClick={()=>setUploadOpen(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
            >
              + Beleg scannen
            </button>

          </div>

        </div>


        {loading?(
          <p className="text-gray-400 text-sm">
            Lade Rechnungen...
          </p>
        ):invoices.length>0?(
          <InvoiceList
            invoices={invoices}
            onUpdated={(updated)=>{

              setInvoices(prev=>
                prev.map(inv=>
                  inv.id===updated.id?updated:inv
                )
              );

            }}
          />
        ):(
          <p className="text-gray-400 text-sm">
            Noch keine Rechnungen vorhanden
          </p>
        )}

      </Card>



      {/* ✨ Modals */}

      <InvoiceCreateModal
        open={createOpen}
        onClose={()=>setCreateOpen(false)}
        onCreated={(invoice)=>{

          setInvoices(prev=>[invoice,...prev]);

        }}
      />


      <ReceiptUploadModal
        open={uploadOpen}
        onClose={()=>setUploadOpen(false)}
        onCreated={(invoice)=>{

          setInvoices(prev=>[invoice,...prev]);

        }}
      />



    </PageLayout>

  );

}
