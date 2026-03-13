import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, FileSpreadsheet, Users, CheckCircle2, ArrowLeft,
  Download, Loader2, Link2, SkipForward, Check, Search, X, ChevronUp, ChevronDown
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

function isDeviceName(name) {
  if (!name) return false;
  const n = String(name).toLowerCase();
  const devices = ["iphone", "ipad", "phone", "galaxy", "samsung", "laptop", "pc", "mobile", "redmi", "oppo", "vivo", "realme", "oneplus", "macbook", "zoom user", "administrator", "admin", "device", "tablet", "desktop"];
  return devices.some(d => n.includes(d));
}

function calculateSimilarity(regName, zoomName) {
  const r = cleanName(regName);
  const z = cleanName(zoomName);

  if (r === z) return 1;
  if (!r || !z) return 0;

  const rParts = r.split(' ').filter(Boolean);
  const zParts = z.split(' ').filter(Boolean);

  // 1. Exact Token Set Intersection (Handles "Gunesh Sakhala" vs "Sakhala Gunesh")
  const intersection = rParts.filter(rp => zParts.includes(rp));
  if (intersection.length > 0 && intersection.length === rParts.length && intersection.length === zParts.length) {
    return 1;
  }

  // 2. Strong Token & Initial Detection
  let hasStrongTokenMatch = false;
  let hasInitialMatch = false;

  for (const zp of zParts) {
    let bestSim = 0;
    let isInitial = false;

    for (const rp of rParts) {
      if (rp === zp) {
        bestSim = 1;
      } else if (zp.length <= 3 && rp.length > zp.length && rp.startsWith(zp)) {
        // e.g. zp="S", rp="Sakhala" -> Initial Match
        bestSim = 1.0;
        isInitial = true;
      } else {
        const sim = stringSimilarity.compareTwoStrings(rp, zp);
        if (sim > bestSim) bestSim = sim;
      }
    }

    if (bestSim >= 0.85) hasStrongTokenMatch = true;
    if (isInitial) hasInitialMatch = true;
  }

  // 3. Fallback to standard similarities + token set ratio
  let finalScore = 0;

  if (intersection.length > 0) {
    const diff1 = rParts.filter(word => !intersection.includes(word));
    const diff2 = zParts.filter(word => !intersection.includes(word));
    const combI = intersection.join(' ');
    const s1c = [combI, ...diff1].join(' ').trim();
    const s2c = [combI, ...diff2].join(' ').trim();

    finalScore = Math.max(
      stringSimilarity.compareTwoStrings(s1c, s2c),
      stringSimilarity.compareTwoStrings(combI, s1c),
      stringSimilarity.compareTwoStrings(combI, s2c)
    );
  } else {
    const rReversed = rParts.slice().reverse().join(' ');
    finalScore = Math.max(
      stringSimilarity.compareTwoStrings(r, z),
      stringSimilarity.compareTwoStrings(rReversed, z)
    );
  }

  // 4. Boost Score for strong initial match combinations
  // Matches "Gunesh S" vs "Gunesh Sakhala" -> 91%
  if (hasStrongTokenMatch && hasInitialMatch) {
    finalScore = Math.max(finalScore, 0.91);
  }

  // 5. Special Case: Zoom name is just one strong word (e.g. "Gunesh" vs "Gunesh Sakhala")
  if (zParts.length === 1 && rParts.length > 1) {
    const bestTokenSim = Math.max(...rParts.map(rp => stringSimilarity.compareTwoStrings(zParts[0], rp)));
    if (bestTokenSim >= 0.8) finalScore = Math.max(finalScore, 0.85); // 85% to be slightly below extreme confidence
  }

  return finalScore;
}

function parseTime(timeStr) {
  if (!timeStr) return null;
  if (timeStr instanceof Date) return timeStr;
  const d = new Date(timeStr);
  if (!isNaN(d.getTime())) return d;
  return null;
}

export default function App() {
  const CURRENT_VERSION = '7b0fbea_v2'; // Unique ID for cache busting

  useEffect(() => {
    const savedVersion = localStorage.getItem('app_version');
    if (savedVersion !== CURRENT_VERSION) {
      localStorage.setItem('app_version', CURRENT_VERSION);
      // Hard refresh and clear all to get new code
      if ('caches' in window) {
        caches.keys().then(names => {
          for (let name of names) caches.delete(name);
        }).finally(() => {
          window.location.reload(true);
        });
      } else {
        window.location.reload(true);
      }
    }
  }, []);

  const [zoomFile, setZoomFile] = useState(null);
  const [regFile, setRegFile] = useState(null);
  const [zoomData, setZoomData] = useState(null);
  const [regData, setRegData] = useState(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [viewStep, setViewStep] = useState('upload'); // upload -> review -> results

  const [matched, setMatched] = useState([]);
  const [absent, setAbsent] = useState([]);
  const [unmatchedZoom, setUnmatchedZoom] = useState([]);

  // Search state for table
  const [activeSearchId, setActiveSearchId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [activeTab, setActiveTab] = useState('suggested'); // suggested, unknown, devices

  // Table sorting state
  const [sortConfig, setSortConfig] = useState({ key: 'match', direction: 'desc' });

  const handleSort = (key) => {
    let direction = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const getCols = (row) => {
    if (!row) return {};
    const keys = Object.keys(row);
    const lowerKeys = keys.map(k => k.toLowerCase().trim());
    return {
      name: keys[lowerKeys.findIndex(k => k === 'name' || k.includes('original name'))] || keys[lowerKeys.findIndex(k => k.includes('name') && !k.includes('first') && !k.includes('last'))] || keys[0],
      firstName: keys[lowerKeys.findIndex(k => k.includes('first') || k === 'fname')],
      lastName: keys[lowerKeys.findIndex(k => k.includes('last') || k === 'lname')],
      email: keys[lowerKeys.findIndex(k => k.includes('email'))],
      phone: keys[lowerKeys.findIndex(k => k.includes('phone') || k.includes('mobile') || (k.includes('contact') && !k.includes('id')))],
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
          let zName = "";
          if (zoomCols.firstName || zoomCols.lastName) {
            zName = `${zr[zoomCols.firstName] || ""} ${zr[zoomCols.lastName] || ""}`.trim();
          } else {
            zName = String(zr[zoomCols.name] || "").trim();
          }
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

        const zoomAggList = Array.from(zoomAggMap.values()).map((z, i) => ({ ...z, zId: `zm_${i}` }));

        const matchedList = [];
        const absentList = [];

        regData.forEach((rr, i) => {
          let rName = "";
          if (regCols.firstName || regCols.lastName) {
            rName = `${rr[regCols.firstName] || ""} ${rr[regCols.lastName] || ""}`.trim();
          } else {
            rName = String(rr[regCols.name] || "").trim();
          }
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

            const isNumericObj = /^\d[\d\s\-\+\(\)]*$/.test(z.name.trim());
            if (isNumericObj && rPhone) {
              const zDigits = z.name.replace(/\D/g, '');
              const rDigits = rPhone.replace(/\D/g, '');
              if (zDigits.length >= 7 && (zDigits === rDigits || rDigits.includes(zDigits) || zDigits.includes(rDigits))) {
                highestScore = 1;
                bestMatch = z;
                break;
              }
            }

            const score = calculateSimilarity(rName, z.name);
            if (score > highestScore) {
              highestScore = score;
              bestMatch = z;
            }
          }

          if (bestMatch && highestScore > 0.95) {
            bestMatch.matched = true;
            matchedList.push({
              regData: { id: `reg_${i}`, Name: rName, Phone: rPhone, Email: rEmail },
              zoomData: { Name: bestMatch.name, Email: bestMatch.email, Duration: bestMatch.duration },
              Confidence: highestScore === 1 ? 'High (Exact Email/Phone)' : 'High (Name)'
            });
          } else {
            absentList.push({
              id: `reg_${i}`,
              Name: rName, Phone: rPhone, Email: rEmail
            });
          }
        });

        // Compute suggestions for remaining zoom users
        const unmatchedZList = zoomAggList
          .filter(z => !z.matched)
          .map(z => {
            const suggestions = absentList.map(a => ({
              ...a,
              score: calculateSimilarity(a.Name, z.name)
            })).filter(a => a.score >= 0.75).sort((a, b) => b.score - a.score);

            return {
              id: z.zId,
              Name: z.name,
              Email: z.email,
              Duration: z.duration,
              SuggestedMatch: suggestions.length > 0 ? suggestions[0] : null,
              ignored: false,
              isDevice: isDeviceName(z.name)
            }
          })
          .sort((a, b) => {
            const scoreA = a.SuggestedMatch ? a.SuggestedMatch.score : -1;
            const scoreB = b.SuggestedMatch ? b.SuggestedMatch.score : -1;
            if (scoreB !== scoreA) return scoreB - scoreA;
            return b.Duration - a.Duration;
          });

        setMatched(matchedList);
        setAbsent(absentList);
        setUnmatchedZoom(unmatchedZList);

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
    const zIdx = unmatchedZoom.findIndex(z => z.id === zoomId);
    if (zIdx < 0) return;

    let regData = absent.find(a => a.id === regId);
    let fromMatched = false;

    if (!regData) {
      // Try finding by id first, then fallback to Name match
      const m = matched.find(m => m.regData.id === regId) || matched.find(m => m.regData.Name === unmatchedZoom[zIdx]?.SuggestedMatch?.Name);
      if (m) {
        regData = m.regData;
        fromMatched = true;
      }
    }

    if (!regData) return;

    const newZoomEntry = unmatchedZoom[zIdx];

    if (fromMatched) {
      // Add duration to existing matched entry — match by Name to be safe
      setMatched(prev => prev.map(m =>
        m.regData.Name === regData.Name
          ? { ...m, zoomData: { ...m.zoomData, Name: m.zoomData.Name + ', ' + newZoomEntry.Name, Duration: m.zoomData.Duration + newZoomEntry.Duration } }
          : m
      ));
    } else {
      setMatched(prev => [...prev, {
        regData: regData,
        zoomData: newZoomEntry,
        Confidence: newZoomEntry.SuggestedMatch?.manuallySelected ? 'Manual Match' : 'Medium (Approved)'
      }]);
      setAbsent(prev => prev.filter(r => r.id !== regId));
    }

    setUnmatchedZoom(prev => prev.filter(z => z.id !== zoomId));
    toast.success(fromMatched ? "Duration added to existing match!" : "Match approved!");
  };

  const handleIgnore = (zoomId) => {
    setUnmatchedZoom(prev => prev.map(z => z.id === zoomId ? { ...z, ignored: true } : z));
    toast.success("User ignored");
  };

  const handleDownload = () => {
    const wb = XLSX.utils.book_new();

    // Deduplicate matched entries by Name, summing durations
    const mergedMap = new Map();
    matched.forEach(m => {
      const key = m.regData.Name.toLowerCase();
      if (mergedMap.has(key)) {
        const existing = mergedMap.get(key);
        existing.totalDuration += (m.zoomData.Duration || 0);
        const newNames = m.zoomData.Name.split(', ');
        newNames.forEach(n => { if (!existing.zoomNames.includes(n)) existing.zoomNames.push(n); });
      } else {
        mergedMap.set(key, {
          regData: m.regData,
          zoomEmail: m.zoomData.Email,
          totalDuration: m.zoomData.Duration || 0,
          zoomNames: m.zoomData.Name.split(', '),
          Confidence: m.Confidence
        });
      }
    });
    const mergedMatched = Array.from(mergedMap.values());

    const wsMatched = XLSX.utils.json_to_sheet(mergedMatched.map(m => ({
      'Registered Name': m.regData.Name,
      'Registered Phone': m.regData.Phone,
      'Registered Email': m.regData.Email,
      'Zoom Name(s)': m.zoomNames.join(', '),
      'Zoom Email': m.zoomEmail || '',
      'Total Attended Time (Mins)': m.totalDuration,
      'Match Type': m.Confidence,
      'WhatsApp/Email Message': `Hi ${m.regData.Name}, thanks for attending for ${m.totalDuration} minutes!`
    })));
    XLSX.utils.book_append_sheet(wb, wsMatched, "Matched");

    const wsUnmatchedZoom = XLSX.utils.json_to_sheet(unmatchedZoom.filter(z => !z.ignored).map(z => ({
      'Zoom Name': z.Name,
      'Zoom Email': z.Email,
      'Total Attended (Mins)': z.Duration
    })));
    XLSX.utils.book_append_sheet(wb, wsUnmatchedZoom, "Unmatched Zoom Users");

    XLSX.writeFile(wb, "Attendance_Report.xlsx");
    toast.success("Report downloaded successfully!");

    // Clear cache/storage to ensure clean state and fresh assets for next session
    try {
      localStorage.clear();
      sessionStorage.clear();
      if ('caches' in window) {
        caches.keys().then(names => {
          for (let name of names) caches.delete(name);
        });
      }
    } catch (e) {
      console.error("Cache clear failed", e);
    }
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
      <header className="bg-white border-b border-slate-200 py-4 px-8 flex justify-between items-center shadow-sm sticky top-0 z-50">
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
                  <p className="text-slate-500 font-medium max-w-xs">Applying AI fuzzy matching algorithms...</p>
                </div>
              ) : (
                <div className="w-full max-w-4xl mx-auto">
                  <div className="text-center mb-12">
                    <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Reconcile Attendance</h2>
                    <p className="text-lg text-slate-500">Upload your Zoom logs and Registration List to instantly generate matches.</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8 mb-10">
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

          {/* TABLE REVIEW VIEW */}
          {viewStep === 'review' && (
            <motion.div key="review" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full max-w-4xl mx-auto">

              {/* Context Bar */}
              <div className="mb-6 flex flex-col md:flex-row gap-6 md:gap-0 justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex gap-8 items-center text-center md:text-left">
                  <div>
                    <p className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-1">Matched</p>
                    <p className="text-3xl font-black text-emerald-500">{matched.length}</p>
                  </div>
                  <div className="w-px h-12 bg-slate-100"></div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-1">Needs Review</p>
                    <p className="text-3xl font-black text-blue-600">{unmatchedZoom.filter(z => !z.ignored && z.SuggestedMatch && !z.isDevice).length}</p>
                  </div>
                  <div className="w-px h-12 bg-slate-100"></div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-1">Unknown</p>
                    <p className="text-3xl font-black text-orange-400">{unmatchedZoom.filter(z => !z.ignored && !z.SuggestedMatch && !z.isDevice).length}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsProcessing(true);
                    setTimeout(() => {
                      setViewStep('results');
                      setIsProcessing(false);
                    }, 1200);
                  }}
                  className="bg-slate-900 w-full md:w-auto text-white px-6 py-3.5 rounded-xl font-bold hover:shadow-lg transition flex justify-center items-center gap-2"
                >
                  {isProcessing ? 'Finalizing...' : 'Finish & Get Report'} <ArrowLeft size={18} className="rotate-180" />
                </button>
              </div>

              {/* Filter Tabs & Sort Control */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setActiveTab('suggested')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'suggested' ? 'bg-blue-100 text-blue-700 shadow-sm' : 'bg-white border text-slate-500 hover:bg-slate-50'}`}>
                    Suggested Matches ({unmatchedZoom.filter(z => !z.ignored && z.SuggestedMatch).length})
                  </button>
                  <button onClick={() => setActiveTab('unknown')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'unknown' ? 'bg-orange-100 text-orange-700 shadow-sm' : 'bg-white border text-slate-500 hover:bg-slate-50'}`}>
                    Unknown Participants ({unmatchedZoom.filter(z => !z.ignored && !z.SuggestedMatch && !z.isDevice).length})
                  </button>
                  <button onClick={() => setActiveTab('devices')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'devices' ? 'bg-slate-200 text-slate-700 shadow-sm' : 'bg-white border text-slate-500 hover:bg-slate-50'}`}>
                    Unknown Devices ({unmatchedZoom.filter(z => !z.ignored && !z.SuggestedMatch && z.isDevice).length})
                  </button>
                </div>

                <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl border border-slate-200">
                  <button
                    onClick={() => handleSort('match')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${sortConfig.key === 'match' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    Match % {sortConfig.key === 'match' && (sortConfig.direction === 'desc' ? <ChevronDown size={14} /> : <ChevronUp size={14} />)}
                  </button>
                  <div className="w-px h-4 bg-slate-200"></div>
                  <button
                    onClick={() => handleSort('duration')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${sortConfig.key === 'duration' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    Duration {sortConfig.key === 'duration' && (sortConfig.direction === 'desc' ? <ChevronDown size={14} /> : <ChevronUp size={14} />)}
                  </button>
                </div>
              </div>

              {/* Data Cards List */}
              <div className={`space-y-3 relative z-10 transition-opacity ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}>
                {(() => {
                  const validUsers = unmatchedZoom.filter(z => {
                    if (z.ignored) return false;
                    if (activeTab === 'suggested') return z.SuggestedMatch;
                    if (activeTab === 'unknown') return !z.SuggestedMatch && !z.isDevice;
                    if (activeTab === 'devices') return !z.SuggestedMatch && z.isDevice;
                    return true;
                  });

                  if (validUsers.length === 0) {
                    return <div className="bg-white rounded-2xl p-10 text-center text-slate-500 font-medium border border-slate-200 shadow-sm">No pending users in this category!</div>;
                  }

                  const sortedUsers = [...validUsers].sort((a, b) => {
                    if (sortConfig.key === 'match') {
                      const scoreA = a.SuggestedMatch ? a.SuggestedMatch.score : -1;
                      const scoreB = b.SuggestedMatch ? b.SuggestedMatch.score : -1;
                      if (scoreB !== scoreA) return sortConfig.direction === 'desc' ? scoreB - scoreA : scoreA - scoreB;
                    }
                    return sortConfig.direction === 'desc' ? b.Duration - a.Duration : a.Duration - b.Duration;
                  });

                  return sortedUsers.map(z => {
                    const isSearching = activeSearchId === z.id;

                    return (
                      <div key={z.id} className={`bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow relative ${isSearching ? 'z-40' : 'z-10'}`}>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          {/* Zoom User Column */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-800 text-lg truncate" title={z.Name}>{z.Name}</span>
                              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${z.Duration < 10 ? 'bg-slate-100 text-slate-500' : 'bg-indigo-50 text-indigo-600'}`}>
                                {z.Duration} min
                              </span>
                            </div>
                            {z.Email && <div className="text-sm text-slate-500 mt-1 truncate">{z.Email}</div>}
                          </div>

                          {/* Suggested Column & Actions combined for tight layout */}
                          <div className="flex-1 min-w-0 flex flex-col md:flex-row items-stretch md:items-center gap-3 justify-end relative">
                            <div className="w-full md:w-72 relative">
                              {isSearching ? (() => {
                                const q = searchQuery.toLowerCase();
                                const absentItems = absent.filter(a => a.Name.toLowerCase().includes(q) || (a.Email && a.Email.toLowerCase().includes(q))).map(a => ({ ...a, _status: 'unmatched' }));
                                const matchedItems = q.length > 0 ? matched.filter(m => m.regData.Name.toLowerCase().includes(q) || (m.regData.Email && m.regData.Email.toLowerCase().includes(q))).map(m => ({ id: m.regData.id, Name: m.regData.Name, Email: m.regData.Email, Phone: m.regData.Phone, _status: 'matched' })) : [];
                                const allItems = [...absentItems, ...matchedItems];

                                return (
                                  <div className="relative" onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) { setActiveSearchId(null); setSearchQuery(""); } }} tabIndex={-1}>
                                    <div className="flex items-center bg-white border border-blue-400 rounded-lg px-3 py-2 shadow-[0_0_0_4px_rgba(59,130,246,0.1)] transition-all">
                                      <Search size={16} className="text-blue-400 mr-2 shrink-0" />
                                      <input
                                        autoFocus
                                        type="text"
                                        className="w-full outline-none text-sm font-medium"
                                        placeholder="Type name to search..."
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                      />
                                      <button onClick={() => { setActiveSearchId(null); setSearchQuery(""); }}><X size={16} className="text-slate-400 hover:text-red-500" /></button>
                                    </div>

                                    <div className="absolute top-12 left-0 right-0 bg-white border border-slate-200 shadow-xl rounded-xl z-50 max-h-56 overflow-y-auto">
                                      {allItems.length === 0 ? (
                                        <div className="p-4 text-sm text-slate-500 text-center">No results found</div>
                                      ) : allItems.map(a => (
                                        <div key={a.id} onClick={() => {
                                          const uz = [...unmatchedZoom];
                                          const idx = uz.findIndex(u => u.id === z.id);
                                          uz[idx].SuggestedMatch = { ...a, manuallySelected: true, score: 1 };
                                          setUnmatchedZoom(uz);
                                          setActiveSearchId(null);
                                          setSearchQuery("");
                                        }} className="p-3.5 hover:bg-blue-50 cursor-pointer border-b border-slate-100 last:border-0 transition-colors flex items-center justify-between">
                                          <div className="min-w-0 pr-3">
                                            <div className="font-bold text-sm text-slate-800 truncate">{a.Name}</div>
                                            {a.Email && <div className="text-xs text-slate-500 truncate">{a.Email}</div>}
                                          </div>
                                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${a._status === 'matched' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>{a._status === 'matched' ? 'MATCHED' : 'UNMATCHED'}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>)
                              })() : (
                                <div
                                  className={`border rounded-xl px-4 py-3 cursor-pointer flex justify-between items-center transition-all min-w-0 ${z.SuggestedMatch
                                    ? (z.SuggestedMatch.manuallySelected ? 'bg-blue-50/50 border-blue-200 hover:border-blue-400' : 'bg-emerald-50/50 border-emerald-200 hover:border-emerald-400')
                                    : 'bg-slate-50 border-dashed border-slate-300 hover:bg-slate-100 hover:border-slate-400 text-slate-500'
                                    }`}
                                  onClick={() => { setActiveSearchId(z.id); setSearchQuery(""); }}
                                >
                                  {z.SuggestedMatch ? (
                                    <>
                                      <div className="flex flex-col min-w-0 mr-2">
                                        <span className="font-bold text-sm text-slate-800 truncate" title={z.SuggestedMatch.Name}>{z.SuggestedMatch.Name}</span>
                                        {z.SuggestedMatch.Email && <span className="text-xs text-slate-500 truncate">{z.SuggestedMatch.Email}</span>}
                                      </div>
                                      {!z.SuggestedMatch.manuallySelected && <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2 py-1 rounded-md shrink-0">{Math.round(z.SuggestedMatch.score * 100)}%</span>}
                                      {z.SuggestedMatch.manuallySelected && <span className="text-xs font-bold text-blue-700 bg-blue-100/80 px-2 py-1 rounded-md shrink-0">Selected</span>}
                                    </>
                                  ) : (
                                    <span className="text-sm font-medium flex items-center gap-2 max-w-full"><Search size={14} className="opacity-70 shrink-0" /> <span className="truncate">Search manual match...</span></span>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Actions inline */}
                            <div className="flex items-center gap-2 shrink-0">
                              {z.SuggestedMatch ? (
                                <button onClick={() => handleApproveSuggestion(z.SuggestedMatch.id, z.id)} className="bg-slate-900 border border-slate-900 hover:bg-black text-white px-5 py-3 rounded-xl text-sm font-bold shadow-sm transition-all focus:ring-2 ring-slate-400 outline-none">Approve</button>
                              ) : (
                                <button onClick={() => { setActiveSearchId(z.id); setSearchQuery(""); }} className="bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50 px-5 py-3 rounded-xl text-sm font-bold shadow-sm transition-all">Link...</button>
                              )}
                              <button onClick={() => handleIgnore(z.id)} className="bg-white border border-transparent text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-200 px-4 py-3 rounded-xl text-sm font-bold transition-all">Ignore</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                })()}
              </div>
            </motion.div>
          )}

          {/* RESULTS VIEW */}
          {viewStep === 'results' && (
            <motion.div key="results" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center p-3 bg-emerald-100 text-emerald-600 rounded-full mb-4">
                  <CheckCircle2 size={28} />
                </div>
                <h2 className="text-3xl font-bold mb-3">Analysis Complete</h2>
                <p className="text-lg text-slate-500">We've generated the matched attendance records.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 max-w-3xl mx-auto">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center">
                  <span className="text-sm font-semibold tracking-wide text-slate-500 uppercase mb-2">Matched</span>
                  <span className="text-4xl font-extrabold text-emerald-500">{matched.length}</span>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center">
                  <span className="text-sm font-semibold tracking-wide text-slate-500 uppercase mb-2">Absent</span>
                  <span className="text-4xl font-extrabold text-red-400">{absent.length}</span>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center">
                  <span className="text-sm font-semibold tracking-wide text-slate-500 uppercase mb-2">Ignored Zoom Users</span>
                  <span className="text-4xl font-extrabold text-slate-400">{unmatchedZoom.filter(z => z.ignored).length}</span>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 text-center relative overflow-hidden">
                <h3 className="text-xl font-bold text-slate-800 mb-4 relative z-10">Your report is ready for export</h3>
                <p className="text-slate-500 max-w-md mx-auto mb-8 relative z-10 text-sm leading-relaxed">The generated Excel file contains 3 distinct sheets: Matched, Absent, and Ignored Zoom Users. <br /><br /><strong>Includes automatic WhatsApp format generation!</strong></p>

                <button onClick={handleDownload} className="relative z-10 bg-emerald-500 text-white hover:bg-emerald-600 active:bg-emerald-700 px-8 py-4 rounded-xl font-bold text-lg inline-flex items-center gap-3 shadow-[0_8px_30px_rgba(16,185,129,0.3)] transition-all hover:shadow-[0_8px_30px_rgba(16,185,129,0.4)] hover:-translate-y-0.5 outline-none">
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
