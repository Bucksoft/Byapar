const DashboardItemsSACCodePage = ({ data, setData }) => {
  return (
    <main className="border border-zinc-200 rounded-lg p-2">
      <div className="flex flex-col p-3 gap-2">
        <label htmlFor="SASCode" className="label text-zinc-700 text-xs">
          SAC Code
        </label>
        <input
          name="SACCode"
          value={data.SACCode}
          onChange={(e) =>
            setData((prev) => ({ ...prev, SACCode: e.target.value }))
          }
          type="text"
          placeholder="Enter SAC Code"
          className="input"
        />
      </div>
      <div className="flex flex-col p-3 gap-2">
        <label htmlFor="SASCode" className="label text-zinc-700 text-xs">
          Description
        </label>
        <textarea
          type="text"
          name="description"
          value={data.description}
          onChange={(e) =>
            setData((prev) => ({ ...prev, description: e.target.value }))
          }
          placeholder="Enter description"
          className="textarea w-full"
        />
      </div>
    </main>
  );
};

export default DashboardItemsSACCodePage;
