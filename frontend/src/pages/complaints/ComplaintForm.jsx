import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createComplaint, getComplaint, updateComplaint } from "../../api/complaints";

const empty = {
  title: "", description: "", category: "Billing", priority: "Low",
  customerName: "", customerEmail: ""
};

export default function ComplaintForm() {
  const { id } = useParams();
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    (async () => {
      try { setForm(await getComplaint(id)); }
      catch (e) { setError(e.message); }
    })();
  }, [id]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (id) await updateComplaint(id, form);
      else await createComplaint(form);
      navigate("/complaints");
    } catch (e) {
     
      const msg = e?.response?.data?.errors
        ? e.response.data.errors.map(x => x.msg).join(", ")
        : e.message;
      setError(msg || "Save failed");
    } finally { setSaving(false); }
  };

  const inputCls =
    "block w-full rounded-xl border border-slate-300 px-3 py-2 " +
    "focus:outline-none focus:ring-2 focus:ring-indigo-500";

  const labelCls = "text-sm font-medium text-slate-700";

  return (
    <form onSubmit={onSubmit} className="max-w-3xl mx-auto p-4 sm:p-6">
      
      <div className="bg-white shadow-sm rounded-2xl p-6">
        <h2 className="text-xl font-semibold">{id ? "Edit Complaint" : "New Complaint"}</h2>
        {error && (
          <div className="mt-4 rounded-xl bg-red-50 text-red-700 ring-1 ring-red-200 px-4 py-2">
            {error}
          </div>
        )}

   
        <div className="mt-6 rounded-2xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-800">Complaint details</h3>
          <div className="mt-4 grid gap-4">
            <div>
              <label className={labelCls}>Title (5–100 chars)</label>
              <input className={inputCls} name="title" value={form.title} onChange={onChange} required />
            </div>
            <div>
              <label className={labelCls}>Description (≥ 20 chars)</label>
              <textarea className={inputCls} rows={4} name="description" value={form.description} onChange={onChange} required />
            </div>
          </div>
        </div>

        
        <div className="mt-6 rounded-2xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-800">Classification</h3>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Category</label>
              <select className={inputCls} name="category" value={form.category} onChange={onChange}>
                {["Billing","Technical","Delivery","Other"].map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Priority</label>
              <select className={inputCls} name="priority" value={form.priority} onChange={onChange}>
                {["Low","Medium","High","Critical"].map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
          </div>
        </div>

        
        <div className="mt-6 rounded-2xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-800">Customer</h3>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Customer name</label>
              <input className={inputCls} name="customerName" value={form.customerName} onChange={onChange} required />
            </div>
            <div>
              <label className={labelCls}>Customer email</label>
              <input className={inputCls} type="email" name="customerEmail" value={form.customerEmail} onChange={onChange} required />
            </div>
          </div>
        </div>

        
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-xl border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-indigo-600 text-white px-5 py-2 hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? "Saving…" : id ? "Save" : "Create"}
          </button>
        </div>
      </div>
    </form>
  );
}
