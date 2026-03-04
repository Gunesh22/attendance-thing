import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, FileSpreadsheet, Users, CheckCircle2, ArrowLeft,
  Download, Loader2, Link2, SkipForward, Check
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
  return n.trim().replace(/\s+/g, ' ');
}

function calculateSimilarity(regName, zoomName) {
  const r = cleanName(regName);
  const z = cleanName(zoomName);

  if (r === z) return 1;
  if (!r || !z) return 0;

  const rParts = r.split(' ');
  const zParts = z.split(' ');

  if (zParts.length === 1 && rParts[0] === zParts[0]) return 0.95;
  if (zParts.length === 2 && rParts.length >= 2) {
    if (rParts[0] === zParts[0] && rParts[1].startsWith(zParts[1])) return 0.95;
  }
  if (rParts.length === 1 && zParts[0] === rParts[0]) return 0.95;

  return stringSimilarity.compareTwoStrings(r, z);
}

function parseTime(timeStr) {
  if (!timeStr) return null;
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
  const [viewStep, setViewStep] = useState('upload'); // upload -> review -> results

  const [matched, setMatched] = useState([]);
  const [absent, setAbsent] = useState([]);
  const [unmatchedZoom, setUnmatchedZoom] = useState([]);

  const [pairRegId, setPairRegId] = useState("");
  const [pairZoomId, setPairZoomId] = useState("");

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
        const regCols = getCols(regData[0] || {});
        const zoomCols = getCols(zoomData[0] || {});

        const zoomAggMap = new Map();

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
              zDuration = Math.round((l.getTime() - j.getTime()) / 60000);
            }
          }

          const cleanedZName = cleanName(zName);
          const id = zEmail || cleanedZName;

          if (!zoomAggMap.has(id)) {
            zoomAggMap.set(id, { name: zName, email: zEmail, duration: 0, matched: false });
          }
          zoomAggMap.get(id).duration += zDuration;
        });

        // Add internal unique IDs
        const zoomAggList = Array.from(zoomAggMap.values()).map((z, i) => ({ ...z, zId: `zm_${i}` }));

        const matchedList = [];
        const absentList = [];

        regData.forEach((rr, i) => {
          const rName = String(rr[regCols.name] || "").trim();
          const rEmail = String(rr[regCols.email] || "").trim().toLowerCase();
          const rPhone = String(rr[regCols.phone] || "").trim();

          if (!rName) return;

          let bestMatch = null;
          let highestScore = 0;

          for (const z of zoomAggList) {
            if (z.matched) continue;

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
            matchedList.push({
              regData: { Name: rName, Phone: rPhone, Email: rEmail },
              zoomData: { Name: bestMatch.name, Email: bestMatch.email, Duration: bestMatch.duration },
              Confidence: highestScore === 1 ? 'High (Exact Email)' : 'High (Name)'
            });
          } else {
            // Treat as absent initially, but keep suggestion if any
            absentList.push({
              id: `reg_${i}`,
              Name: rName, Phone: rPhone, Email: rEmail,
              SuggestedZoomId: (bestMatch && highestScore >= 0.4) ? bestMatch.zId : null,
              SuggestedScore: highestScore
            });
          }
        });

        const unmatchedZList = zoomAggList
          .filter(z => !z.matched)
          .map(z => ({
            id: z.zId,
            Name: z.name,
            Email: z.email,
            Duration: z.duration
          }));

        setMatched(matchedList);
        setAbsent(absentList);
        setUnmatchedZoom(unmatchedZList);

        // Go straight to results if perfect match scenario, else review
        if (unmatchedZList.length === 0 || absentList.length === 0) setViewStep('results');
        else setViewStep('review');

      } catch (e) {
        toast.error("Processing failed.");
      } finally {
        setIsProcessing(false);
      }
    }, 1200);
  };

  const handleApproveSuggestion = (regId, zoomId) => {
    const rIdx = absent.findIndex(a => a.id === regId);
    const zIdx = unmatchedZoom.findIndex(z => z.id === zoomId);
    if (rIdx < 0 || zIdx < 0) return;

    setMatched(prev => [...prev, {
      regData: absent[rIdx],
      zoomData: unmatchedZoom[zIdx],
      Confidence: 'Medium (Manually Approved)'
    }]);

    setAbsent(prev => prev.filter(r => r.id !== regId));
    setUnmatchedZoom(prev => prev.filter(z => z.id !== zoomId));
    toast.success("Match approved!");
  };

  const handleManualPair = () => {
    if (!pairRegId || !pairZoomId) {
      toast.error('Select one registered and one Zoom user to pair.');
      return;
    }
    const rIdx = absent.findIndex(r => r.id === pairRegId);
    const zIdx = unmatchedZoom.findIndex(z => z.id === pairZoomId);
    if (rIdx < 0 || zIdx < 0) return;

    setMatched(prev => [...prev, {
      regData: absent[rIdx],
      zoomData: unmatchedZoom[zIdx],
      Confidence: 'Forced Manual Pair'
    }]);

    setAbsent(prev => prev.filter(r => r.id !== pairRegId));
    setUnmatchedZoom(prev => prev.filter(z => z.id !== pairZoomId));
    setPairRegId("");
    setPairZoomId("");
    toast.success("Users paired successfully!");
  }

  const handleDownload = () => {
    const wb = XLSX.utils.book_new();

    const wsMatched = XLSX.utils.json_to_sheet(matched.map(m => ({
      'Registered Name': m.regData.Name,
      'Registered Phone': m.regData.Phone,
      'Registered Email': m.regData.Email,
      'Zoom Name': m.zoomData.Name,
      'Zoom Email': m.zoomData.Email,
      'Attended Time (Mins)': m.zoomData.Duration,
      'Match Type': m.Confidence,
      'WhatsApp/Email Message': `Hi ${m.regData.Name}, thanks for attending for ${m.zoomData.Duration} minutes!`
    })));
    XLSX.utils.book_append_sheet(wb, wsMatched, "Matched");

    const wsAbsent = XLSX.utils.json_to_sheet(absent.map(a => ({
      'Registered Name': a.Name,
      'Phone': a.Phone,
      'Email': a.Email,
      'WhatsApp/Email Message': `Hey ${a.Name}, we missed you at the Zoom call today!`
    })));
    XLSX.utils.book_append_sheet(wb, wsAbsent, "Absent");

    const wsUnmatchedZoom = XLSX.utils.json_to_sheet(unmatchedZoom.map(z => ({
      'Zoom Name': z.Name,
      'Zoom Email': z.Email,
      'Total Attended (Mins)': z.Duration
    })));
    XLSX.utils.book_append_sheet(wb, wsUnmatchedZoom, "Unmatched Zoom Users");

    XLSX.writeFile(wb, "Attendance_Report.xlsx");
    toast.success("Report downloaded successfully!");
  };

  const reset = () => {
    setZoomFile(null);
    setRegFile(null);
    setZoomData(null);
    setRegData(null);
    setViewStep('upload');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Toaster position="top-right" />

      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-4 px-8 flex justify-between items-center shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-inner shadow-blue-400">
            <Users size={20} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">Attendance Matcher</h1>
        </div>

        {viewStep !== 'upload' && (
          <button
            onClick={reset}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors text-sm"
          >
            <ArrowLeft size={16} /> Start Over
          </button>
        )}
      </header>

      <main className="flex-1 flex flex-col items-center p-6 lg:p-12 w-full max-w-7xl mx-auto">
        <AnimatePresence mode="wait">

          {/* UPLOAD VIEW */}
          {viewStep === 'upload' && (
            <motion.div
              key="upload" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="w-full flex-1 flex flex-col justify-center"
            >
              {isProcessing ? (
                <div className="bg-white rounded-3xl p-16 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100 flex flex-col items-center text-center max-w-lg mx-auto">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, ease: "linear", duration: 1.5 }} className="text-blue-600 mb-6">
                    <Loader2 size={48} />
                  </motion.div>
                  <h2 className="text-2xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Matching Participants</h2>
                  <p className="text-slate-500 font-medium max-w-xs">Applying AI fuzzy matching algorithms to accurately reconcile your records...</p>
                </div>
              ) : (
                <div className="w-full max-w-4xl mx-auto">
                  <div className="text-center mb-12">
                    <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Reconcile Attendance</h2>
                    <p className="text-lg text-slate-500">Upload your Zoom logs and Registration List to instantly generate matches.</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8 mb-10">
                    {/* Zoom */}
                    <div className="relative group cursor-pointer h-72">
                      <div className={`relative h-full bg-white border-2 border-dashed ${zoomFile ? 'border-blue-400 bg-blue-50/30' : 'border-slate-300 hover:border-blue-500'} rounded-3xl p-8 flex flex-col items-center justify-center text-center transition-all shadow-sm`}>
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${zoomFile ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400 group-hover:bg-blue-50'}`}>
                          {zoomFile ? <CheckCircle2 size={32} /> : <FileSpreadsheet size={32} />}
                        </div>
                        <h3 className="text-lg font-bold mb-2">1. Add Zoom File</h3>
                        <p className="text-sm text-slate-500 mb-6 px-4">Upload the attendance CSV/Excel from Zoom</p>
                        {zoomFile && <span className="inline-flex items-center px-4 py-2 border border-blue-200 bg-white rounded-full text-sm font-semibold text-blue-700 shadow-sm"><span className="truncate">{zoomFile}</span></span>}
                        <input type="file" accept=".xlsx,.xls,.csv" onChange={(e) => handleFileUpload(e, 'zoom')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      </div>
                    </div>

                    {/* Reg */}
                    <div className="relative group cursor-pointer h-72">
                      <div className={`relative h-full bg-white border-2 border-dashed ${regFile ? 'border-emerald-400 bg-emerald-50/30' : 'border-slate-300 hover:border-emerald-500'} rounded-3xl p-8 flex flex-col items-center justify-center text-center transition-all shadow-sm`}>
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${regFile ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400 group-hover:bg-emerald-50'}`}>
                          {regFile ? <CheckCircle2 size={32} /> : <Users size={32} />}
                        </div>
                        <h3 className="text-lg font-bold mb-2">2. Add Registration List</h3>
                        <p className="text-sm text-slate-500 mb-6 px-4">Upload your registered candidates Excel sheet</p>
                        {regFile && <span className="inline-flex items-center px-4 py-2 border border-emerald-200 bg-white rounded-full text-sm font-semibold text-emerald-700 shadow-sm"><span className="truncate">{regFile}</span></span>}
                        <input type="file" accept=".xlsx,.xls,.csv" onChange={(e) => handleFileUpload(e, 'reg')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <button onClick={processMatching} disabled={!zoomData || !regData} className={`px-10 py-4 rounded-xl text-lg font-bold shadow-xl transition-all active:scale-95 flex items-center gap-3 mx-auto ${(!zoomData || !regData) ? 'bg-slate-200 text-slate-400 shadow-none cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-black'}`}>
                      Compare Datasets
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* REVIEW VIEW */}
          {viewStep === 'review' && (
            <motion.div key="review" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full max-w-5xl">
              <div className="flex justify-between items-end mb-8 border-b border-slate-200 pb-5">
                <div>
                  <h2 className="text-3xl font-extrabold mb-2 text-slate-800">Review Matches</h2>
                  <p className="text-slate-500">Some users couldn't be paired automatically. Pair them manually or skip to download.</p>
                </div>
                <button onClick={() => setViewStep('results')} className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-lg font-bold shadow-md hover:bg-slate-800 transition-colors">
                  Skip & See Results <SkipForward size={18} />
                </button>
              </div>

              {/* Suggestions */}
              {absent.filter(a => a.SuggestedZoomId && unmatchedZoom.find(z => z.id === a.SuggestedZoomId)).length > 0 && (
                <div className="mb-10">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-blue-700"><CheckCircle2 size={18} /> Suggested Matches</h3>
                  <div className="grid gap-4">
                    {absent.map(a => {
                      const zMatch = a.SuggestedZoomId ? unmatchedZoom.find(z => z.id === a.SuggestedZoomId) : null;
                      if (!zMatch) return null;

                      return (
                        <div key={a.id} className="bg-white border text-sm border-blue-100 shadow-sm p-4 rounded-xl flex items-center justify-between">
                          <div className="grid grid-cols-2 gap-8 flex-1">
                            <div><span className="text-slate-400 font-semibold uppercase text-xs">Registered</span> <div className="font-bold text-base mt-1">{a.Name}</div> <div className="text-slate-500">{a.Email || a.Phone}</div></div>
                            <div><span className="text-slate-400 font-semibold uppercase text-xs">Zoom</span> <div className="font-bold text-base mt-1">{zMatch.Name}</div> <div className="text-slate-500">{zMatch.Duration} mins</div></div>
                          </div>
                          <button onClick={() => handleApproveSuggestion(a.id, zMatch.id)} className="ml-4 shrink-0 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-lg font-bold transition flex items-center gap-2">
                            <Check size={16} /> Approve Match
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Manual Matching */}
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 mb-10">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><Link2 size={18} /> Manual Link</h3>
                <div className="grid md:grid-cols-2 gap-6 items-end">
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-2">Unmatched Registered Participants</label>
                    <select className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-lg p-3 outline-none focus:ring-2 ring-blue-500" value={pairRegId} onChange={e => setPairRegId(e.target.value)}>
                      <option value="">-- Select Registered User --</option>
                      {absent.map(a => <option key={a.id} value={a.id}>{a.Name} {a.Email ? `(${a.Email})` : ''}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-2">Unmatched Zoom Participants</label>
                    <select className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-lg p-3 outline-none focus:ring-2 ring-blue-500" value={pairZoomId} onChange={e => setPairZoomId(e.target.value)}>
                      <option value="">-- Select Zoom User --</option>
                      {unmatchedZoom.map(z => <option key={z.id} value={z.id}>{z.Name} ({z.Duration} mins)</option>)}
                    </select>
                  </div>
                </div>
                <div className="mt-6 text-right">
                  <button onClick={handleManualPair} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition">Pair Users</button>
                </div>
              </div>

            </motion.div>
          )}

          {/* RESULTS VIEW */}
          {viewStep === 'results' && (
            <motion.div key="results" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-5xl">
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center p-3 bg-emerald-100 text-emerald-600 rounded-full mb-4">
                  <CheckCircle2 size={28} />
                </div>
                <h2 className="text-3xl font-bold mb-3">Analysis Complete</h2>
                <p className="text-lg text-slate-500">We've generated the matched attendance records.</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col">
                  <span className="text-sm font-semibold tracking-wide text-slate-500 uppercase mb-2">Matched</span>
                  <span className="text-4xl font-extrabold text-blue-600">{matched.length}</span>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col">
                  <span className="text-sm font-semibold tracking-wide text-slate-500 uppercase mb-2">Absent</span>
                  <span className="text-4xl font-extrabold text-red-500">{absent.length}</span>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col">
                  <span className="text-sm font-semibold tracking-wide text-slate-500 uppercase mb-2">Unmatched Zoom</span>
                  <span className="text-4xl font-extrabold text-slate-700">{unmatchedZoom.length}</span>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-60"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -ml-20 -mb-20 opacity-60"></div>

                <h3 className="text-xl font-bold text-slate-800 mb-4 relative z-10">Your report is ready for export</h3>
                <p className="text-slate-500 max-w-md mx-auto mb-8 relative z-10">The generated Excel file contains 3 distinct sheets: Matched, Absent, and Unmatched Zoom Users. <br /><br /><strong>Includes automatic WhatsApp format generation!</strong></p>

                <button onClick={handleDownload} className="relative z-10 bg-emerald-500 text-white hover:bg-emerald-600 active:bg-emerald-700 px-8 py-4 rounded-xl font-bold text-lg inline-flex items-center gap-3 shadow-lg transition hover:-translate-y-0.5">
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
