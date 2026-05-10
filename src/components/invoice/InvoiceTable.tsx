import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { InvoiceItem } from '@/types'

interface InvoiceTableProps {
  items: InvoiceItem[]
}

export default function InvoiceTable({ items }: InvoiceTableProps) {
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0)
  const tax = subtotal * 0.05
  const discount = 0
  const grandTotal = subtotal + tax - discount

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#F3F4F6]">
            <TableHead className="w-10 text-xs">#</TableHead>
            <TableHead className="text-xs">Category</TableHead>
            <TableHead className="text-xs">Description</TableHead>
            <TableHead className="text-xs">Qty/Details</TableHead>
            <TableHead className="text-xs text-right">Unit Cost</TableHead>
            <TableHead className="text-xs text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, idx) => (
            <TableRow key={item.id} className="text-sm">
              <TableCell className="text-[#6B7280]">{idx + 1}</TableCell>
              <TableCell>
                <span className="text-xs bg-[#F3F4F6] px-2 py-0.5 rounded-full text-[#6B7280]">
                  {item.category}
                </span>
              </TableCell>
              <TableCell className="text-[#1E1E1E]">{item.description}</TableCell>
              <TableCell className="text-[#6B7280] text-xs">{item.qty || '—'}</TableCell>
              <TableCell className="text-right text-[#1E1E1E]">${item.unitCost.toFixed(2)}</TableCell>
              <TableCell className="text-right font-medium">${item.amount.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5} className="text-right text-sm text-[#6B7280]">Subtotal</TableCell>
            <TableCell className="text-right text-sm">${subtotal.toFixed(2)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={5} className="text-right text-sm text-[#6B7280]">Tax (5%)</TableCell>
            <TableCell className="text-right text-sm">${tax.toFixed(2)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={5} className="text-right text-sm text-[#6B7280]">Discount</TableCell>
            <TableCell className="text-right text-sm">—</TableCell>
          </TableRow>
          <TableRow className="bg-[#1E1E1E]">
            <TableCell colSpan={5} className="text-right font-bold text-white text-base">Grand Total</TableCell>
            <TableCell className="text-right font-bold text-white text-base">${grandTotal.toFixed(2)}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}
