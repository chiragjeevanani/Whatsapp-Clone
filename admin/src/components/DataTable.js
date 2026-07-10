import React, { useState } from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";

export default function DataTable({ columns, data, searchableKey, placeholder = "Filter records..." }) {
  const [query, setQuery] = useState("");
  const [sortConfig, setSortConfig] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter records
  const filteredData = React.useMemo(() => {
    if (!query) return data;
    return data.filter((item) => {
      const val = item[searchableKey];
      return val && String(val).toLowerCase().includes(query.toLowerCase());
    });
  }, [data, query, searchableKey]);

  // Sort records
  const sortedData = React.useMemo(() => {
    if (!sortConfig) return filteredData;
    const sorted = [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === "ascending" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "ascending" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredData, sortConfig]);

  // Paginated records
  const paginatedData = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(start, start + itemsPerPage);
  }, [sortedData, currentPage]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="space-y-4 w-full select-none">
      {/* Search Filter Header */}
      {searchableKey && (
        <div className="relative w-72 max-w-sm">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-secondary border border-border rounded-lg pl-9 pr-4 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-150"
          />
        </div>
      )}

      {/* Main Table Structure */}
      <div className="border border-border rounded-xl bg-card overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-secondary text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border font-bold">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => col.sortable && requestSort(col.key)}
                    className={`px-6 py-4 font-semibold ${col.sortable ? "cursor-pointer hover:text-foreground transition-colors" : ""}`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{col.label}</span>
                      {col.sortable && sortConfig?.key === col.key && (
                        sortConfig.direction === "ascending" ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-foreground font-medium bg-card">
              {paginatedData.length > 0 ? (
                paginatedData.map((row, index) => (
                  <tr key={row.id || index} className="hover:bg-secondary/20 transition-colors">
                    {columns.map((col) => (
                      <td key={col.key} className="px-6 py-3.5 align-middle">
                        {col.render ? col.render(row) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-10 text-center text-muted-foreground text-sm font-normal">
                    No matching records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Footer controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs px-2 pt-2 text-muted-foreground font-semibold">
          <span>
            Page {currentPage} of {totalPages} ({sortedData.length} records)
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((c) => Math.max(1, c - 1))}
              disabled={currentPage === 1}
              className="px-3.5 py-1.5 rounded-lg border border-border bg-card hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((c) => Math.min(totalPages, c + 1))}
              disabled={currentPage === totalPages}
              className="px-3.5 py-1.5 rounded-lg border border-border bg-card hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
