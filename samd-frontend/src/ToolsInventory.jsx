import { useState } from "react";
import toolsData from "./toolsData.json";
import { Plus, Edit2, Trash2, Download } from "lucide-react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


export default function ToolsInventory() {
  const [farmers, setFarmers] = useState(toolsData.farmers);
  const farmer = farmers[0];

  const tabs = [
    "Crops",
    "Pesticides",
    "Livestock",
    "Tools",
    "Consumables",
    "AI Suggestions"
  ];

  const [activeTab, setActiveTab] = useState("Crops");

  const [editIndex, setEditIndex] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({});

  const [aiLoading, setAiLoading] = useState(false);
  const [aiText, setAiText] = useState("");

  const getList = () =>
    farmer[activeTab.toLowerCase()] || [];

  const num = (v) => parseFloat(v) || 0;

  const COLORS = ["#3C6E71", "#284B63", "#D9D9D9", "#FFB703", "#FB8500"];

  // ---------------------------------------------
  // CRUD
  // ---------------------------------------------

  const openAdd = () => {
    const structures = {
      Crops: { name: "", variety: "", area: "", stage: "", expectedYield: "", irrigation: "" },
      Pesticides: { name: "", type: "", quantity: "", expiry: "", usage: "" },
      Livestock: { animal: "", count: "", health: "", vaccination: "" },
      Tools: { name: "", model: "", condition: "", lastServiced: "" },
      Consumables: { item: "", quantity: "" }
    };

    setForm(structures[activeTab]);
    setEditIndex(null);
    setModalOpen(true);
  };

  const openEdit = (idx) => {
    setForm(getList()[idx]);
    setEditIndex(idx);
    setModalOpen(true);
  };

  const saveItem = () => {
    const updated = [...getList()];
    editIndex !== null ? (updated[editIndex] = form) : updated.push(form);

    const newF = [...farmers];
    newF[0][activeTab.toLowerCase()] = updated;
    setFarmers(newF);
    setModalOpen(false);
  };

  const deleteItem = (idx) => {
    const updated = getList().filter((_, i) => i !== idx);
    const newF = [...farmers];
    newF[0][activeTab.toLowerCase()] = updated;
    setFarmers(newF);
  };

  // ---------------------------------------------
  // EXPORTS
  // ---------------------------------------------

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(getList());
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, activeTab);
    XLSX.writeFile(wb, `${activeTab}.xlsx`);
  };

  const exportCSV = () => {
    const ws = XLSX.utils.json_to_sheet(getList());
    const csv = XLSX.utils.sheet_to_csv(ws);
    saveAs(new Blob([csv]), `${activeTab}.csv`);
  };

  const exportPDF = () => {
  const doc = new jsPDF();
  const list = getList();

  doc.setFontSize(18);
  doc.text(`${activeTab} Inventory`, 14, 20);

  doc.setFontSize(12);
  doc.text(`Farmer: ${farmer.name}`, 14, 30);

  if (!list.length) {
    doc.text("No data available", 14, 40);
    return doc.save(`${activeTab}.pdf`);
  }

  const headers = Object.keys(list[0]).map((h) => h.toUpperCase());
  const rows = list.map((obj) => Object.values(obj));

  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 45,
    theme: "grid",
  });

  doc.save(`${activeTab}.pdf`);
};


  // ---------------------------------------------
  // AI SUGGESTIONS TAB
  // ---------------------------------------------

  const generateAI = async () => {
    setAiLoading(true);
    setAiText("Generating recommendations...");

    const inventoryData = JSON.stringify(farmer, null, 2);
    const API_KEY = import.meta.env.VITE_GROQ_API_KEY;

    try {
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [
              {
                role: "system",
                content:
                  "You are an expert agricultural consultant. Give practical, actionable recommendations."
              },
              {
                role: "user",
                content: `Analyze this farmer's entire inventory and give a detailed improvement plan:\n\n${inventoryData}`
              }
            ]
          })
        }
      );

      const data = await response.json();
      setAiText(data.choices?.[0]?.message?.content || "No response.");
    } catch (err) {
      setAiText("Error generating AI suggestions.");
    }

    setAiLoading(false);
  };

  // ---------------------------------------------
  // CHART
  // ---------------------------------------------

  const renderChart = () => {
    const raw = getList();
    if (activeTab === "AI Suggestions") return null;
    if (!raw.length) return <p>No data</p>;

    // CROPS
    if (activeTab === "Crops") {
      const data = raw.map((i) => ({
        name: i.name,
        expectedYield: num(i.expectedYield)
      }));

      return (
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="expectedYield" fill="#3C6E71" />
        </BarChart>
      );
    }

    // PESTICIDES
    if (activeTab === "Pesticides") {
      const data = raw.map((i) => ({
        name: i.name,
        quantity: num(i.quantity)
      }));

      return (
        <PieChart>
          <Pie data={data} dataKey="quantity" nameKey="name" outerRadius={90}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      );
    }

    // LIVESTOCK
    if (activeTab === "Livestock") {
      return (
        <BarChart data={raw}>
          <XAxis dataKey="animal" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#284B63" />
        </BarChart>
      );
    }

    // TOOLS
    if (activeTab === "Tools") {
      const grouped = [
        { condition: "Good", value: raw.filter((i) => i.condition === "Good").length },
        { condition: "Medium", value: raw.filter((i) => i.condition === "Medium").length },
        { condition: "Poor", value: raw.filter((i) => i.condition === "Poor").length }
      ];

      return (
        <PieChart>
          <Pie data={grouped} dataKey="value" nameKey="condition" outerRadius={90}>
            {grouped.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      );
    }

    // CONSUMABLES
    if (activeTab === "Consumables") {
      const data = raw.map((i) => ({
        item: i.item,
        quantity: num(i.quantity)
      }));

      return (
        <BarChart data={data}>
          <XAxis dataKey="item" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="quantity" fill="#FFB703" />
        </BarChart>
      );
    }
  };

  // ---------------------------------------------
  // UI
  // ---------------------------------------------

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[var(--accent)]">
            Farmer Inventory Dashboard
          </h1>
          <p className="text-gray-600">
            Manage crops, pesticides, livestock, tools, and consumables
          </p>
        </div>

        {activeTab !== "AI Suggestions" && (
          <div className="flex gap-3">
            <button
              onClick={exportExcel}
              className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg"
            >
              Excel
            </button>

            <button
              onClick={exportCSV}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              CSV
            </button>

            <button
              onClick={exportPDF}
              className="px-4 py-2 bg-red-500 text-white rounded-lg"
            >
              PDF
            </button>
          </div>
        )}
      </div>

      {/* TABS */}
      <div className="flex gap-6 border-b pb-2 mb-6">
        {tabs.map((t) => (
          <button
            key={t}
            className={`pb-2 text-lg ${
              activeTab === t
                ? "text-[var(--accent)] border-b-2 border-[var(--accent)]"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {/* AI SUGGESTIONS TAB */}
      {activeTab === "AI Suggestions" ? (
        <div className="p-6 bg-white rounded-xl shadow-lg border">
          <h2 className="text-xl font-semibold mb-4">
            Smart AI Recommendations
          </h2>

          <button
            onClick={generateAI}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg mb-4"
          >
            {aiLoading ? "Generating..." : "Generate Recommendations"}
          </button>

          <div className="bg-gray-100 p-4 rounded-lg min-h-[200px] whitespace-pre-wrap">
            {aiText || "AI will generate insights here..."}
          </div>
        </div>
      ) : (
        <>
          {/* MAIN GRID */}
          <div className="grid lg:grid-cols-2 gap-6">

            {/* CRUD LIST */}
            <div>
              <button
                onClick={openAdd}
                className="mb-4 bg-[var(--accent)] px-4 py-2 rounded-lg text-white"
              >
                Add {activeTab.slice(0, -1)}
              </button>

              <div className="space-y-4">
                {getList().map((item, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -4 }}
                    className="p-4 bg-white rounded-xl shadow-md border"
                  >
                    <div>
                      {Object.keys(item).map((k) => (
                        <div key={k} className="text-sm">
                          <span className="font-semibold capitalize">{k}: </span>
                          {item[k]}
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-3 mt-3">
                      <button className="text-blue-600" onClick={() => openEdit(idx)}>
                        <Edit2 size={18} />
                      </button>
                      <button className="text-red-600" onClick={() => deleteItem(idx)}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* CHART */}
            <div className="p-4 bg-white rounded-xl shadow-md border">
              <h3 className="font-semibold mb-3">{activeTab} Analytics</h3>
              <ResponsiveContainer width="100%" height={300}>
                {renderChart()}
              </ResponsiveContainer>
            </div>

          </div>
        </>
      )}

      {/* CRUD MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl">
            <h3 className="text-xl font-bold mb-4">
              {editIndex !== null ? "Edit" : "Add"} {activeTab.slice(0, -1)}
            </h3>

            <div className="space-y-3 max-h-[300px] overflow-auto">
              {Object.keys(form).map((key) => (
                <input
                  key={key}
                  className="w-full p-2 border rounded-lg"
                  placeholder={key}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              ))}
            </div>

            <button
              onClick={saveItem}
              className="w-full mt-4 bg-[var(--accent)] text-white py-2 rounded-lg"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
