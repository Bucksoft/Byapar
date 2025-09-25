import { useParams } from "react-router-dom";

export default function PreviewExcel() {
  const { id } = useParams();
  const data = JSON.parse(sessionStorage.getItem(id) || "[]");

  if (!data.length) return <p>No data to preview</p>;

  const headers = Object.keys(data[0]);

  return (
    <div className="overflow-x-auto p-4">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {headers.map((h) => (
                <td key={h}>{row[h]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
