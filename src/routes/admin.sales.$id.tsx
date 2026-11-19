import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Printer, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { COMPANY, naira } from "@/lib/brand";
import { Logo } from "@/components/g10/logo";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/sales/$id")({ component: ReceiptPage });

function ReceiptPage() {
  const { id } = Route.useParams();
  const { data: s, isLoading } = useQuery({ queryKey: ["sale", id], queryFn: async () => (await supabase.from("sales").select("*").eq("id", id).maybeSingle()).data });
  const [qr, setQr] = useState("");
  useEffect(() => {
    if (!s) return;
    QRCode.toDataURL(`${COMPANY.name}\nReceipt: ${s.receipt_no}\nBuyer: ${s.buyer_name}\nProperty: ${s.property_code ?? "-"}\nPaid: ${naira(s.amount_paid)}\nDate: ${s.sale_date}`, { margin: 1, width: 160 }).then(setQr);
  }, [s]);
  if (isLoading) return <p className="text-muted-foreground">Loading…</p>;
  if (!s) return <p>Receipt not found.</p>;
  const balance = Math.max(0, Number(s.amount) - Number(s.amount_paid));
  const rows: [string, string][] = [
    ["Buyer name", s.buyer_name], ["Buyer phone", s.buyer_phone], ...(s.buyer_address ? [["Address", s.buyer_address] as [string, string]] : []),
    ["Property ref.", s.property_code ?? "—"], ["Property", s.property_title ?? "—"], ["Plot / Unit", s.plot_details ?? "—"],
    ["Payment method", s.payment_method === "installment" ? `Installment${s.months ? ` · ${s.months} months` : ""}` : "Full payment"],
    ["Total price", naira(s.amount)], ["Amount paid", naira(s.amount_paid)], ["Balance", naira(balance)],
    ...(s.monthly ? [["Monthly installment", naira(s.monthly)] as [string, string]] : []),
  ];
  return (
    <div>
      <div className="no-print mb-4 flex gap-2">
        <Button asChild variant="outline"><Link to="/admin/sales"><ArrowLeft /> Back</Link></Button>
        <Button onClick={() => window.print()}><Printer /> Print receipt</Button>
      </div>
      <div className="receipt-a4 mx-auto bg-card p-10 text-foreground shadow-card" style={{ width: "210mm", minHeight: "297mm", maxWidth: "100%" }}>
        <div className="flex items-center gap-4 border-b-4 border-primary pb-4">
          <Logo className="h-24 w-24" />
          <div className="flex-1">
            <div className="font-display text-2xl font-extrabold text-primary-deep">{COMPANY.name}</div>
            <div className="text-sm italic text-gold">{COMPANY.motto}</div>
            <div className="text-sm text-muted-foreground">{COMPANY.address} · {COMPANY.phoneDisplay}</div>
          </div>
        </div>
        <div className="mt-6 flex items-start justify-between">
          <div><div className="font-display text-xl font-bold tracking-wider text-primary-deep">SALES RECEIPT</div>
            <div className="mt-1 font-mono text-sm">No: <b>{s.receipt_no}</b></div>
            <div className="text-sm">Date: {s.sale_date}</div></div>
          {qr && <img src={qr} alt="Receipt QR code" className="h-28 w-28" />}
        </div>
        <table className="mt-6 w-full border-collapse text-sm">
          <tbody>{rows.map(([k, v]) => (
            <tr key={k} className="border-b"><td className="w-1/3 py-2 pr-4 font-semibold text-muted-foreground">{k}</td><td className="py-2">{v}</td></tr>
          ))}</tbody>
        </table>
        {s.notes && <p className="mt-4 text-sm"><b>Notes:</b> {s.notes}</p>}
        <p className="mt-6 text-xs text-muted-foreground">This receipt confirms payment received by {COMPANY.name}. Please keep it safe for documentation and future payments.</p>
        <div className="mt-24 grid grid-cols-2 gap-16 text-center text-sm">
          <div><div className="border-t border-foreground pt-2 font-semibold">Buyer's signature</div><div className="text-xs text-muted-foreground">{s.buyer_name}</div></div>
          <div><div className="border-t border-foreground pt-2 font-semibold">For {COMPANY.short}</div><div className="text-xs text-muted-foreground">Authorised signatory & stamp</div></div>
        </div>
      </div>
    </div>
  );
}
