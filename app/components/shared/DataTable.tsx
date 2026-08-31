"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

export type DataTableColumn<T> = {
  key: string;
  header: ReactNode;
  align?: "left" | "right" | "center";
  /** `rowIndex` is the row's absolute position (0-based) across all pages. */
  render: (row: T, rowIndex: number) => ReactNode;
};

export type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowId: (row: T) => string | number;
  onRowClick?: (row: T) => void;
  emptyMessage: string;
  /** Client-side mode only: returns true when `row` matches `term` (already lowercased/trimmed). */
  searchPredicate?: (row: T, term: string) => boolean;
  searchPlaceholder?: string;
  noMatchMessage?: string;
  rowsPerPageOptions?: number[];
  defaultRowsPerPage?: number;
  /** Adds a checkbox column. `selectedIds`/`onSelectionChange` are required together when true. */
  selectable?: boolean;
  selectedIds?: Set<string | number>;
  onSelectionChange?: (ids: Set<string | number>) => void;
  /** Shows a spinner in place of the rows while the data is being fetched. */
  loading?: boolean;

  /**
   * Server-side mode: `rows` is assumed to already be exactly the current page's
   * (already-filtered) data — pagination and search no longer happen client-side.
   */
  serverSide?: boolean;
  page?: number;
  rowsPerPage?: number;
  totalCount?: number;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  /** Controlled search text — updates on every keystroke, but the query only runs on submit. */
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  /** Fires when the admin presses Enter or clicks the search icon. */
  onSearchSubmit?: () => void;
  /** Shows a refresh button next to the search box that re-runs the current query. */
  onRefresh?: () => void;
};

export default function DataTable<T>({
  columns,
  rows,
  getRowId,
  onRowClick,
  emptyMessage,
  searchPredicate,
  searchPlaceholder,
  noMatchMessage,
  rowsPerPageOptions = [5, 10, 25, 50],
  defaultRowsPerPage = 10,
  selectable = false,
  selectedIds,
  onSelectionChange,
  loading = false,
  serverSide = false,
  page: controlledPage,
  rowsPerPage: controlledRowsPerPage,
  totalCount,
  onPageChange,
  onRowsPerPageChange,
  searchValue,
  onSearchChange,
  onSearchSubmit,
  onRefresh,
}: DataTableProps<T>) {
  const { t } = useTranslation();
  const [internalSearch, setInternalSearch] = useState("");
  const [internalPage, setInternalPage] = useState(0);
  const [internalRowsPerPage, setInternalRowsPerPage] = useState(defaultRowsPerPage);

  const search = serverSide ? searchValue ?? "" : internalSearch;
  const page = serverSide ? controlledPage ?? 0 : internalPage;
  const rowsPerPage = serverSide ? controlledRowsPerPage ?? defaultRowsPerPage : internalRowsPerPage;

  const term = search.trim().toLowerCase();
  const filteredRows = !serverSide && searchPredicate && term ? rows.filter((row) => searchPredicate(row, term)) : rows;
  const pagedRows = serverSide ? rows : filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const count = serverSide ? totalCount ?? rows.length : filteredRows.length;
  const colSpan = columns.length + (selectable ? 1 : 0);
  const showSearchBox = serverSide ? onSearchChange !== undefined : !!searchPredicate;

  const selected = selectedIds ?? new Set<string | number>();
  const pagedIds = pagedRows.map(getRowId);
  const selectedOnPageCount = pagedIds.filter((id) => selected.has(id)).length;
  const allOnPageSelected = pagedIds.length > 0 && selectedOnPageCount === pagedIds.length;
  const someOnPageSelected = selectedOnPageCount > 0 && !allOnPageSelected;

  function toggleRow(id: string | number) {
    if (!onSelectionChange) return;
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onSelectionChange(next);
  }

  function toggleAllOnPage() {
    if (!onSelectionChange) return;
    const next = new Set(selected);
    if (allOnPageSelected) {
      pagedIds.forEach((id) => next.delete(id));
    } else {
      pagedIds.forEach((id) => next.add(id));
    }
    onSelectionChange(next);
  }

  function handleSearchChange(value: string) {
    if (serverSide) {
      onSearchChange?.(value);
      return;
    }
    setInternalSearch(value);
    setInternalPage(0);
  }

  function handleSearchKeyDown(e: React.KeyboardEvent) {
    if (serverSide && e.key === "Enter") {
      onSearchSubmit?.();
    }
  }

  function handlePageChange(newPage: number) {
    if (serverSide) {
      onPageChange?.(newPage);
    } else {
      setInternalPage(newPage);
    }
  }

  function handleRowsPerPageChange(value: number) {
    if (serverSide) {
      onRowsPerPageChange?.(value);
    } else {
      setInternalRowsPerPage(value);
      setInternalPage(0);
    }
  }

  return (
    <Stack spacing={2}>
      {showSearchBox && (
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <TextField
            size="small"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            sx={{ maxWidth: 360, width: "100%" }}
            slotProps={
              serverSide
                ? {
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            edge="end"
                            aria-label={t("common.search")}
                            onClick={() => onSearchSubmit?.()}
                          >
                            <SearchRoundedIcon fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }
                : undefined
            }
          />
          {onRefresh && (
            <Tooltip title={t("common.refresh")}>
              <span>
                <IconButton aria-label={t("common.refresh")} onClick={onRefresh} disabled={loading}>
                  <RefreshRoundedIcon />
                </IconButton>
              </span>
            </Tooltip>
          )}
        </Stack>
      )}

      <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow
              sx={{
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                "& .MuiTableCell-root": {
                  fontWeight: 700,
                  color: "primary.main",
                  borderBottom: "2px solid",
                  borderBottomColor: (theme) => alpha(theme.palette.primary.main, 0.24),
                },
              }}
            >
              {selectable && (
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={allOnPageSelected}
                    indeterminate={someOnPageSelected}
                    onChange={toggleAllOnPage}
                    disabled={pagedIds.length === 0}
                  />
                </TableCell>
              )}
              {columns.map((col) => (
                <TableCell key={col.key} align={col.align}>
                  {col.header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={colSpan}>
                  <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                    <CircularProgress size={28} />
                  </Box>
                </TableCell>
              </TableRow>
            )}
            {!loading && pagedRows.map((row, i) => {
              const id = getRowId(row);
              const rowIndex = page * rowsPerPage + i;
              return (
                <TableRow
                  key={id}
                  hover
                  selected={selectable && selected.has(id)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  sx={{
                    cursor: onRowClick ? "pointer" : "default",
                    transition: "background-color 0.15s ease",
                  }}
                >
                  {selectable && (
                    <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                      <Checkbox checked={selected.has(id)} onChange={() => toggleRow(id)} />
                    </TableCell>
                  )}
                  {columns.map((col) => (
                    <TableCell key={col.key} align={col.align}>
                      {col.render(row, rowIndex)}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
            {!loading && pagedRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={colSpan}>
                  <Typography color="text.secondary" sx={{ py: 2, textAlign: "center" }}>
                    {term ? (noMatchMessage ?? emptyMessage) : emptyMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={count}
          page={page}
          onPageChange={(_e, newPage) => handlePageChange(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => handleRowsPerPageChange(Number(e.target.value))}
          rowsPerPageOptions={rowsPerPageOptions}
        />
      </Paper>
    </Stack>
  );
}
