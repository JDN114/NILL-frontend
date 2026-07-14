import {useEffect,useState} from "react";
import PageLayout from "../components/layout/PageLayout";
import Card from "../components/ui/Card";
import api from "../services/api";

/* Mobile-only styles. The card list (.tx-cards) is a mobile-only element and
   stays display:none on desktop; every other rule lives inside the media
   queries, so desktop rendering is byte-identical. */
const TX_MOBILE_CSS = `
  .tx-cards { display: none; }
  @media (max-width: 768px) {
    /* Compact native header: serif title like the dashboard cards */
    .tx-title {
      font-family: 'Fraunces', Georgia, serif !important;
      font-weight: 400 !important;
      font-size: 1.55rem !important;
      letter-spacing: -0.02em;
      margin-bottom: 0.9rem !important;
    }
    /* The desktop table becomes a tappable card list */
    .tx-table { display: none; }
    .tx-card {
      background: transparent !important;
      box-shadow: none !important;
      padding: 0 !important;
      border-radius: 0 !important;
    }
    .tx-cards {
      display: flex;
      flex-direction: column;
      margin: 0;
      padding: 0;
      list-style: none;
      content-visibility: auto;
    }
    .tx-row {
      display: flex;
      align-items: center;
      gap: 12px;
      min-height: 64px;
      padding: 12px 4px;
      border-bottom: 1px solid rgba(var(--ink-tint), 0.09);
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
      user-select: none;
      -webkit-user-select: none;
      transition: background 0.12s;
    }
    .tx-row:last-child { border-bottom: none; }
    .tx-row:active { background: rgba(var(--tint), 0.06); }
    .tx-row-main { flex: 1; min-width: 0; }
    .tx-row-desc {
      font-size: 0.92rem;
      font-weight: 500;
      color: var(--text-main);
      margin: 0 0 3px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .tx-row-meta {
      font-size: 0.74rem;
      color: rgba(var(--ink-tint), 0.55);
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .tx-row-amount {
      flex-shrink: 0;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.92rem;
      font-weight: 600;
      white-space: nowrap;
    }
    .tx-empty {
      padding: 40px 16px;
      text-align: center;
      font-size: 0.85rem;
      color: rgba(var(--ink-tint), 0.55);
    }
  }
`;

export default function TransactionsPage(){

const [transactions,setTransactions]=useState([]);
const [loading,setLoading]=useState(true);

const loadTransactions=async()=>{

try{

const res=await api.get("/transactions");

// Precompute formatted date once per transaction, not per render per row.
const fmt = new Intl.DateTimeFormat(undefined, { dateStyle: "short" });
setTransactions((res.data||[]).map(t=>({
  ...t,
  dateFormatted: t.date ? fmt.format(new Date(t.date)) : "—",
})));

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

<style>{TX_MOBILE_CSS}</style>

<h1 className="tx-title text-2xl font-bold mb-6 text-white">
Transaktionen
</h1>

<Card className="tx-card p-4">

{loading ? (

<p className="text-gray-400">
Lade Transaktionen...
</p>

):(

<>

{/* Mobile-only: tappable card list replaces the table (display:none on desktop) */}
<ul className="tx-cards">

{transactions.length===0 && (
<li className="tx-empty">Keine Transaktionen vorhanden.</li>
)}

{transactions.map(t=>(
<li key={t.id} className="tx-row">
<div className="tx-row-main">
<p className="tx-row-desc">{t.description}</p>
<p className="tx-row-meta">{t.dateFormatted} · {t.category || "Unkategorisiert"}</p>
</div>
<span className={`tx-row-amount ${t.amount<0?"text-red-400":"text-green-400"}`}>
{t.amount} €
</span>
</li>
))}

</ul>

<table className="tx-table w-full text-left">

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
{t.dateFormatted}
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

</>

)}

</Card>

</PageLayout>

)

}
