import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  FileSpreadsheet,
  Users,
  CheckCircle2,
  ArrowLeft,
  Download,
  Loader2,
  AlertCircle
} from 'lucide-react';
import * as XLSX from 'xlsx';
import stringSimilarity from 'string-similarity';
import { toast, Toaster } from 'react-hot-toast';

function cleanName(name) {
  if (!name) return "";
  let n = String(name).toLowerCase().trim();
  const wordsToRemove = ["iphone", "ipad", "phone", "galaxy", "samsung", "laptop", "pc", "mobile", "redmi"];
  wordsToRemove.forEach(w => {
    const regex = new RegExp(`\\b${w}\\b`, "g");
    n = n.replace(regex, "");
  });
  return n.trim().replace(/\s+/g, ' '); // remove multiple spaces
}

function calculateSimilarity(regName, zoomName) {
  const r = cleanName(regName);
  const z = cleanName(zoomName);

  if (r === z) return 1;
  if (!r || !z) return 0;

  const rParts = r.split(' ');
  const zParts = z.split(' ');

  // Direct start match (Rohit vs Rohit Sharma)
  if (zParts.length === 1 && rParts[0] === zParts[0]) {
    return 0.95; // very high
  }

  // Initials match (Rohit S vs Rohit Sharma)
  if (zParts.length === 2 && rParts.length >= 2) {
    if (rParts[0] === zParts[0] && rParts[1].startsWith(zParts[1])) {
      return 0.95;
    }
  }

  // Reverse match (zoom full, reg short) just in case
  if (rParts.length === 1 && zParts[0] === rParts[0]) {
    return 0.95;
  }

  return stringSimilarity.compareTwoStrings(r, z);
}

function parseTime(timeStr) {
  if (!timeStr) return null;
  // Attempt to parse Date. If it's a date object, return it.
  if (timeStr instanceof Date) return timeStr;
  const d = new Date(timeStr);
  if (!isNaN(d.getTime())) return d;
  return null;
}

export default function App() {
  const [zoomFile, setZoomFile] = useState(null);
  const [regFile, setRegFile] = useState(null);
  const [zoomData, setZoomData] = useState(null);
  const [regData, setRegData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState(null);

  const getCols = (row) => {
    if (!row) return {};
    const keys = Object.keys(row);
    const lowerKeys = keys.map(k => k.toLowerCase());
    return {
      name: keys[lowerKeys.findIndex(k => k.includes('name'))] || keys[0],
      email: keys[lowerKeys.findIndex(k => k.includes('email'))],
      phone: keys[lowerKeys.findIndex(k => k.includes('phone') || k.includes('mobile') || k.includes('contact'))],
      join: keys[lowerKeys.findIndex(k => k.includes('join'))],
      leave: keys[lowerKeys.findIndex(k => k.includes('leave'))],
      duration: keys[lowerKeys.findIndex(k => k.includes('duration'))],
    };
  };

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === 'zoom') setZoomFile(file.name);
    else setRegFile(file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const workbook = XLSX.read(bstr, { type: "binary", cellDates: true });
        const sheetName = workbook.SheetNames[0];
        const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: "" });

        if (type === 'zoom') setZoomData(rows);
        else setRegData(rows);

        toast.success(`${type === 'zoom' ? 'Zoom' : 'Registration'} data loaded!`);
      } catch (err) {
        toast.error("Error reading file.");
      }
    };
    reader.readAsBinaryString(file);
  };

  const processMatching = () => {
    if (!zoomData || !regData) {
      toast.error("Please upload both files first!");
      return;
    }
    setIsProcessing(true);

    setTimeout(() => {
      try {
        // Find columns
        const regCols = getCols(regData[0] || {});
        const zoomCols = getCols(zoomData[0] || {});

        // Aggregate zoom data by email or normalized name to sum duration
        // Note: one person might have joined multiple times
        const zoomAggMap = new Map(); // id -> { name, email, time }

        // Unmatched zoom tracker
        const allZoomEntries = [];

        zoomData.forEach(zr => {
          const zName = String(zr[zoomCols.name] || "").trim();
          const zEmail = String(zr[zoomCols.email] || "").trim().toLowerCase();

          if (!zName && !zEmail) return;

          let zDuration = 0;
          if (zoomCols.duration && zr[zoomCols.duration]) {
            zDuration = parseInt(zr[zoomCols.duration]) || 0;
          } else if (zoomCols.join && zoomCols.leave && zr[zoomCols.join] && zr[zoomCols.leave]) {
            const j = parseTime(zr[zoomCols.join]);
            const l = parseTime(zr[zoomCols.leave]);
            if (j && l) {
              zDuration = Math.round((l.getTime() - j.getTime()) / 60000); // minutes
            }
          }

          const cleanedZName = cleanName(zName);
          const id = zEmail || cleanedZName;

          allZoomEntries.push({
            name: zName,
            email: zEmail,
            duration: zDuration,
            matched: false,
            id
          });

          if (!zoomAggMap.has(id)) {
            zoomAggMap.set(id, { name: zName, email: zEmail, duration: 0, matched: false });
          }
          zoomAggMap.get(id).duration += zDuration;
        });

        const zoomAggList = Array.from(zoomAggMap.values());

        const matchedList = [];
        const absentList = [];
        const possibleList = [];

        // Now match reg data.
        regData.forEach(rr => {
          const rName = String(rr[regCols.name] || "").trim();
          const rEmail = String(rr[regCols.email] || "").trim().toLowerCase();
          const rPhone = String(rr[regCols.phone] || "").trim();

          if (!rName) return;

          let bestMatch = null;
          let highestScore = 0;

          // find best match in Zoom data
          for (const z of zoomAggList) {
            if (z.matched) continue;

            // exact email match
            if (rEmail && z.email && rEmail === z.email) {
              highestScore = 1;
              bestMatch = z;
              break;
            }

            const score = calculateSimilarity(rName, z.name);
            if (score > highestScore) {
              highestScore = score;
              bestMatch = z;
            }
          }

          if (bestMatch && highestScore >= 0.8) {
            bestMatch.matched = true;
            // mark all individual entries as matched
            allZoomEntries.filter(ze => ze.id === bestMatch.email || ze.id === bestMatch.name.toLowerCase())
              .forEach(ze => ze.matched = true);

            matchedList.push({
              Name: rName,
              Phone: rPhone,
              Email: rEmail,
              'Zoom Name': bestMatch.name,
              'Zoom Email': bestMatch.email,
              'Attended Time (Mins)': bestMatch.duration,
              Status: 'Matched',
              Confidence: highestScore === 1 ? 'High' : 'High'
            });
          } else if (bestMatch && highestScore >= 0.5) {
            // Possible match, don't mark as consumed, or maybe DO mark? We let user decide but don't output in matched
            possibleList.push({
              'Registered Name': rName,
              'Registered Email': rEmail,
              'Zoom Name': bestMatch.name,
              'Zoom Email': bestMatch.email,
              Confidence: 'Medium (' + Math.round(highestScore * 100) + '%)',
              Status: 'Possible Match'
            });
            absentList.push({ Name: rName, Phone: rPhone, Email: rEmail });
          } else {
            // Absent
            absentList.push({ Name: rName, Phone: rPhone, Email: rEmail });
          }
        });

        const unmatchedZoomList = zoomAggList
          .filter(z => !z.matched)
          .map(z => ({
            'Zoom Name': z.name,
            'Zoom Email': z.email,
            'Total Attended (Mins)': z.duration
          }));

        setResults({
          matched: matchedList,
          absent: absentList,
          possible: possibleList,
          unmatchedZoom: unmatchedZoomList
        });

      } catch (e) {
        console.error(e);
        toast.error("Processing failed. Please check the files and try again.");
      } finally {
        setIsProcessing(false);
      }
    }, 1500); // Artificial delay for the load animation
  };

  const handleDownload = () => {
    if (!results) return;

    const wb = XLSX.utils.book_new();

    const wsMatched = XLSX.utils.json_to_sheet(results.matched);
    XLSX.utils.book_append_sheet(wb, wsMatched, "Matched");

    const wsAbsent = XLSX.utils.json_to_sheet(results.absent);
    XLSX.utils.book_append_sheet(wb, wsAbsent, "Absent");

    const wsPossible = XLSX.utils.json_to_sheet(results.possible);
    XLSX.utils.book_append_sheet(wb, wsPossible, "Possible Matches");

    const wsUnmatchedZoom = XLSX.utils.json_to_sheet(results.unmatchedZoom);
    XLSX.utils.book_append_sheet(wb, wsUnmatchedZoom, "Unmatched Zoom Users");

    XLSX.writeFile(wb, "Attendance_Report.xlsx");
    toast.success("Report downloaded successfully!");
  };

  const reset = () => {
    setZoomFile(null);
    setRegFile(null);
    setZoomData(null);
    setRegData(null);
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Toaster position="top-right" />

      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-5 px-8 flex justify-between items-center shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-inner shadow-blue-400">
            <Users size={20} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">Attendance Matcher</h1>
        </div>

        {results && (
          <button
            onClick={reset}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors text-sm"
          >
            <ArrowLeft size={16} /> New File
          </button>
        )}
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 w-full max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {!results ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              {isProcessing ? (
                <div className="bg-white rounded-3xl p-16 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100 flex flex-col items-center justify-center text-center max-w-lg mx-auto">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, ease: "linear", duration: 1.5 }}
                    className="text-blue-600 mb-6"
                  >
                    <Loader2 size={48} />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Matching Participants</h2>
                  <p className="text-slate-500 font-medium max-w-xs">Applying AI fuzzy matching algorithms to accurately reconcile your records...</p>
                </div>
              ) : (
                <div className="w-full max-w-4xl mx-auto">
                  <div className="text-center mb-12">
                    <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Reconcile Attendance</h2>
                    <p className="text-lg text-slate-500">Upload your Zoom logs and Registration List to instantly generate matches.</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8 mb-10">
                    {/* Zoom Upload */}
                    <div className="relative group cursor-pointer h-72">
                      <div className="absolute inset-0 bg-blue-500 rounded-3xl blur-xl opacity-0 group-hover:opacity-10 transition duration-500"></div>
                      <div className={`relative h-full bg-white border-2 border-dashed ${zoomFile ? 'border-blue-400 bg-blue-50/30' : 'border-slate-300 group-hover:border-blue-500'} rounded-3xl p-8 flex flex-col items-center justify-center text-center transition-all duration-300 shadow-sm hover:shadow-md`}>
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${zoomFile ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50'}`}>
                          {zoomFile ? <CheckCircle2 size={32} /> : <FileSpreadsheet size={32} />}
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">1. Add Zoom File</h3>
                        <p className="text-sm text-slate-500 mb-6 px-4">Upload the attendance CSV/Excel from Zoom</p>

                        {zoomFile && (
                          <span className="inline-flex max-w-full items-center px-4 py-2 border border-blue-200 bg-white rounded-full text-sm font-semibold text-blue-700 shadow-sm">
                            <span className="truncate">{zoomFile}</span>
                          </span>
                        )}
                        <input type="file" accept=".xlsx,.xls,.csv" onChange={(e) => handleFileUpload(e, 'zoom')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      </div>
                    </div>

                    {/* Reg Upload */}
                    <div className="relative group cursor-pointer h-72">
                      <div className="absolute inset-0 bg-emerald-500 rounded-3xl blur-xl opacity-0 group-hover:opacity-10 transition duration-500"></div>
                      <div className={`relative h-full bg-white border-2 border-dashed ${regFile ? 'border-emerald-400 bg-emerald-50/30' : 'border-slate-300 group-hover:border-emerald-500'} rounded-3xl p-8 flex flex-col items-center justify-center text-center transition-all duration-300 shadow-sm hover:shadow-md`}>
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${regFile ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400 group-hover:text-emerald-600 group-hover:bg-emerald-50'}`}>
                          {regFile ? <CheckCircle2 size={32} /> : <Users size={32} />}
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">2. Add Registration List</h3>
                        <p className="text-sm text-slate-500 mb-6 px-4">Upload your registered candidates Excel sheet</p>

                        {regFile && (
                          <span className="inline-flex max-w-full items-center px-4 py-2 border border-emerald-200 bg-white rounded-full text-sm font-semibold text-emerald-700 shadow-sm">
                            <span className="truncate">{regFile}</span>
                          </span>
                        )}
                        <input type="file" accept=".xlsx,.xls,.csv" onChange={(e) => handleFileUpload(e, 'reg')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <button
                      onClick={processMatching}
                      disabled={!zoomData || !regData}
                      className={`px-10 py-4 rounded-xl text-lg font-bold shadow-xl transition-all duration-300 active:scale-95 flex items-center gap-3 mx-auto
                          ${(!zoomData || !regData)
                          ? 'bg-slate-200 text-slate-400 shadow-none cursor-not-allowed'
                          : 'bg-slate-900 text-white hover:bg-black hover:shadow-2xl hover:shadow-slate-900/20'}`}
                    >
                      Compare Datasets
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: 'spring' }}
              className="w-full max-w-5xl"
            >
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center p-3 bg-emerald-100 text-emerald-600 rounded-full mb-4">
                  <CheckCircle2 size={28} />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-3">Analysis Complete</h2>
                <p className="text-lg text-slate-500">We've generated the matched attendance records.</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col">
                  <span className="text-sm font-semibold tracking-wide text-slate-500 uppercase mb-2">Matched</span>
                  <span className="text-4xl font-extrabold text-blue-600">{results.matched.length}</span>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col">
                  <span className="text-sm font-semibold tracking-wide text-slate-500 uppercase mb-2">Absent</span>
                  <span className="text-4xl font-extrabold text-red-500">{results.absent.length}</span>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col">
                  <span className="text-sm font-semibold tracking-wide text-slate-500 uppercase mb-2">Possible</span>
                  <span className="text-4xl font-extrabold text-amber-500">{results.possible.length}</span>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col">
                  <span className="text-sm font-semibold tracking-wide text-slate-500 uppercase mb-2">Unmatched</span>
                  <span className="text-4xl font-extrabold text-slate-700">{results.unmatchedZoom.length}</span>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-60 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -ml-20 -mb-20 opacity-60 pointer-events-none"></div>

                <h3 className="text-xl font-bold text-slate-800 mb-4 relative z-10">Your report is ready for export</h3>
                <p className="text-slate-500 max-w-md mx-auto mb-8 relative z-10">The generated Excel file contains 4 distinct sheets: Matched, Absent, Possible Matches, and Unmatched Zoom Users.</p>

                <button
                  onClick={handleDownload}
                  className="relative z-10 bg-emerald-500 text-white hover:bg-emerald-600 active:bg-emerald-700 px-8 py-4 rounded-xl font-bold text-lg inline-flex items-center gap-3 shadow-lg shadow-emerald-500/30 transition-all hover:shadow-xl hover:shadow-emerald-500/40 hover:-translate-y-0.5"
                >
                  <Download size={22} /> Download Excel Report
                </button>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
