import React, { useEffect, useMemo, useState } from 'react';

const API_BASE = 'http://localhost:8000';

export default function Suggestions({
  currentScanId,
  setActivePage,
  currentTheme = 'dark',
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // ---------------------------------------------------------
  // Navigation state
  // ---------------------------------------------------------

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSuggestionId, setSelectedSuggestionId] = useState(null);

  const isLight = currentTheme === 'light';

  // ---------------------------------------------------------
  // Load suggestions
  // ---------------------------------------------------------

  useEffect(() => {
    if (!currentScanId) {
      setSuggestions([]);
      setErrorMsg('');
      setSelectedCategory(null);
      setSelectedSuggestionId(null);
      return;
    }

    const loadSuggestions = async () => {
      setLoading(true);
      setErrorMsg('');

      try {
        const response = await fetch(
          `${API_BASE}/api/scan/${currentScanId}/suggestions`,
          {
            method: 'GET',
            credentials: 'include',
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.detail || 'Failed to load scan suggestions.'
          );
        }

        setSuggestions(
          Array.isArray(data.suggestions)
            ? data.suggestions
            : []
        );
      } catch (error) {
        console.error('Suggestions loading error:', error);

        setErrorMsg(
          error.message || 'Unable to load suggestions.'
        );

        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    loadSuggestions();
  }, [currentScanId]);

  // ---------------------------------------------------------
  // Reset navigation when scan changes
  // ---------------------------------------------------------

  useEffect(() => {
    setSelectedCategory(null);
    setSelectedSuggestionId(null);
  }, [currentScanId]);

  // ---------------------------------------------------------
  // Group suggestions by category
  // ---------------------------------------------------------

  const groupedSuggestions = useMemo(() => {
    return suggestions.reduce((groups, suggestion) => {
      const category = suggestion.category || 'General';

      if (!groups[category]) {
        groups[category] = [];
      }

      groups[category].push(suggestion);

      return groups;
    }, {});
  }, [suggestions]);

  const categories = Object.keys(groupedSuggestions);

  // ---------------------------------------------------------
  // Current category suggestions
  // ---------------------------------------------------------

  const currentCategorySuggestions = selectedCategory
    ? groupedSuggestions[selectedCategory] || []
    : [];

  // ---------------------------------------------------------
  // Current suggestion
  // ---------------------------------------------------------

  const currentSuggestion = useMemo(() => {
    if (!selectedSuggestionId) {
      return null;
    }

    return (
      suggestions.find(
        (suggestion) =>
          suggestion.id === selectedSuggestionId
      ) || null
    );
  }, [suggestions, selectedSuggestionId]);

  // ---------------------------------------------------------
  // Category context
  // ---------------------------------------------------------

  const getCategoryContext = (category) => {
    const normalizedCategory = category.toLowerCase();

    if (normalizedCategory.includes('network')) {
      return 'Review services that are unnecessarily accessible to the network.';
    }

    if (normalizedCategory.includes('access')) {
      return 'Review services and resources that should be limited to trusted systems.';
    }

    if (normalizedCategory.includes('web')) {
      return 'Review web-facing configuration and security controls identified during scanning.';
    }

    if (normalizedCategory.includes('database')) {
      return 'Review database services and their network exposure or access requirements.';
    }

    return 'Review security improvements identified from the scan results.';
  };

  // ---------------------------------------------------------
  // Navigation handlers
  // ---------------------------------------------------------

  const openCategory = (category) => {
    setSelectedCategory(category);
    setSelectedSuggestionId(null);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const openSuggestion = (suggestion) => {
    setSelectedSuggestionId(suggestion.id);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const backToCategories = () => {
    setSelectedCategory(null);
    setSelectedSuggestionId(null);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const backToCategory = () => {
    setSelectedSuggestionId(null);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // ---------------------------------------------------------
  // Copy recommendation
  // ---------------------------------------------------------

  const copyRecommendation = async () => {
    if (!currentSuggestion?.recommendation) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        currentSuggestion.recommendation
      );
    } catch (error) {
      console.error('Failed to copy recommendation:', error);
    }
  };

  // ---------------------------------------------------------
  // Shared styling
  // ---------------------------------------------------------

  const pageBackground = isLight
    ? 'bg-white text-slate-900'
    : 'bg-[#070b12] text-white';

  const panelClass = isLight
    ? 'border-slate-200 bg-white'
    : 'border-slate-800 bg-slate-900/30';

  const primaryText = isLight
    ? 'text-slate-900'
    : 'text-slate-100';

  const secondaryText = isLight
    ? 'text-slate-600'
    : 'text-slate-400';

  const mutedText = isLight
    ? 'text-slate-500'
    : 'text-slate-500';

  const borderClass = isLight
    ? 'border-slate-200'
    : 'border-slate-800';

  // ---------------------------------------------------------
  // Render
  // ---------------------------------------------------------

  return (
    <main
      className={`flex-1 overflow-y-auto ${pageBackground}`}
    >
      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* =====================================================
            PAGE HEADER
        ====================================================== */}

        <div className="mb-8">
          <div className="flex items-start justify-between gap-6">

            <div>
              <p
                className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${mutedText}`}
              >
                Security Guidance
              </p>

              <h1
                className={`mt-2 text-2xl font-semibold tracking-tight ${primaryText}`}
              >
                Suggestions
              </h1>

              <p
                className={`mt-2 text-sm max-w-2xl leading-6 ${secondaryText}`}
              >
                Security recommendations generated from the
                selected scan. They highlight areas that may need
                review based on services, configurations, and
                observations identified during scanning.
              </p>
            </div>

            {currentScanId && (
              <div
                className={`shrink-0 px-3 py-2 rounded-md border text-xs ${panelClass}`}
              >
                <span className={mutedText}>
                  Scan
                </span>

                <span
                  className={`ml-2 font-medium ${primaryText}`}
                >
                  #{currentScanId}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* =====================================================
            NO SCAN SELECTED
        ====================================================== */}

        {!currentScanId && (
          <div
            className={`rounded-lg border p-10 text-center ${panelClass}`}
          >
            <div
              className={`mx-auto flex h-11 w-11 items-center justify-center rounded-md border ${borderClass}`}
            >
              <svg
                className={`w-5 h-5 ${mutedText}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                />

                <path
                  strokeLinecap="round"
                  d="M12 8v4l3 2"
                />
              </svg>
            </div>

            <h2
              className={`mt-4 text-base font-semibold ${primaryText}`}
            >
              No scan selected
            </h2>

            <p
              className={`mt-2 text-sm ${secondaryText}`}
            >
              Select a scan from Scan History to view its
              security recommendations.
            </p>

            <button
              type="button"
              onClick={() => setActivePage('scan-history')}
              className={`mt-5 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isLight
                  ? 'bg-slate-900 text-white hover:bg-slate-800'
                  : 'bg-white text-slate-900 hover:bg-slate-200'
              }`}
            >
              Open Scan History
            </button>
          </div>
        )}

        {/* =====================================================
            LOADING
        ====================================================== */}

        {currentScanId && loading && (
          <div
            className={`rounded-lg border p-10 text-center ${panelClass}`}
          >
            <div className="flex justify-center">
              <div
                className={`w-6 h-6 rounded-full border-2 border-t-transparent animate-spin ${
                  isLight
                    ? 'border-slate-700'
                    : 'border-slate-300'
                }`}
              />
            </div>

            <p
              className={`mt-4 text-sm ${secondaryText}`}
            >
              Loading security recommendations...
            </p>
          </div>
        )}

        {/* =====================================================
            ERROR
        ====================================================== */}

        {currentScanId && !loading && errorMsg && (
          <div
            className={`rounded-lg border p-5 ${
              isLight
                ? 'border-red-200 bg-red-50'
                : 'border-red-900/50 bg-red-950/20'
            }`}
          >
            <p
              className={`text-sm font-semibold ${
                isLight
                  ? 'text-red-800'
                  : 'text-red-300'
              }`}
            >
              Unable to load suggestions
            </p>

            <p
              className={`mt-1 text-sm ${
                isLight
                  ? 'text-red-700'
                  : 'text-red-400'
              }`}
            >
              {errorMsg}
            </p>
          </div>
        )}

        {/* =====================================================
            EMPTY STATE
        ====================================================== */}

        {currentScanId &&
          !loading &&
          !errorMsg &&
          suggestions.length === 0 && (
            <div
              className={`rounded-lg border p-10 text-center ${panelClass}`}
            >
              <h2
                className={`text-base font-semibold ${primaryText}`}
              >
                No suggestions generated
              </h2>

              <p
                className={`mt-2 text-sm ${secondaryText}`}
              >
                The selected scan currently has no stored
                security recommendations.
              </p>
            </div>
          )}

        {/* =====================================================
            LEVEL 1
            CATEGORY DIRECTORY
        ====================================================== */}

        {currentScanId &&
          !loading &&
          !errorMsg &&
          suggestions.length > 0 &&
          !selectedCategory && (
            <section>

              <div className="mb-5">
                <div className="flex items-end justify-between gap-4">

                  <div>
                    <p
                      className={`text-[11px] font-semibold uppercase tracking-[0.16em] ${mutedText}`}
                    >
                      Suggestions Directory
                    </p>

                    <h2
                      className={`mt-1 text-base font-semibold ${primaryText}`}
                    >
                      Browse by security area
                    </h2>

                    <p
                      className={`mt-1 text-xs max-w-2xl leading-5 ${secondaryText}`}
                    >
                      Recommendations are grouped into security
                      areas so related security improvements can
                      be reviewed together.
                    </p>
                  </div>

                  <p
                    className={`shrink-0 text-xs ${mutedText}`}
                  >
                    {suggestions.length}{' '}
                    {suggestions.length === 1
                      ? 'recommendation'
                      : 'recommendations'}{' '}
                    across {categories.length}{' '}
                    {categories.length === 1
                      ? 'category'
                      : 'categories'}
                  </p>
                </div>

                <div
                  className={`mt-4 h-px ${
                    isLight
                      ? 'bg-slate-200'
                      : 'bg-slate-800'
                  }`}
                />
              </div>

              {/* Category directory */}
              <div
                className={`rounded-lg border overflow-hidden ${panelClass}`}
              >
                {categories.map((category, index) => {
                  const categorySuggestions =
                    groupedSuggestions[category];

                  const count =
                    categorySuggestions.length;

                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => openCategory(category)}
                      className={`group w-full text-left px-5 py-5 transition-colors ${
                        index !== categories.length - 1
                          ? `border-b ${borderClass}`
                          : ''
                      } ${
                        isLight
                          ? 'hover:bg-slate-50'
                          : 'hover:bg-slate-900/70'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-6">

                        <div className="min-w-0">

                          <h3
                            className={`text-sm font-semibold ${primaryText}`}
                          >
                            {category}
                          </h3>

                          <p
                            className={`mt-1 text-xs leading-5 max-w-2xl ${secondaryText}`}
                          >
                            {getCategoryContext(category)}
                          </p>

                          <p
                            className={`mt-2 text-[11px] ${mutedText}`}
                          >
                            {count}{' '}
                            {count === 1
                              ? 'recommendation'
                              : 'recommendations'}
                          </p>
                        </div>

                        <div
                          className="flex items-center gap-3 shrink-0"
                        >
                          <span
                            className={`text-xs ${mutedText}`}
                          >
                            {count}
                          </span>

                          <svg
                            className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${mutedText}`}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

        {/* =====================================================
            LEVEL 2
            SUGGESTIONS INSIDE CATEGORY
        ====================================================== */}

        {currentScanId &&
          !loading &&
          !errorMsg &&
          selectedCategory &&
          !selectedSuggestionId && (
            <section>

              {/* Back */}
              <button
                type="button"
                onClick={backToCategories}
                className={`inline-flex items-center gap-2 text-xs font-medium transition-colors ${
                  isLight
                    ? 'text-slate-500 hover:text-slate-900'
                    : 'text-slate-500 hover:text-slate-200'
                }`}
              >
                <svg
                  className="w-3.5 h-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 18l-6-6 6-6"
                  />
                </svg>

                Suggestions
              </button>

              {/* Category heading */}
              <div className="mt-6 mb-5">

                <p
                  className={`text-[11px] font-semibold uppercase tracking-[0.16em] ${mutedText}`}
                >
                  Security Area
                </p>

                <div className="flex items-end justify-between gap-4 mt-1">

                  <div>
                    <h2
                      className={`text-xl font-semibold ${primaryText}`}
                    >
                      {selectedCategory}
                    </h2>

                    <p
                      className={`mt-1 text-xs max-w-2xl leading-5 ${secondaryText}`}
                    >
                      {getCategoryContext(selectedCategory)}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 text-xs ${mutedText}`}
                  >
                    {currentCategorySuggestions.length}{' '}
                    {currentCategorySuggestions.length === 1
                      ? 'recommendation'
                      : 'recommendations'}
                  </span>
                </div>

                <div
                  className={`mt-4 h-px ${
                    isLight
                      ? 'bg-slate-200'
                      : 'bg-slate-800'
                  }`}
                />
              </div>

              {/* Suggestion directory */}
              <div
                className={`rounded-lg border overflow-hidden ${panelClass}`}
              >
                {currentCategorySuggestions.map(
                  (suggestion, index) => (
                    <button
                      key={suggestion.id}
                      type="button"
                      onClick={() =>
                        openSuggestion(suggestion)
                      }
                      className={`group w-full text-left px-5 py-5 transition-colors ${
                        index !==
                        currentCategorySuggestions.length - 1
                          ? `border-b ${borderClass}`
                          : ''
                      } ${
                        isLight
                          ? 'hover:bg-slate-50'
                          : 'hover:bg-slate-900/70'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-6">

                        <div className="min-w-0">

                          <h3
                            className={`text-sm font-semibold ${primaryText}`}
                          >
                            {suggestion.title ||
                              'Security recommendation'}
                          </h3>

                          {suggestion.reason && (
                            <p
                              className={`mt-2 text-xs leading-5 max-w-3xl ${secondaryText}`}
                            >
                              {suggestion.reason}
                            </p>
                          )}

                          <p
                            className={`mt-2 text-[11px] ${mutedText}`}
                          >
                            Suggestion #{suggestion.id}
                          </p>
                        </div>

                        <svg
                          className={`w-4 h-4 shrink-0 transition-transform group-hover:translate-x-1 ${mutedText}`}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </button>
                  )
                )}
              </div>
            </section>
          )}

        {/* =====================================================
            LEVEL 3
            SUGGESTION DETAIL
        ====================================================== */}

        {currentScanId &&
          !loading &&
          !errorMsg &&
          selectedCategory &&
          selectedSuggestionId &&
          currentSuggestion && (
            <section>

              {/* Back */}
              <button
                type="button"
                onClick={backToCategory}
                className={`inline-flex items-center gap-2 text-xs font-medium transition-colors ${
                  isLight
                    ? 'text-slate-500 hover:text-slate-900'
                    : 'text-slate-500 hover:text-slate-200'
                }`}
              >
                <svg
                  className="w-3.5 h-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 18l-6-6 6-6"
                  />
                </svg>

                {selectedCategory}
              </button>

              {/* Detail heading */}
              <div className="mt-6 mb-6">

                <p
                  className={`text-[11px] font-semibold uppercase tracking-[0.16em] ${mutedText}`}
                >
                  Recommendation
                </p>

                <h2
                  className={`mt-2 text-xl font-semibold ${primaryText}`}
                >
                  {currentSuggestion.title ||
                    'Security recommendation'}
                </h2>

                <div className="flex items-center gap-3 mt-2">
                  <span
                    className={`text-xs ${mutedText}`}
                  >
                    {selectedCategory}
                  </span>

                  <span className={mutedText}>
                    •
                  </span>

                  <span
                    className={`text-xs ${mutedText}`}
                  >
                    Suggestion #{currentSuggestion.id}
                  </span>
                </div>
              </div>

              {/* Detail panel */}
              <div
                className={`rounded-lg border ${panelClass}`}
              >

                {/* Why */}
                <div className="p-6">

                  <p
                    className={`text-[11px] font-semibold uppercase tracking-[0.15em] ${mutedText}`}
                  >
                    Why this was suggested
                  </p>

                  <p
                    className={`mt-3 text-sm leading-7 ${secondaryText}`}
                  >
                    {currentSuggestion.reason ||
                      'No reason was provided by the backend.'}
                  </p>
                </div>

                <div
                  className={`h-px ${
                    isLight
                      ? 'bg-slate-200'
                      : 'bg-slate-800'
                  }`}
                />

                {/* Recommendation */}
                <div className="p-6">

                  <p
                    className={`text-[11px] font-semibold uppercase tracking-[0.15em] ${mutedText}`}
                  >
                    Recommendation
                  </p>

                  <p
                    className={`mt-3 text-sm leading-7 ${secondaryText}`}
                  >
                    {currentSuggestion.recommendation ||
                      'No recommendation was provided by the backend.'}
                  </p>
                </div>

                <div
                  className={`h-px ${
                    isLight
                      ? 'bg-slate-200'
                      : 'bg-slate-800'
                  }`}
                />

                {/* Metadata and actions */}
                <div
                  className={`px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4`}
                >
                  <div className="flex flex-wrap gap-x-5 gap-y-2">

                    <span
                      className={`text-[11px] ${mutedText}`}
                    >
                      Scan #{currentSuggestion.scan_id}
                    </span>

                    {currentSuggestion.created_at && (
                      <span
                        className={`text-[11px] ${mutedText}`}
                      >
                        Generated{' '}
                        {new Date(
                          currentSuggestion.created_at
                        ).toLocaleString()}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={copyRecommendation}
                    className={`shrink-0 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                      isLight
                        ? 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        : 'border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    Copy recommendation
                  </button>
                </div>
              </div>

              {/* Bottom navigation */}
              <div className="mt-5">
                <button
                  type="button"
                  onClick={backToCategory}
                  className={`inline-flex items-center gap-2 text-xs font-medium transition-colors ${
                    isLight
                      ? 'text-slate-600 hover:text-slate-900'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <svg
                    className="w-3.5 h-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 18l-6-6 6-6"
                    />
                  </svg>

                  Back to {selectedCategory}
                </button>
              </div>
            </section>
          )}
      </div>
    </main>
  );
}