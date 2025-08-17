
const Complaint = require('../models/Complaint');


exports.createComplaint = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      createdBy: req.user?.id || null,
    };
    const doc = await Complaint.create(payload);
    return res.status(201).json(doc);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};


exports.listComplaints = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      category,
      priority,
      assignee,
      q, 
      includeDeleted, 
      sort = '-createdAt',
    } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    if (assignee) filter.assignee = assignee;
    if (includeDeleted === 'true') filter.includeDeleted = true;

    if (q) filter.$text = { $search: q };

    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      Complaint.find(filter).sort(sort).skip(skip).limit(Number(limit)),
      Complaint.countDocuments(filter),
    ]);

    return res.json({
      items,
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};


exports.getComplaint = async (req, res) => {
  try {
    const doc = await Complaint.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Not found' });
    return res.json(doc);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};


exports.updateComplaint = async (req, res) => {
  try {
    
    const { _id, createdAt, updatedAt, createdBy, deletedAt, ...updates } = req.body;

    const doc = await Complaint.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!doc) return res.status(404).json({ error: 'Not found' });
    return res.json(doc);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};


exports.softDeleteComplaint = async (req, res) => {
  try {
    const doc = await Complaint.findByIdAndUpdate(
      req.params.id,
      { $set: { deletedAt: new Date() } },
      { new: true }
    );
    if (!doc) return res.status(404).json({ error: 'Not found' });
    return res.json({ ok: true, id: doc._id });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};


exports.restoreComplaint = async (req, res) => {
  try {
    const doc = await Complaint.findByIdAndUpdate(
      req.params.id,
      { $set: { deletedAt: null } },
      { new: true }
    );
    if (!doc) return res.status(404).json({ error: 'Not found' });
    return res.json(doc);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};


exports.updateStatus = async (req, res) => {
  try {
    const allowed = ['New', 'In Progress', 'On Hold', 'Resolved', 'Closed', 'Reopened'];
    const nextStatus = req.body.status;
    if (!allowed.includes(nextStatus)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const doc = await Complaint.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Not found' });

    
    if (['Resolved', 'Closed'].includes(nextStatus) && !req.body.resolution) {
      return res.status(400).json({ error: 'Resolution text required' });
    }

    doc.status = nextStatus;
    if (req.body.resolution) {
      doc.resolution = req.body.resolution; 
    }
    await doc.save();

    return res.json(doc);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};
