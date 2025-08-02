import { useEffect, useState } from "react";

export default function Scanner() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/sheets")
      .then((res) => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const updateKondisi = async (rowIndex, newKondisi) => {
    const res = await fetch("/api/sheets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rowIndex, kondisi: newKondisi }),
    });

    if (res.ok) {
      const newData = [...data];
      newData[rowIndex][3] = newKondisi;
      setData(newData);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Scanner Inventaris</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Nama Barang</th>
            <th className="p-2 border">Lokasi</th>
            <th className="p-2 border">Kode</th>
            <th className="p-2 border">Kondisi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx}>
              <td className="p-2 border">{row[0]}</td>
              <td className="p-2 border">{row[1]}</td>
              <td className="p-2 border">{row[2]}</td>
              <td className="p-2 border">
                <select
                  value={row[3] || ""}
                  onChange={(e) => updateKondisi(idx, e.target.value)}
                  className="border px-2 py-1 rounded"
                >
                  <option value="">Pilih</option>
                  <option value="Baik">Baik</option>
                  <option value="Rusak">Rusak</option>
                  <option value="Hilang">Hilang</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
