var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_crypto = __toESM(require("crypto"), 1);
var import_vite = require("vite");
var import_path = __toESM(require("path"), 1);
var import_socket = require("socket.io");
var import_http = require("http");
var import_storage = require("@google-cloud/storage");
async function startServer() {
  const app = (0, import_express.default)();
  const httpServer = (0, import_http.createServer)(app);
  const io = new import_socket.Server(httpServer, {
    cors: {
      origin: "*"
    }
  });
  const PORT = 3e3;
  const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "biocraftflow_secret_key_32_bytes_len";
  const IV_LENGTH = 16;
  function encrypt(text) {
    if (text.startsWith("encrypted:")) return text;
    const key = Buffer.concat([Buffer.from(ENCRYPTION_KEY), Buffer.alloc(32)], 32);
    const iv = import_crypto.default.randomBytes(IV_LENGTH);
    const cipher = import_crypto.default.createCipheriv("aes-256-cbc", key, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return "encrypted:" + iv.toString("hex") + ":" + encrypted.toString("hex");
  }
  function decrypt(text) {
    if (!text.startsWith("encrypted:")) return text;
    try {
      const parts = text.split(":");
      const iv = Buffer.from(parts[1], "hex");
      const encryptedText = Buffer.from(parts[2], "hex");
      const key = Buffer.concat([Buffer.from(ENCRYPTION_KEY), Buffer.alloc(32)], 32);
      const decipher = import_crypto.default.createDecipheriv("aes-256-cbc", key, iv);
      let decrypted = decipher.update(encryptedText);
      decrypted = Buffer.concat([decrypted, decipher.final()]);
      return decrypted.toString();
    } catch (err) {
      console.error("Failed to decrypt GCS key:", err);
      return text;
    }
  }
  let storage = null;
  if (process.env.GCP_PROJECT_ID && process.env.GCP_CLIENT_EMAIL && process.env.GCP_PRIVATE_KEY) {
    try {
      storage = new import_storage.Storage({
        projectId: process.env.GCP_PROJECT_ID,
        credentials: {
          client_email: process.env.GCP_CLIENT_EMAIL,
          private_key: process.env.GCP_PRIVATE_KEY.replace(/\\n/g, "\n")
        }
      });
      console.log("Google Cloud Storage initialized.");
    } catch (err) {
      console.error("Failed to initialize GCS:", err);
    }
  }
  app.use(import_express.default.json({ limit: "50mb" }));
  app.use(import_express.default.urlencoded({ limit: "50mb", extended: true }));
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
  });
  const userRoles = {
    "u1": "Sales",
    "u2": "Factory",
    "u3": "Admin",
    "u4": "Factory"
  };
  let cases = [
    {
      id: "uuid-draft-1",
      case_id: "",
      internal_case_number: "DRF-2026-0001",
      created_by_sales_id: "u1",
      created_by_id: "u1",
      sales_person_id: "u1",
      created_by_name: "Ravi Kumar",
      factory_person_id: "u2",
      doctor_name: "Dr. John Doe",
      hospital_name: "City Clinic",
      patient_full_name: "Jane Smith",
      patient_age: 30,
      patient_gender: "Female",
      patient_contact: "+91 00000 00000",
      implant_material_type: "Mandible Implant",
      urgency: "Routine",
      status: "case_created",
      is_draft: true,
      payment_status: "Pending",
      created_at: (/* @__PURE__ */ new Date()).toISOString(),
      updated_at: (/* @__PURE__ */ new Date()).toISOString(),
      design_submissions: [],
      qc_checklist: { dimensions: false, surfaceFinish: false, materialIntegrity: false, packaging: false, labeling: false },
      timestamps: { "case_created": (/* @__PURE__ */ new Date()).toISOString() }
    },
    {
      id: "uuid-1",
      case_id: "FCT-2026-042",
      internal_case_number: "IMP-2026-0001",
      created_by_sales_id: "u1",
      sales_person_id: "u1",
      created_by_name: "Ravi Kumar",
      factory_person_id: "u2",
      doctor_name: "Dr. Priya Mehta",
      hospital_name: "Apollo Hospitals, Mumbai",
      patient_full_name: "Arvind Nair",
      patient_age: 47,
      patient_gender: "Male",
      patient_contact: "+91 98765 43210",
      implant_material_type: "Titanium Hip Replacement",
      urgency: "Urgent",
      status: "case_created",
      payment_status: "Pending",
      created_at: "2026-04-15T09:30:00Z",
      updated_at: "2026-04-15T09:30:00Z",
      design_submissions: [],
      qc_checklist: {
        dimensions: true,
        surfaceFinish: true,
        materialIntegrity: true,
        packaging: false,
        labeling: false
      },
      timestamps: {
        "case_created": "2026-04-15T09:30:00Z"
      }
    },
    {
      id: "uuid-2",
      case_id: "FCT-2026-045",
      internal_case_number: "IMP-2026-0002",
      created_by_sales_id: "u1",
      sales_person_id: "u1",
      created_by_name: "Ravi Kumar",
      factory_person_id: "u2",
      doctor_name: "Dr. Rajesh Khanna",
      hospital_name: "Fortis Hospital, Delhi",
      patient_full_name: "Suman Lata",
      patient_age: 52,
      patient_gender: "Female",
      patient_contact: "+91 98765 43211",
      implant_material_type: "Cranial Mesh",
      urgency: "Routine",
      status: "implant_designing",
      payment_status: "Approved",
      created_at: "2026-04-16T10:00:00Z",
      updated_at: "2026-04-16T10:00:00Z",
      design_submissions: [],
      qc_checklist: {
        dimensions: false,
        surfaceFinish: false,
        materialIntegrity: false,
        packaging: false,
        labeling: false
      },
      timestamps: {
        "case_created": "2026-04-16T10:00:00Z",
        "dicom_processing_started": "2026-04-16T11:00:00Z",
        "dicom_processing_completed": "2026-04-16T13:00:00Z",
        "defects_sent_to_doctor": "2026-04-16T14:00:00Z",
        "payment_confirmed": "2026-04-16T15:30:00Z"
      }
    },
    {
      id: "uuid-3",
      case_id: "FCT-2026-010",
      internal_case_number: "IMP-2026-0010",
      created_by_sales_id: "u1",
      sales_person_id: "u1",
      created_by_name: "Ravi Kumar",
      factory_person_id: "u2",
      doctor_name: "Dr. Sameer Gupta",
      hospital_name: "Max Healthcare, Gurgaon",
      patient_full_name: "Meera Bai",
      patient_age: 65,
      patient_gender: "Female",
      patient_contact: "+91 98765 43215",
      implant_material_type: "PEEK Spinal Cage",
      urgency: "Routine",
      status: "case_closed",
      payment_status: "Approved",
      created_at: "2026-04-10T09:00:00Z",
      updated_at: "2026-04-15T10:00:00Z",
      case_closed_at: "2026-04-15T10:00:00Z",
      design_submissions: [],
      qc_checklist: { dimensions: true, surfaceFinish: true, materialIntegrity: true, packaging: true, labeling: true },
      timestamps: {
        "case_created": "2026-04-10T09:00:00Z",
        "case_closed": "2026-04-15T10:00:00Z"
      }
    },
    {
      id: "uuid-4",
      case_id: "FCT-2026-001",
      internal_case_number: "IMP-2026-0001",
      created_by_sales_id: "u1",
      sales_person_id: "u1",
      created_by_name: "Ravi Kumar",
      factory_person_id: "u2",
      doctor_name: "Dr. Amit Shah",
      hospital_name: "Lilavati Hospital, Mumbai",
      patient_full_name: "Karan Johar",
      patient_age: 45,
      patient_gender: "Male",
      patient_contact: "+91 98765 43200",
      implant_material_type: "Titanium Mandible",
      urgency: "Urgent",
      status: "case_closed",
      payment_status: "Approved",
      created_at: "2026-04-01T08:00:00Z",
      updated_at: "2026-04-05T12:00:00Z",
      case_closed_at: "2026-04-05T12:00:00Z",
      design_submissions: [],
      qc_checklist: { dimensions: true, surfaceFinish: true, materialIntegrity: true, packaging: true, labeling: true },
      timestamps: {
        "case_created": "2026-04-01T08:00:00Z",
        "case_closed": "2026-04-05T12:00:00Z"
      }
    }
  ];
  let logs = [
    { id: "l1", case_id: "FCT-2026-042", actor_id: "u1", actor_name: "Ravi Kumar", actor_role: "Sales", event_type: "user_action", action_description: "Case Created", created_at: "2026-04-15T09:30:00Z", reason: "Section I-V completed" },
    { id: "l2", case_id: "FCT-2026-042", actor_id: "u2", actor_name: "Farhan Mirza", actor_role: "Factory", event_type: "status_change", action_description: "DICOM Started", created_at: "2026-04-15T10:15:00Z", previous_value: "case_created", new_value: "dicom_processing_started" },
    { id: "l3", case_id: "FCT-2026-042", actor_id: "u2", actor_name: "Farhan Mirza", actor_role: "Factory", event_type: "status_change", action_description: "DICOM Completed", created_at: "2026-04-15T11:45:00Z", previous_value: "dicom_processing_started", new_value: "dicom_processing_completed" }
  ];
  let notifications = [
    { id: "n1", user_id: "u1", case_id: "FCT-2026-042", channel: "whatsapp", title: "Defect Sent", body: "Defect details for Case FCT-2026-042 have been sent to Dr. Priya Mehta.", sent_at: "2026-04-15T12:30:00Z", is_read: true },
    { id: "n2", user_id: "u3", case_id: "FCT-2026-042", channel: "in_app", title: "Payment Review", body: "Payment proof submitted for Case FCT-2026-042.", sent_at: "2026-04-15T13:00:00Z", is_read: false }
  ];
  app.post("/api/validate-access", (req, res) => {
    const { userId, section, role: clientRole } = req.body;
    if (userId && clientRole) {
      userRoles[userId] = clientRole;
    }
    const role = userRoles[userId] || clientRole;
    if (!role) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const adminSections = ["overview", "payment", "users", "cases", "completed", "archive", "logs", "analytics", "notifications", "profile"];
    const factorySections = ["tasks", "cases", "completed", "archive", "whatsapp", "notifications", "profile"];
    const salesSections = ["cases", "new", "drafts", "payment", "completed", "archive", "whatsapp", "notifications", "profile"];
    let hasAccess = false;
    if (role === "Admin") {
      hasAccess = true;
    } else if (role === "Factory") {
      hasAccess = factorySections.includes(section);
    } else if (role === "Sales") {
      hasAccess = salesSections.includes(section);
    }
    if (hasAccess) {
      res.json({ allowed: true, role });
    } else {
      res.status(403).json({ allowed: false, error: "Insufficient permissions" });
    }
  });
  app.get("/api/cases", (req, res) => {
    res.json(cases);
  });
  app.post("/api/cases", (req, res) => {
    const newCase = req.body;
    cases.push(newCase);
    io.emit("caseCreated", newCase);
    res.status(201).json(newCase);
  });
  app.put("/api/cases/:id", (req, res) => {
    const { id } = req.params;
    const updatedCase = req.body;
    const index = cases.findIndex((c) => c.id === id);
    if (index !== -1) {
      cases[index] = updatedCase;
      io.emit("caseUpdated", updatedCase);
      res.json(updatedCase);
    } else {
      res.status(404).json({ error: "Case not found" });
    }
  });
  app.delete("/api/cases/:id", (req, res) => {
    const { id } = req.params;
    cases = cases.filter((c) => c.id !== id);
    io.emit("caseDeleted", id);
    res.status(204).send();
  });
  app.get("/api/logs", (req, res) => {
    res.json(logs);
  });
  app.post("/api/logs", (req, res) => {
    const log = req.body;
    logs.unshift(log);
    io.emit("logCreated", log);
    res.status(201).json(log);
  });
  app.get("/api/notifications", (req, res) => {
    res.json(notifications);
  });
  app.post("/api/notifications", (req, res) => {
    const notif = req.body;
    notifications.unshift(notif);
    io.emit("notificationCreated", notif);
    res.status(201).json(notif);
  });
  app.put("/api/notifications/:id/read", (req, res) => {
    const { id } = req.params;
    const index = notifications.findIndex((n) => n.id === id);
    if (index !== -1) {
      notifications[index].is_read = true;
      res.json(notifications[index]);
    } else {
      res.status(404).json({ error: "Notification not found" });
    }
  });
  app.post("/api/gcs/signed-url", async (req, res) => {
    const { fileName, contentType, gcsConfig, uploadType } = req.body;
    let activeStorage = storage;
    let bucketName = process.env.GCS_BUCKET_NAME;
    const typeEnvMap = {
      dicom: process.env.GCS_BUCKET_NAME_DICOM,
      design: process.env.GCS_BUCKET_NAME_DESIGN,
      payment: process.env.GCS_BUCKET_NAME_PAYMENT,
      qc: process.env.GCS_BUCKET_NAME_QC,
      avatar: process.env.GCS_BUCKET_NAME_AVATAR
    };
    if (uploadType && typeEnvMap[uploadType]) {
      bucketName = typeEnvMap[uploadType];
    }
    if (gcsConfig && gcsConfig.gcs_project_id && gcsConfig.gcs_client_email && gcsConfig.gcs_private_key) {
      try {
        const decryptedKey = decrypt(gcsConfig.gcs_private_key);
        activeStorage = new import_storage.Storage({
          projectId: gcsConfig.gcs_project_id,
          credentials: {
            client_email: gcsConfig.gcs_client_email,
            private_key: decryptedKey.replace(/\\n/g, "\n")
          }
        });
        const typeConfigMap = {
          dicom: gcsConfig.gcs_bucket_name_dicom,
          design: gcsConfig.gcs_bucket_name_design,
          payment: gcsConfig.gcs_bucket_name_payment,
          qc: gcsConfig.gcs_bucket_name_qc,
          avatar: gcsConfig.gcs_bucket_name_avatar
        };
        const targetBucket = uploadType ? typeConfigMap[uploadType] : void 0;
        bucketName = targetBucket || gcsConfig.gcs_bucket_name || gcsConfig.gcs_bucket_name_dicom;
      } catch (err) {
        console.error("Failed to initialize custom GCS:", err);
        return res.status(400).json({ error: "Failed to connect using your GCS credentials." });
      }
    }
    if (!activeStorage) {
      return res.status(503).json({ error: "GCS service not configured on server and no profile configuration found." });
    }
    if (!bucketName) {
      return res.status(400).json({ error: "Bucket name is required for upload. Please configure GCS buckets." });
    }
    try {
      const bucket = activeStorage.bucket(bucketName);
      const file = bucket.file(fileName);
      const [url] = await file.getSignedUrl({
        version: "v4",
        action: "write",
        expires: Date.now() + 15 * 60 * 1e3,
        // 15 minutes
        contentType
      });
      res.json({ url, publicUrl: `https://storage.googleapis.com/${bucketName}/${fileName}` });
    } catch (err) {
      console.error("Error generating signed URL:", err);
      res.status(500).json({ error: "Failed to generate upload URL" });
    }
  });
  app.post("/api/gcs/encrypt-key", (req, res) => {
    const { privateKey } = req.body;
    if (!privateKey) {
      return res.status(400).json({ error: "Private key is required." });
    }
    const encrypted = encrypt(privateKey);
    res.json({ encrypted });
  });
  app.put("/api/user/profile", async (req, res) => {
    const updatedUser = req.body;
    let backupSuccess = false;
    let backupMessage = "";
    let activeStorage = storage;
    let bucketName = process.env.GCS_BUCKET_NAME_AVATAR || process.env.GCS_BUCKET_NAME;
    const gcsConfig = updatedUser.gcs_config;
    if (gcsConfig && gcsConfig.gcs_project_id && gcsConfig.gcs_client_email && gcsConfig.gcs_private_key) {
      try {
        const decryptedKey = decrypt(gcsConfig.gcs_private_key);
        activeStorage = new import_storage.Storage({
          projectId: gcsConfig.gcs_project_id,
          credentials: {
            client_email: gcsConfig.gcs_client_email,
            private_key: decryptedKey.replace(/\\n/g, "\n")
          }
        });
        bucketName = gcsConfig.gcs_bucket_name_avatar || gcsConfig.gcs_bucket_name || gcsConfig.gcs_bucket_name_dicom;
      } catch (err) {
        console.error("Failed to parse custom GCS config for profile backup:", err);
      }
    }
    if (activeStorage && bucketName) {
      try {
        const bucket = activeStorage.bucket(bucketName);
        const fileName = `profiles/usr_${updatedUser.id}.json`;
        const file = bucket.file(fileName);
        const safeUserToSave = { ...updatedUser };
        if (safeUserToSave.gcs_config) {
          safeUserToSave.gcs_config = {
            ...safeUserToSave.gcs_config,
            gcs_private_key: "[REDACTED_FOR_SECURITY]"
          };
        }
        await file.save(JSON.stringify(safeUserToSave, null, 2), {
          contentType: "application/json",
          resumable: false,
          metadata: {
            cacheControl: "no-cache"
          }
        });
        backupSuccess = true;
        backupMessage = `Backed up to GCS bucket: ${bucketName}/${fileName}`;
        console.log(`User profile backup successful: ${fileName}`);
      } catch (err) {
        console.error("Failed to backup user profile to GCS:", err);
        backupMessage = "Failed to write JSON backup to GCS bucket.";
      }
    } else {
      backupMessage = "GCS backup omitted: GCS storage is not configured.";
    }
    res.json({
      success: true,
      user: updatedUser,
      gcsBackup: {
        success: backupSuccess,
        message: backupMessage
      }
    });
  });
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
