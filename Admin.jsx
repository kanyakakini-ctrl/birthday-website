import React, { useState, useEffect } from 'react';
import {
  Save,
  ArrowLeft,
  Upload,
  Plus,
  Trash2,
  Image as ImageIcon,
  Key,
  User,
  Heart,
  Gift,
  Music,
  CheckCircle,
  FileText,
  Sparkles,
  Download,
  UploadCloud,
  RotateCcw,
} from 'lucide-react';
import birthdayApi from '../services/birthdayApi';
import { birthdayConfig as defaultConfig } from '../config/birthdayConfig';
import { normalizeImagePath } from '../utils/imageHelper';

export const Admin = ({ onBackToSurprise }) => {
  const [config, setConfig] = useState(null);
  const [statusMsg, setStatusMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhotos, setIsUploadingPhotos] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    async function loadData() {
      const data = await birthdayApi.getConfig();
      setConfig(data);
    }
    loadData();
  }, []);

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setStatusMsg('');

    try {
      await birthdayApi.saveConfig(config);
      setStatusMsg('✅ Birthday configuration saved successfully!');
      setTimeout(() => setStatusMsg(''), 4000);
    } catch (err) {
      console.error(err);
      setStatusMsg('❌ Failed to save. Saved to browser storage.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (file, type, callback) => {
    if (!file) return;
    setStatusMsg('⏳ Uploading image...');
    try {
      const result = await birthdayApi.uploadFile(file, type);
      if (result && result.url) {
        callback(result.url);
        setStatusMsg('✅ Image uploaded successfully!');
        setTimeout(() => setStatusMsg(''), 3000);
      }
    } catch (err) {
      console.error(err);
      setStatusMsg('❌ Upload failed.');
    }
  };

  // Direct Multiple WhatsApp / Camera Photo Uploader
  const handleDirectPhotoUpload = async (files) => {
    if (!files || files.length === 0) return;
    setIsUploadingPhotos(true);
    setStatusMsg(`⏳ Uploading ${files.length} WhatsApp photo(s)...`);

    try {
      const result = await birthdayApi.uploadMultipleFiles(files, 'photo');
      if (result && result.files && result.files.length > 0) {
        const existingMemories = config?.memories || [];
        const newEntries = result.files.map((fileObj, i) => {
          const rawName = fileObj.originalName || fileObj.filename || `Photo ${existingMemories.length + i + 1}`;
          const cleanCaption = rawName.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
          return {
            id: Date.now() + i,
            image: fileObj.url,
            caption: cleanCaption || `Memory ${existingMemories.length + i + 1}`,
            date: 'Special Moment ✨',
            note: 'A special memory with you!',
          };
        });

        const updatedMemories = [...existingMemories, ...newEntries];
        const updatedConfig = {
          ...config,
          memories: updatedMemories,
        };

        // Automatically link first uploaded photo to unlockScreen / celebrationScreen if placeholder
        if (newEntries[0]?.image) {
          if (!updatedConfig.unlockScreen?.photo || updatedConfig.unlockScreen.photo.includes('.svg')) {
            updatedConfig.unlockScreen = { ...updatedConfig.unlockScreen, photo: newEntries[0].image };
          }
          if (!updatedConfig.celebrationScreen?.mainPhoto || updatedConfig.celebrationScreen.mainPhoto.includes('.svg')) {
            updatedConfig.celebrationScreen = { ...updatedConfig.celebrationScreen, mainPhoto: newEntries[1]?.image || newEntries[0].image };
          }
        }

        setConfig(updatedConfig);
        // Automatically save to backend JSON in background
        await birthdayApi.saveConfig(updatedConfig);

        setStatusMsg(`🎉 Successfully uploaded and added ${newEntries.length} photo(s)! Saved automatically.`);
        setTimeout(() => setStatusMsg(''), 5000);
      }
    } catch (err) {
      console.error('Photo upload error:', err);
      setStatusMsg('❌ Failed to upload photos. Please try again.');
    } finally {
      setIsUploadingPhotos(false);
    }
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(config, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `birthday-config-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportPicturesTemplate = () => {
    const templateData = (config?.memories && config.memories.length > 0)
      ? config.memories
      : [
          {
            id: 1,
            image: "photo1.jpg",
            caption: "Our Favorite Beginning",
            date: "14 Feb 2024",
            note: "Every journey starts with a single step, and every memory with you is pure gold. 💫"
          },
          {
            id: 2,
            image: "photo2.jpg",
            caption: "Sweet Moments & Laughter",
            date: "Endless Smiles 😊",
            note: "Remember this day? We laughed so hard our stomachs hurt! You always bring so much joy. 🌟"
          },
          {
            id: 3,
            image: "photo3.jpg",
            caption: "Unforgettable Adventures",
            date: "Pure Magic 🌿",
            note: "Life with you is never dull. Here's to all the unplanned adventures and great stories. 🌈"
          }
        ];
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(templateData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `birthday-photos-template.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const parseAndApplyPictureData = (parsed) => {
    // If it's a full configuration object (contains recipientName or pin or memories)
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed) && (parsed.recipientName || parsed.pin)) {
      // Normalize image paths in memories
      const updated = { ...parsed };
      if (Array.isArray(updated.memories)) {
        updated.memories = updated.memories.map((m, i) => ({
          ...m,
          id: m.id || Date.now() + i,
          image: normalizeImagePath(m.image),
          caption: m.caption || `Memory ${i + 1}`,
          date: m.date || '',
          note: m.note || '',
        }));
      }
      setConfig(updated);
      return `✅ Full configuration & ${updated.memories?.length || 0} pictures imported! Click "Save Changes" to apply.`;
    }

    // If it's an array of picture objects or string paths
    let rawList = [];
    if (Array.isArray(parsed)) {
      rawList = parsed;
    } else if (parsed && typeof parsed === 'object') {
      if (Array.isArray(parsed.memories)) rawList = parsed.memories;
      else if (Array.isArray(parsed.photos)) rawList = parsed.photos;
      else if (Array.isArray(parsed.pictures)) rawList = parsed.pictures;
      else if (Array.isArray(parsed.images)) rawList = parsed.images;
    }

    if (rawList.length > 0) {
      const formattedMemories = rawList.map((item, index) => {
        if (typeof item === 'string') {
          return {
            id: Date.now() + index,
            image: normalizeImagePath(item),
            caption: `Memory ${index + 1}`,
            date: '',
            note: '',
          };
        }
        return {
          id: item.id || Date.now() + index,
          image: normalizeImagePath(item.image || item.src || item.url || item.path || item.filename || `photo${index + 1}.jpg`),
          caption: item.caption || item.title || item.name || `Memory ${index + 1}`,
          date: item.date || item.occasion || item.year || '',
          note: item.note || item.message || item.description || '',
        };
      });

      setConfig((prev) => {
        const next = { ...prev, memories: formattedMemories };
        // If unlock or celebration photo is still placeholder, update with first pictures
        if (formattedMemories[0]?.image && (!next.unlockScreen?.photo || next.unlockScreen.photo.includes('.svg'))) {
          next.unlockScreen = { ...next.unlockScreen, photo: formattedMemories[0].image };
        }
        if (formattedMemories[1]?.image && (!next.celebrationScreen?.mainPhoto || next.celebrationScreen.mainPhoto.includes('.svg'))) {
          next.celebrationScreen = { ...next.celebrationScreen, mainPhoto: formattedMemories[1].image };
        }
        return next;
      });

      return `✅ Successfully imported ${formattedMemories.length} pictures! Click "Save Changes" to apply.`;
    }

    throw new Error('Unrecognized JSON picture format');
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        const successMsg = parseAndApplyPictureData(parsed);
        setStatusMsg(successMsg);
        setTimeout(() => setStatusMsg(''), 5000);
      } catch (err) {
        console.error('Import error:', err);
        setStatusMsg('❌ Invalid JSON file. Please use the picture template format.');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input to allow re-importing same file
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset everything back to the default placeholders?')) {
      setConfig(defaultConfig);
      setStatusMsg('🔄 Reset to defaults. Click "Save Changes" to confirm.');
    }
  };

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-50 text-purple-900 font-bubbly">
        Loading Admin Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 sm:p-6 md:p-8 font-body">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl shadow-sm border border-purple-100">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToSurprise}
              className="p-2 rounded-2xl bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors cursor-pointer"
              title="Return to Surprise Website"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold font-bubbly text-purple-950 flex items-center gap-2">
                🎂 Birthday Surprise Admin Panel
              </h1>
              <p className="text-xs text-slate-500">
                Customize your birthday experience without writing any code.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleExport}
              title="Export config as JSON"
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>

            <label
              title="Import JSON config"
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Import</span>
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>

            <button
              onClick={handleReset}
              title="Reset all settings to default"
              className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              onClick={onBackToSurprise}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
            >
              Preview
            </button>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white text-xs font-bold shadow-md shadow-purple-200 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>

        {/* Status Alert */}
        {statusMsg && (
          <div className="p-3.5 rounded-2xl bg-purple-100 text-purple-900 border border-purple-200 text-sm font-semibold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-purple-200 pb-2">
          {[
            { id: 'general', label: 'Basic Info & PIN', icon: Key },
            { id: 'screens', label: 'Screen Messages', icon: FileText },
            { id: 'memories', label: 'Memory Photos', icon: ImageIcon },
            { id: 'gifts', label: 'Gifts & Rewards', icon: Gift },
            { id: 'final', label: 'Final Letter', icon: Heart },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold font-bubbly transition-all cursor-pointer ${
                  active
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-purple-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: General & PIN */}
        {activeTab === 'general' && (
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-purple-100 space-y-6">
            <h2 className="text-lg font-bold font-bubbly text-purple-900 border-b pb-2">
              👤 Recipient & Security PIN
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Recipient Name
                </label>
                <input
                  type="text"
                  value={config.recipientName || ''}
                  onChange={(e) =>
                    setConfig({ ...config, recipientName: e.target.value })
                  }
                  placeholder="e.g. Sarah, Alex, Mom"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Unlock 4-Digit PIN
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={config.pin || ''}
                  onChange={(e) =>
                    setConfig({ ...config, pin: e.target.value })
                  }
                  placeholder="e.g. 1234 or birth date"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium text-sm tracking-widest"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Nickname / Tagline
              </label>
              <input
                type="text"
                value={config.nickname || ''}
                onChange={(e) =>
                  setConfig({ ...config, nickname: e.target.value })
                }
                placeholder="e.g. Birthday Star ⭐"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium text-sm"
              />
            </div>
          </div>
        )}

        {/* TAB 2: Screen Messages */}
        {activeTab === 'screens' && (
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-purple-100 space-y-6">
            <h2 className="text-lg font-bold font-bubbly text-purple-900 border-b pb-2">
              📝 Surprise Screen Text & Prompts
            </h2>

            {/* Screen 1 */}
            <div className="space-y-3 bg-purple-50/50 p-4 rounded-2xl border border-purple-100">
              <h3 className="text-sm font-bold text-purple-900">Screen 1: Unlock Screen</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Heading</label>
                  <input
                    type="text"
                    value={config.unlockScreen?.title || ''}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        unlockScreen: { ...config.unlockScreen, title: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={config.unlockScreen?.subtitle || ''}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        unlockScreen: { ...config.unlockScreen, subtitle: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Screen 2 */}
            <div className="space-y-3 bg-purple-50/50 p-4 rounded-2xl border border-purple-100">
              <h3 className="text-sm font-bold text-purple-900">Screen 2: Surprise Question</h3>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Surprise Question</label>
                <textarea
                  rows={2}
                  value={config.surpriseScreen?.question || ''}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      surpriseScreen: { ...config.surpriseScreen, question: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm font-medium"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">YES Button Text</label>
                  <input
                    type="text"
                    value={config.surpriseScreen?.yesButtonText || ''}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        surpriseScreen: { ...config.surpriseScreen, yesButtonText: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">NO Button Text</label>
                  <input
                    type="text"
                    value={config.surpriseScreen?.noButtonText || ''}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        surpriseScreen: { ...config.surpriseScreen, noButtonText: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Screen 3 */}
            <div className="space-y-3 bg-purple-50/50 p-4 rounded-2xl border border-purple-100">
              <h3 className="text-sm font-bold text-purple-900">Screen 3: Birthday Celebration</h3>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Main Heading</label>
                <input
                  type="text"
                  value={config.celebrationScreen?.birthdayTitle || ''}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      celebrationScreen: { ...config.celebrationScreen, birthdayTitle: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Celebration Wish Message</label>
                <input
                  type="text"
                  value={config.celebrationScreen?.subheading || ''}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      celebrationScreen: { ...config.celebrationScreen, subheading: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Memory Photos */}
        {activeTab === 'memories' && (
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-purple-100 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
              <div>
                <h2 className="text-lg font-bold font-bubbly text-purple-900">
                  📸 Memory Gallery Photos
                </h2>
                <p className="text-xs text-slate-500">
                  Manage pictures, captions, dates, and memory notes.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportPicturesTemplate}
                  title="Download a ready-to-edit JSON template for your pictures"
                  className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold font-bubbly flex items-center gap-1.5 cursor-pointer transition-all border border-purple-200"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download JSON Template</span>
                </button>

                <label
                  title="Import a pictures JSON file"
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold font-bubbly flex items-center gap-1.5 cursor-pointer transition-all shadow-sm"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Import Pictures JSON</span>
                  <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                </label>

                <button
                  type="button"
                  onClick={() => {
                    const newMem = {
                      id: Date.now(),
                      image: '/assets/photos/photo1.svg',
                      caption: 'New Memory ✨',
                      date: 'Happy Day',
                      note: 'Add your custom message here.',
                    };
                    setConfig({
                      ...config,
                      memories: [...(config.memories || []), newMem],
                    });
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold font-bubbly flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Single</span>
                </button>
              </div>
            </div>

            {/* ── UPLOAD WHATSAPP PHOTOS ZONE ── */}
            <label
              className={`group relative flex flex-col items-center justify-center gap-3 w-full min-h-[160px] rounded-3xl border-2 border-dashed transition-all cursor-pointer
                ${isUploadingPhotos
                  ? 'border-pink-400 bg-pink-50/70 animate-pulse cursor-not-allowed'
                  : 'border-pink-300 bg-gradient-to-br from-pink-50 to-purple-50 hover:border-pink-500 hover:bg-pink-50'
                }`}
            >
              <div className="flex flex-col items-center gap-2 pointer-events-none select-none">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center shadow-lg">
                  <UploadCloud className="w-7 h-7 text-white" />
                </div>
                <div className="text-center">
                  <p className="text-base font-bold font-bubbly text-purple-900">
                    {isUploadingPhotos ? '⏳ Uploading photos…' : '📱 Upload WhatsApp Photos'}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {isUploadingPhotos
                      ? 'Please wait, do not close this page'
                      : 'Click here or drag & drop — JPG, JPEG, PNG, WEBP · Multiple files OK'}
                  </p>
                </div>
                {!isUploadingPhotos && (
                  <span className="px-4 py-1.5 rounded-full bg-pink-500 text-white text-xs font-bold shadow-sm group-hover:bg-pink-600 transition-colors">
                    Select Photos
                  </span>
                )}
              </div>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                multiple
                className="absolute inset-0 opacity-0 cursor-pointer"
                disabled={isUploadingPhotos}
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleDirectPhotoUpload(Array.from(e.target.files));
                    e.target.value = '';
                  }
                }}
              />
            </label>

            <div className="space-y-4">
              {(config.memories || []).map((mem, index) => (
                <div
                  key={mem.id || index}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row gap-4 items-start"
                >
                  {/* Photo Preview & Upload */}
                  <div className="flex flex-col items-center gap-2 flex-shrink-0">
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-white border border-slate-200 shadow-sm">
                      <img
                        src={mem.image}
                        alt={mem.caption}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/assets/photos/photo1.svg';
                        }}
                      />
                    </div>
                    <label className="cursor-pointer px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-[11px] font-semibold text-slate-700 flex items-center gap-1 shadow-sm">
                      <Upload className="w-3 h-3 text-purple-600" />
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleFileUpload(e.target.files[0], 'photo', (url) => {
                              const updated = [...config.memories];
                              updated[index].image = url;
                              setConfig({ ...config, memories: updated });
                            });
                          }
                        }}
                      />
                    </label>
                  </div>

                  {/* Fields */}
                  <div className="flex-1 space-y-2.5 w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-0.5">
                          Caption / Title
                        </label>
                        <input
                          type="text"
                          value={mem.caption || ''}
                          onChange={(e) => {
                            const updated = [...config.memories];
                            updated[index].caption = e.target.value;
                            setConfig({ ...config, memories: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-0.5">
                          Date / Occasion
                        </label>
                        <input
                          type="text"
                          value={mem.date || ''}
                          onChange={(e) => {
                            const updated = [...config.memories];
                            updated[index].date = e.target.value;
                            setConfig({ ...config, memories: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-0.5">
                        Heartfelt Memory Note
                      </label>
                      <input
                        type="text"
                        value={mem.note || ''}
                        onChange={(e) => {
                          const updated = [...config.memories];
                          updated[index].note = e.target.value;
                          setConfig({ ...config, memories: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                      />
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => {
                      const updated = config.memories.filter((_, i) => i !== index);
                      setConfig({ ...config, memories: updated });
                    }}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg self-end sm:self-center"
                    title="Remove Photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Gifts */}
        {activeTab === 'gifts' && (
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-purple-100 space-y-6">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h2 className="text-lg font-bold font-bubbly text-purple-900">
                  🎁 Surprise Gifts
                </h2>
                <p className="text-xs text-slate-500">
                  Configure interactive gift boxes and personalized reveals.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newGift = {
                    id: Date.now(),
                    title: `Surprise Gift #${(config.gifts?.length || 0) + 1}`,
                    boxLabel: `Gift ${(config.gifts?.length || 0) + 1}`,
                    image: '/assets/gifts/gift1.svg',
                    badge: '💖 Special Surprise',
                    message: 'Your custom surprise message here!',
                  };
                  setConfig({
                    ...config,
                    gifts: [...(config.gifts || []), newGift],
                  });
                }}
                className="px-3 py-1.5 rounded-xl bg-purple-100 text-purple-800 hover:bg-purple-200 text-xs font-bold font-bubbly flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Gift</span>
              </button>
            </div>

            <div className="space-y-4">
              {(config.gifts || []).map((gift, index) => (
                <div
                  key={gift.id || index}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row gap-4 items-start"
                >
                  {/* Gift Icon / Upload */}
                  <div className="flex flex-col items-center gap-2 flex-shrink-0">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-white border border-slate-200 shadow-sm p-1">
                      <img
                        src={gift.image}
                        alt={gift.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <label className="cursor-pointer px-2 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-[10px] font-semibold text-slate-700 flex items-center gap-1 shadow-sm">
                      <Upload className="w-3 h-3 text-purple-600" />
                      <span>Box Icon</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleFileUpload(e.target.files[0], 'gift', (url) => {
                              const updated = [...config.gifts];
                              updated[index].image = url;
                              setConfig({ ...config, gifts: updated });
                            });
                          }
                        }}
                      />
                    </label>
                  </div>

                  {/* Fields */}
                  <div className="flex-1 space-y-2.5 w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-0.5">
                          Gift Title
                        </label>
                        <input
                          type="text"
                          value={gift.title || ''}
                          onChange={(e) => {
                            const updated = [...config.gifts];
                            updated[index].title = e.target.value;
                            setConfig({ ...config, gifts: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-0.5">
                          Box Label / Badge
                        </label>
                        <input
                          type="text"
                          value={gift.boxLabel || ''}
                          onChange={(e) => {
                            const updated = [...config.gifts];
                            updated[index].boxLabel = e.target.value;
                            setConfig({ ...config, gifts: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-0.5">
                        Surprise Revealed Message
                      </label>
                      <textarea
                        rows={2}
                        value={gift.message || ''}
                        onChange={(e) => {
                          const updated = [...config.gifts];
                          updated[index].message = e.target.value;
                          setConfig({ ...config, gifts: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                      />
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => {
                      const updated = config.gifts.filter((_, i) => i !== index);
                      setConfig({ ...config, gifts: updated });
                    }}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg self-end sm:self-center"
                    title="Remove Gift"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: Final Letter */}
        {activeTab === 'final' && (
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-purple-100 space-y-6">
            <h2 className="text-lg font-bold font-bubbly text-purple-900 border-b pb-2">
              💌 Final Emotional Birthday Letter
            </h2>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Letter Heading
              </label>
              <input
                type="text"
                value={config.finalMessage?.heading || ''}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    finalMessage: { ...config.finalMessage, heading: e.target.value },
                  })
                }
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Personal Birthday Letter Content
              </label>
              <textarea
                rows={8}
                value={config.finalMessage?.content || ''}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    finalMessage: { ...config.finalMessage, content: e.target.value },
                  })
                }
                placeholder="Write your personal, emotional message here..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-body leading-relaxed focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Signature
              </label>
              <input
                type="text"
                value={config.finalMessage?.signature || ''}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    finalMessage: { ...config.finalMessage, signature: e.target.value },
                  })
                }
                placeholder="e.g. With all my love 💕"
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium"
              />
            </div>
          </div>
        )}

        {/* Instructions & Help Card */}
        <div className="p-5 rounded-3xl bg-purple-100/70 border border-purple-200 space-y-2 text-xs text-purple-950">
          <h4 className="font-bold font-bubbly text-sm flex items-center gap-1.5 text-purple-900">
            💡 Quick Guide for Personalizing
          </h4>
          <p>
            • <strong>Replace Photos Manually:</strong> Drop your photos into{' '}
            <code className="bg-white px-1.5 py-0.5 rounded text-purple-800">/public/assets/photos/</code>{' '}
            named <code className="bg-white px-1.5 py-0.5 rounded">photo1.jpg</code>,{' '}
            <code className="bg-white px-1.5 py-0.5 rounded">photo2.jpg</code>, etc.
          </p>
          <p>
            • <strong>Or Use the Admin Panel:</strong> Upload photos directly on this page and hit{' '}
            <strong>"Save Changes"</strong> to immediately update!
          </p>
          <p>
            • <strong>Background Music:</strong> Put an audio file named{' '}
            <code className="bg-white px-1.5 py-0.5 rounded text-purple-800">birthday.mp3</code> in{' '}
            <code className="bg-white px-1.5 py-0.5 rounded text-purple-800">/public/assets/music/</code>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Admin;
