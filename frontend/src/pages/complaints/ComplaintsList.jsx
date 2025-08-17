
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listComplaints, deleteComplaint } from "../../api/complaints";

function Badge({ children, color = "indigo" }) {
  const map = {
    indigo: "bg-indigo-50 text-indigo-700 ring-indigo-200",
    green: "bg-green-50 text-green-700 ring-green-200",
    amber: "bg-amber-50 text-amber-700 ring-amber-200",
    red: "bg-red-50 text-red-700 ring-red-200",
    sky: "bg-sky-50 text-sky-700 ring-sky-200",
    slate: "bg-slate-50 text-slate-700 ring-slate-200",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${map[color] || map.slate}`}>
      {children}
    </span>
  );
}

const statusColor = (s) => {
  switch (s) {
    case "New": return "sky";
    case "In Progress": return "indigo";
    case "On Hold": return "amber";
    case "Resolved": return "green";
    case "Closed": return "slate";
    case "Reopened": return "red";
    default: return "slate";
  }
};

export default function ComplaintsList() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const data = await listComplaints({ q, page: 1, limit: 30 });
      setItems(data.items || []);
      setErr("");
    } catch (e) {
      setErr(e.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load();  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header / actions in a box */}
      <div className="bg-white shadow-sm rounded-2xl p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <h2 className="text-xl font-semibold">Complaints</h2>
          <div className="flex gap-3 w-full sm:w-auto">
            <input
              className="flex-1 sm:w-72 rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Search…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && load()}
            />
            <button
              onClick={load}
              className="rounded-xl bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-700"
            >
              Search
            </button>
            <Link
              to="/complaints/new"
              className="rounded-xl bg-slate-900 text-white px-4 py-2 hover:bg-slate-800"
            >
              + New
            </Link>
          </div>
        </div>
      </div>

      {err && (
        <div className="bg-red-50 text-red-700 ring-1 ring-red-200 rounded-xl px-4 py-2 mb-4">
          {err}
        </div>
      )}

      
      {loading ? (
        <p className="text-slate-500">Loading…</p>
      ) : items.length === 0 ? (
        <div className="bg-white shadow-sm rounded-2xl p-10 text-center text-slate-500">
          No complaints yet. Click <span className="font-semibold">New</span> to create one.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((c) => (
            <div
              key={c._id}
              className="bg-white shadow-sm rounded-2xl p-5 flex flex-col h-full"
            >
              
              <Link
                to={`/complaints/${c._id}`}
                className="text-lg font-semibold text-slate-900 hover:text-indigo-700 line-clamp-2"
                title={c.title}
              >
                {c.title}
              </Link>

              
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge color="slate">{c.category}</Badge>
                <Badge color={c.priority === "Critical" ? "red" : c.priority === "High" ? "amber" : "indigo"}>
                  {c.priority}
                </Badge>
                <Badge color={statusColor(c.status)}>{c.status}</Badge>
              </div>

              
              <p className="mt-3 text-sm text-slate-600 line-clamp-3">{c.description}</p>

              
              <div className="mt-auto pt-4 flex items-center justify-between">
                <div className="text-xs text-slate-500">
                  {c.customerName} &middot; {c.customerEmail}
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    to={`/complaints/${c._id}/edit`}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={async () => {
                      if (window.confirm("Delete this complaint?")) {
                        await deleteComplaint(c._id);
                        load();
                      }
                    }}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
