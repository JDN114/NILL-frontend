import { useEffect,useState } from "react";
import PageLayout from "../components/layout/PageLayout";
import Card from "../components/ui/Card";
import InvoiceList from "../components/accounting/InvoiceList";
import ReceiptUploadModal from "../components/accounting/ReceiptUpload";
import InvoiceCreateModal from "../components/accounting/InvoiceCreateModal";
import api from "../services/api";

export default function AccountingPage(){

const [invoices,setInvoices]=useState([]);
const [stats,setStats]=useState([]);

const [createOpen,setCreateOpen]=useState(false);
const [uploadOpen,setUploadOpen]=useState(false);


const loadData=async()=>{

const invoicesRes=await api.get("/accounting/invoices");
const statsRes=await api.get("/accounting/stats");

setInvoices(invoicesRes.data);
setStats(statsRes.data);

};


useEffect(()=>{

loadData();

const interval=setInterval(loadData,5000);

return()=>clearInterval(interval);

},[]);


return(

<PageLayout>

<h1 className="text-2xl font-bold mb-6 text-white">
Buchhaltung
</h1>


<div className="grid grid-cols-3 gap-4 mb-6">

{stats.map((s,i)=>(

<Card key={i} className="p-4">

<p className="text-sm text-gray-400">
{s.label}
</p>

<p className="text-xl font-bold">
{s.value}
</p>

</Card>

))}

</div>


<Card className="mb-6 p-4">

<div className="flex justify-between mb-4">

<h2 className="font-semibold">
Rechnungen
</h2>

<div className="flex gap-2">

<button
onClick={()=>setCreateOpen(true)}
className="bg-blue-600 px-3 py-1 rounded text-sm"
>
Neue Rechnung
</button>

<button
onClick={()=>setUploadOpen(true)}
className="bg-green-600 px-3 py-1 rounded text-sm"
>
Beleg scannen
</button>

</div>

</div>


<InvoiceList
invoices={invoices}
onUpdated={(inv)=>{

setInvoices(prev =>
prev.map(i => i.id===inv.id ? inv : i)
);

}}
/>

</Card>


<InvoiceCreateModal
open={createOpen}
onClose={()=>setCreateOpen(false)}
onCreated={(inv)=>{

setInvoices(prev=>[inv,...prev]);

}}
/>


<ReceiptUploadModal
open={uploadOpen}
onClose={()=>setUploadOpen(false)}
onCreated={(inv)=>{

setInvoices(prev=>[inv,...prev]);

}}
/>

</PageLayout>

)

}
