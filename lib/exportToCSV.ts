export function exportToCSV(data: string[][], headers: string[], filename: string) {
  if (data.length === 0) {
    throw new Error("No data to export.");
  }

  const csvContent = [headers, ...data]
    .map(row => row.map((cell: string) => `"${cell}"`).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}