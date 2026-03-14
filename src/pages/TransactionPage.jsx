import {useEffect,useState} from "react";
import PageLayout from "../components/layout/PageLayout";
import Card from "../components/ui/Card";
import api from "../services/api";

export default function TransactionsPage(){

const [transactions,setTransactions]=useState([]);
const [loading,setLoading]=useState(true);

const loadTransactions=async()=>{

try{

const res=await api.get("/transactions");

setTransactions(res.data);

}catch(e){

console.error(e);

}

setLoading(false);

};

useEffect(()=>{

loadTransactions();

},[]);


return(

<PageLayout>

<h1 className="text-2xl font-bold mb-6 text-white">
Transaktionen
</h1>

<Card className="p-4">

{loading ? (

<p className="text-gray-400">
Lade Transaktionen...
</p>

):(

<table className="w-full text-left">

<thead>

<tr className="text-gray-400">

<th>Datum</th>
<th>Beschreibung</th>
<th>Betrag</th>
<th>Kategorie</th>

</tr>

</thead>

<tbody>

{transactions.map(t=>(

<tr key={t.id} className="border-t border-white/10">

<td>
{new Date(t.date).toLocaleDateString()}
</td>

<td>
{t.description}
</td>

<td className={
t.amount<0
?"text-red-400"
:"text-green-400"
}>
{t.amount} €
</td>

<td>
{t.category || "Unkategorisiert"}
</td>

</tr>

))}

</tbody>

</table>

)}

</Card>

</PageLayout>

)

}
