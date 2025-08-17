import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getComplaint, updateComplaintStatus } from "../../api/complaints";

export default function ComplaintDetail() {
  const { id } = useParams();
  const [c, setC] = useState(null);
  const [status, setStatus] = useState("New");
  const [resolution, setResolution] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const data = await getComplaint(id);
      setC(data);
      setStatus(data.status);
      setError("");
    } catch (e) { setError(e.message); }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  const applyStatus = async () => {
    try { await updateComplaintStatus(id, status, resolution); load(); }
    catch (e) { setError(e.message); }
  };

  if (!c) return <div style={{ padding: 20 }}>{error || "Loading..."}</div>;

  return (
    <div style={{ maxWidth: 800, margin: "2rem auto" }}>
      <h2>{c.title}</h2>
      <p><strong>Category:</strong> {c.category} &nbsp; <strong>Priority:</strong> {c.priority}</p>
      <p><strong>Status:</strong> {c.status}</p>
      <p><strong>Customer:</strong> {c.customerName} &lt;{c.customerEmail}&gt;</p>
      <p><strong>Description:</strong> {c.description}</p>

      <div style={{ borderTop:"1px solid #ddd", marginTop:16, paddingTop:12 }}>
        <h3>Update Status</h3>
        <select value={status} onChange={e=>setStatus(e.target.value)}>
          {["New","In Progress","On Hold","Resolved","Closed","Reopened"].map(s => <option key={s}>{s}</option>)}
        </select>
        {(status === "Resolved" || status === "Closed") && (
          <input placeholder="Resolution text" value={resolution} onChange={e=>setResolution(e.target.value)} />
        )}
        <button onClick={applyStatus}>Apply</button>
      </div>

      <p style={{ marginTop: 16 }}>
        <Link to={`/complaints/${c._id}/edit`}>Edit</Link> &nbsp;|&nbsp;
        <Link to="/complaints">Back to list</Link>
      </p>
      {error && <p style={{ color:"crimson" }}>{error}</p>}
    </div>
  );
}
