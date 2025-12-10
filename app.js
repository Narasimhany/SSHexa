const templates = [
  {
    id: "import",
    title: "Import movies",
    level: "basic",
    description: "Register raw movies with pixel size and optics grouping.",
    fields: [
      { name: "dataPath", label: "Movies path (glob)", type: "text", placeholder: "/data/*.mrc", required: true },
      { name: "pixelSize", label: "Pixel size (Å)", type: "number", step: "0.01", placeholder: "0.8", required: true },
      { name: "opticsGroup", label: "Optics group", type: "text", placeholder: "optics_01", required: true },
      { name: "notes", label: "Notes", type: "textarea", placeholder: "Describe acquisition settings..." }
    ]
  },
  {
    id: "motion",
    title: "Motion correction",
    level: "basic",
    description: "Run MotionCor2 or RELION's own algorithm to align movie frames.",
    fields: [
      { name: "program", label: "Program", type: "select", options: ["MotionCor2", "RELION"], required: true },
      { name: "patchSize", label: "Patch size (px)", type: "text", placeholder: "5x5" },
      { name: "dosePerFrame", label: "Dose per frame (e-/Å²)", type: "number", step: "0.01", placeholder: "1.0" },
      { name: "outputs", label: "Outputs", type: "text", placeholder: "aligned.mrc, dose-weighted.mrc" }
    ]
  },
  {
    id: "ctf",
    title: "CTF estimation",
    level: "basic",
    description: "Estimate defocus values for each micrograph using CTFFIND or Gctf.",
    fields: [
      { name: "program", label: "Program", type: "select", options: ["CTFFIND", "Gctf"], required: true },
      { name: "defocusRange", label: "Defocus range (µm)", type: "text", placeholder: "0.5-2.0" },
      { name: "voltage", label: "Voltage (kV)", type: "number", step: "10", placeholder: "300" },
      { name: "amplitudeContrast", label: "Amplitude contrast", type: "number", step: "0.01", placeholder: "0.1" }
    ]
  },
  {
    id: "picking",
    title: "Auto-picking",
    level: "basic",
    description: "Automatically pick particles using Laplacian-of-Gaussian or a trained model.",
    fields: [
      { name: "method", label: "Method", type: "select", options: ["LoG", "Topaz", "Template"], required: true },
      { name: "estimatedDiameter", label: "Estimated diameter (Å)", type: "number", step: "1", placeholder: "150" },
      { name: "threshold", label: "Threshold", type: "number", step: "0.1", placeholder: "-1.5" },
      { name: "references", label: "Reference templates/model", type: "text", placeholder: "templates.star" }
    ]
  },
  {
    id: "extraction",
    title: "Particle extraction",
    level: "basic",
    description: "Box particles and create a particle set STAR file.",
    fields: [
      { name: "boxSize", label: "Box size (px)", type: "number", step: "1", placeholder: "320" },
      { name: "binning", label: "Binning factor", type: "number", step: "0.1", placeholder: "1" },
      { name: "starInput", label: "Input micrographs STAR", type: "text", placeholder: "micrographs_ctf.star", required: true },
      { name: "applyCTF", label: "Apply CTF", type: "select", options: ["Yes", "No"] }
    ]
  },
  {
    id: "class2d",
    title: "2D classification",
    level: "advanced",
    description: "Cluster particles into 2D classes to assess data quality.",
    fields: [
      { name: "numberClasses", label: "Number of classes", type: "number", step: "1", placeholder: "200", required: true },
      { name: "tau2fudge", label: "Tau2 fudge", type: "number", step: "0.1", placeholder: "2" },
      { name: "maskDiameter", label: "Mask diameter (Å)", type: "number", step: "1", placeholder: "200" },
      { name: "particleSet", label: "Particle set", type: "text", placeholder: "particles.star", required: true }
    ]
  },
  {
    id: "class3d",
    title: "3D classification",
    level: "advanced",
    description: "Separate structural states using 3D initial model and alignment.",
    fields: [
      { name: "initialModel", label: "Initial model", type: "text", placeholder: "initial.mrc", required: true },
      { name: "numberClasses", label: "Number of classes", type: "number", step: "1", placeholder: "4" },
      { name: "angularSampling", label: "Angular sampling", type: "text", placeholder: "7.5 degrees" },
      { name: "regularization", label: "Regularization (T)", type: "number", step: "0.1", placeholder: "4" }
    ]
  },
  {
    id: "refine",
    title: "3D auto-refine",
    level: "advanced",
    description: "High-resolution refinement with gold-standard splitting.",
    fields: [
      { name: "inputParticles", label: "Input particles", type: "text", placeholder: "selected_particles.star", required: true },
      { name: "mask", label: "Mask", type: "text", placeholder: "refine_mask.mrc" },
      { name: "symmetry", label: "Symmetry", type: "text", placeholder: "C1" },
      { name: "ctfRefinement", label: "CTF refinement", type: "select", options: ["Off", "Yes, per-particle", "Yes, per-micrograph"] }
    ]
  },
  {
    id: "postprocessing",
    title: "Post-processing",
    level: "advanced",
    description: "Apply sharpening, masking, and generate FSC curves for the final map.",
    fields: [
      { name: "finalMap", label: "Final map", type: "text", placeholder: "refine_run.mrc", required: true },
      { name: "autoBfactor", label: "Auto-B factor", type: "select", options: ["Enabled", "Disabled"] },
      { name: "mask", label: "Mask (optional)", type: "text", placeholder: "mask.mrc" },
      { name: "resolutionLimit", label: "Resolution limit (Å)", type: "number", step: "0.1", placeholder: "2.5" }
    ]
  },
  {
    id: "ctfrefine",
    title: "CTF refinement",
    level: "advanced",
    description: "Improve per-particle CTF parameters including defocus and beam tilt.",
    fields: [
      { name: "inputParticles", label: "Input particles", type: "text", placeholder: "particles.star", required: true },
      { name: "modes", label: "Refinement modes", type: "text", placeholder: "defocus, anisotropic magnification" },
      { name: "iterations", label: "Iterations", type: "number", step: "1", placeholder: "2" },
      { name: "micrographMetadata", label: "Micrograph metadata", type: "text", placeholder: "micrographs_ctf.star" }
    ]
  },
  {
    id: "polish",
    title: "Particle polishing",
    level: "advanced",
    description: "Bayesian polishing of particle trajectories for improved resolution.",
    fields: [
      { name: "movies", label: "Movies", type: "text", placeholder: "aligned/*.mrc", required: true },
      { name: "particleMeta", label: "Particle metadata", type: "text", placeholder: "particles.star", required: true },
      { name: "frameRange", label: "Frame range", type: "text", placeholder: "1-40" },
      { name: "doseModel", label: "Dose model", type: "select", options: ["Yes", "No"] }
    ]
  },
  {
    id: "localrefine",
    title: "Local refinement",
    level: "advanced",
    description: "Focused refinement around a mask to improve local features.",
    fields: [
      { name: "inputParticles", label: "Input particles", type: "text", placeholder: "ctf_refined.star", required: true },
      { name: "focusMask", label: "Focus mask", type: "text", placeholder: "focus_mask.mrc", required: true },
      { name: "symmetry", label: "Symmetry", type: "text", placeholder: "C1" },
      { name: "angularSampling", label: "Angular sampling", type: "text", placeholder: "1.8 degrees" }
    ]
  },
  {
    id: "maptools",
    title: "Map sharpening",
    level: "advanced",
    description: "Sharpen, filter, and evaluate final map quality.",
    fields: [
      { name: "inputMap", label: "Input map", type: "text", placeholder: "postprocess.mrc", required: true },
      { name: "bFactor", label: "B-factor", type: "number", step: "1", placeholder: "-80" },
      { name: "applyMask", label: "Apply mask", type: "select", options: ["Yes", "No"] },
      { name: "fscCurve", label: "FSC curve", type: "text", placeholder: "fsc.txt" }
    ]
  }
];

const taskCards = document.getElementById("taskCards");
const queue = document.getElementById("queue");
const workflowSummary = document.getElementById("workflowSummary");
const createPipeline = document.getElementById("createPipeline");
const clearPipeline = document.getElementById("clearPipeline");
const exportPipeline = document.getElementById("exportPipeline");
const loadStarter = document.getElementById("loadStarter");
const emptyState = document.getElementById("emptyState");
const basicCount = document.getElementById("basicCount");
const advancedCount = document.getElementById("advancedCount");
const paramCount = document.getElementById("paramCount");

const pipelineDraft = [];

function createField(field) {
  const wrapper = document.createElement("div");
  const label = document.createElement("label");
  label.textContent = field.label;
  label.setAttribute("for", `${field.id}-${field.name}`);

  let input;
  if (field.type === "select") {
    input = document.createElement("select");
    field.options.forEach((opt) => {
      const option = document.createElement("option");
      option.value = opt;
      option.textContent = opt;
      input.appendChild(option);
    });
  } else if (field.type === "textarea") {
    input = document.createElement("textarea");
    input.placeholder = field.placeholder || "";
  } else {
    input = document.createElement("input");
    input.type = field.type || "text";
    input.placeholder = field.placeholder || "";
    if (field.step) input.step = field.step;
  }

  if (field.required) {
    input.required = true;
    input.ariaRequired = "true";
  }

  input.id = `${field.id}-${field.name}`;
  input.name = field.name;
  wrapper.append(label, input);
  return wrapper;
}

function renderCards() {
  templates.forEach((task) => {
    const card = document.createElement("div");
    card.className = "card";

    const meta = document.createElement("div");
    meta.className = "task-meta";
    const title = document.createElement("h3");
    title.textContent = task.title;
    const tag = document.createElement("span");
    tag.className = `tag ${task.level === "advanced" ? "tag--advanced" : ""}`;
    tag.textContent = task.level === "advanced" ? "Advanced" : "Basic";
    meta.append(title, tag);

    const desc = document.createElement("p");
    desc.textContent = task.description;

    const form = document.createElement("form");
    form.dataset.taskId = task.id;
    form.dataset.title = task.title;

    task.fields.forEach((field) => {
      const fieldNode = createField({ ...field, id: task.id });
      form.appendChild(fieldNode);
    });

    const submit = document.createElement("button");
    submit.type = "submit";
    submit.className = "btn btn--primary";
    submit.textContent = "Add to queue";
    form.appendChild(submit);

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const values = {};
      formData.forEach((value, key) => {
        values[key] = value;
      });
      addTaskToQueue(task.title, task.level, values);
      form.reset();
    });

    card.append(meta, desc, form);
    taskCards.appendChild(card);
  });
}

function addTaskToQueue(title, level, values) {
  const id = crypto.randomUUID();
  const entry = { id, title, level, values };
  pipelineDraft.push(entry);
  renderQueue();
}

function removeTask(id) {
  const index = pipelineDraft.findIndex((item) => item.id === id);
  if (index !== -1) {
    pipelineDraft.splice(index, 1);
    renderQueue();
  }
}

function renderQueue() {
  queue.innerHTML = "";
  if (pipelineDraft.length === 0) {
    emptyState.hidden = false;
  } else {
    emptyState.hidden = true;
  }

  pipelineDraft.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "queue__item";

    const heading = document.createElement("div");
    heading.className = "queue__header";
    const title = document.createElement("h4");
    title.textContent = `${index + 1}. ${item.title}`;

    const removeButton = document.createElement("button");
    removeButton.className = "btn btn--ghost";
    removeButton.type = "button";
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", () => removeTask(item.id));

    heading.append(title, removeButton);

    const meta = document.createElement("div");
    meta.className = "queue__meta";
    meta.innerHTML = `<span class="pill ${item.level === "advanced" ? "pill--advanced" : ""}">${
      item.level === "advanced" ? "Advanced" : "Basic"
    }</span> <span>${Object.keys(item.values).length} parameters</span>`;

    const list = document.createElement("ul");
    list.className = "queue__note";
    Object.entries(item.values).forEach(([key, value]) => {
      const row = document.createElement("li");
      row.textContent = `${formatLabel(key)}: ${value || "(not set)"}`;
      list.appendChild(row);
    });

    li.append(heading, meta, list);
    queue.appendChild(li);
  });
  updateSummary();
}

function formatLabel(key) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^\w/, (c) => c.toUpperCase())
    .replace(/_/g, " ");
}

function updateSummary() {
  const statusLines = workflowSummary.querySelectorAll(".status-line");
  if (statusLines[1]) {
    statusLines[1].innerHTML = `<span class="dot"></span>${pipelineDraft.length} steps staged`;
  }

  const basic = pipelineDraft.filter((item) => item.level === "basic").length;
  const advanced = pipelineDraft.filter((item) => item.level === "advanced").length;
  const params = pipelineDraft.reduce((acc, item) => acc + Object.keys(item.values).length, 0);

  basicCount.textContent = basic;
  advancedCount.textContent = advanced;
  paramCount.textContent = params;
}

function exportDraft() {
  if (pipelineDraft.length === 0) {
    alert("Nothing to export. Add at least one task first.");
    return;
  }
  const blob = new Blob([JSON.stringify(pipelineDraft, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "relion-pipeline.json";
  anchor.click();
  URL.revokeObjectURL(url);
}

function seedStarterWorkflow() {
  const starter = [
    { title: "Import movies", level: "basic", values: { dataPath: "/data/*.mrc", pixelSize: "1.1", opticsGroup: "optics_01" } },
    { title: "Motion correction", level: "basic", values: { program: "MotionCor2", patchSize: "5x5", outputs: "aligned.mrc" } },
    { title: "CTF estimation", level: "basic", values: { program: "CTFFIND", defocusRange: "0.5-2.5", voltage: "300" } },
    { title: "Auto-picking", level: "basic", values: { method: "LoG", estimatedDiameter: "150", threshold: "-1.5" } },
    { title: "Particle extraction", level: "basic", values: { starInput: "micrographs_ctf.star", boxSize: "320", binning: "1" } },
    { title: "2D classification", level: "advanced", values: { numberClasses: "200", particleSet: "particles.star" } },
    { title: "3D auto-refine", level: "advanced", values: { inputParticles: "selected_particles.star", symmetry: "C1" } },
    { title: "Post-processing", level: "advanced", values: { finalMap: "refine_run.mrc", autoBfactor: "Enabled" } }
  ];

  pipelineDraft.splice(0, pipelineDraft.length, ...starter.map((item) => ({ ...item, id: crypto.randomUUID() })));
  renderQueue();
}

createPipeline.addEventListener("click", () => {
  if (pipelineDraft.length === 0) {
    alert("Add at least one task before drafting the pipeline.");
    return;
  }
  alert(`Pipeline draft created with ${pipelineDraft.length} staged tasks.`);
});

clearPipeline.addEventListener("click", () => {
  pipelineDraft.splice(0, pipelineDraft.length);
  renderQueue();
});

exportPipeline.addEventListener("click", exportDraft);
loadStarter.addEventListener("click", seedStarterWorkflow);

renderCards();
