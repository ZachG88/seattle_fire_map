import { useState, useCallback, useEffect } from 'react';
import { useFireIncidents } from './hooks/useFireIncidents';
import { useApparatus } from './hooks/useApparatus';
import Header from './components/Header';
import IncidentSidebar from './components/IncidentSidebar';
import IncidentMap from './components/IncidentMap';
import LoadingScreen from './components/LoadingScreen';
import { AlertCircle, ChevronLeft, ChevronRight, ListFilter } from 'lucide-react';

function useIsMobile() {
  const [mobile, setMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return mobile;
}

export default function App() {
  const { incidents, loading, error, lastUpdated, refreshing, refresh } = useFireIncidents();
  const { apparatusMap, status: apparatusStatus, lastFetched: apparatusLastFetched } = useApparatus();
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null);
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 768);

  const handleSelectIncident = useCallback((incident) => {
    setSelectedIncident(prev => prev?.id === incident.id ? null : incident);
    // Close sidebar sheet when selecting an incident on mobile
    if (window.innerWidth < 768) setSidebarOpen(false);
  }, []);

  const handleFilterChange = useCallback((filter) => {
    setActiveFilter(filter);
    setSelectedIncident(null);
  }, []);

  const sidebarProps = {
    incidents,
    selectedId: selectedIncident?.id,
    onSelect: handleSelectIncident,
    activeFilter,
    onFilterChange: handleFilterChange,
    apparatusMap,
  };

  if (loading) {
    return (
      <div className="h-screen w-screen" style={{ background: '#0c0f18' }}>
        <LoadingScreen />
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden" style={{ background: '#0c0f18' }}>
      <Header
        lastUpdated={lastUpdated}
        refreshing={refreshing}
        onRefresh={refresh}
        incidentCount={incidents.length}
        error={error}
        apparatusStatus={apparatusStatus}
        apparatusLastFetched={apparatusLastFetched}
      />

      {error && (
        <div
          className="flex items-center gap-2 px-4 py-1.5 text-[11px] text-red-400 shrink-0"
          style={{ background: 'rgba(239,68,68,0.08)', borderBottom: '1px solid rgba(239,68,68,0.15)' }}
        >
          <AlertCircle size={11} />
          <span>{error} — Showing cached data if available</span>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden relative">

        {/* ── Desktop sidebar (in flex row, pushes map) ── */}
        {!isMobile && (
          <>
            <div
              className="relative shrink-0 overflow-hidden transition-all duration-300"
              style={{ width: sidebarOpen ? 300 : 0 }}
            >
              <div className="absolute inset-0 w-[300px]">
                <IncidentSidebar {...sidebarProps} />
              </div>
            </div>

            {/* Desktop sidebar toggle tab */}
            <button
              onClick={() => setSidebarOpen(o => !o)}
              className="absolute top-1/2 -translate-y-1/2 z-[600] flex items-center justify-center w-4 h-10 rounded-r-md
                text-slate-600 hover:text-slate-300 transition-all duration-150"
              style={{
                left: sidebarOpen ? 300 : 0,
                transition: 'left 0.3s',
                background: '#151c2c',
                border: '1px solid rgba(255,255,255,0.07)',
                borderLeft: 'none',
              }}
            >
              {sidebarOpen ? <ChevronLeft size={11} /> : <ChevronRight size={11} />}
            </button>
          </>
        )}

        {/* ── Map (full width on mobile) ── */}
        <div className="flex-1 relative overflow-hidden">
          <IncidentMap
            incidents={incidents}
            selectedIncident={selectedIncident}
            onSelect={handleSelectIncident}
            activeFilter={activeFilter}
            apparatusMap={apparatusMap}
          />
        </div>
      </div>

      {/* ── Mobile: sidebar bottom sheet overlay ── */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-[1500] flex flex-col justify-end"
          style={{ background: 'rgba(0,0,0,0.55)' }}
          onClick={e => { if (e.target === e.currentTarget) setSidebarOpen(false); }}
        >
          <div
            className="flex flex-col rounded-t-2xl overflow-hidden fade-in-up"
            style={{
              background: '#0c0f18',
              height: '68vh',
              border: '1px solid rgba(255,255,255,0.09)',
              borderBottom: 'none',
            }}
          >
            {/* Drag handle */}
            <div className="flex items-center justify-center pt-2.5 pb-1 shrink-0">
              <div className="w-9 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
            </div>
            <IncidentSidebar {...sidebarProps} />
          </div>
        </div>
      )}

      {/* ── Mobile: FAB to open sidebar ── */}
      {isMobile && !sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed bottom-5 left-4 z-[1000] flex items-center gap-2 px-3.5 py-2.5 rounded-full
            text-[12px] font-semibold text-slate-200 shadow-xl transition-all duration-150 active:scale-95"
          style={{
            background: '#1e2740',
            border: '1px solid rgba(255,255,255,0.12)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          }}
        >
          <ListFilter size={14} />
          <span>Incidents</span>
          {incidents.length > 0 && (
            <span
              className="px-1.5 py-0.5 rounded-full text-[10px] font-bold"
              style={{ background: 'rgba(239,68,68,0.2)', color: '#f87171' }}
            >
              {incidents.length}
            </span>
          )}
        </button>
      )}
    </div>
  );
}
