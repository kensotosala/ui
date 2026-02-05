import { AguinaldoTable } from "@/app/features/aguinaldos/components/aguinaldo-table/AdminAguinaldosTable";

export default function AguinaldosAdminPage() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="container mx-auto px-4 py-8">
      <AguinaldoTable anio={currentYear} />
    </div>
  );
}
