"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { alpha } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

export type DataTableColumn<T> = {
  key: string;
  header: ReactNode;
  align?: "left" | "right" | "center";
  render: (row: T) => ReactNode;
};

export type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowId: (row: T) => string | number;
  onRowClick?: (row: T) => void;
  emptyMessage: string;
  /** Enable the built-in search box; returns true when `row` matches `term` (already lowercased/trimmed). */
  searchPredicate?: (row: T, term: string) => boolean;
  searchPlaceholder?: string;
  noMatchMessage?: string;
  rowsPerPageOptions?: number[];
  defaultRowsPerPage?: number;
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
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

  const term = search.trim().toLowerCase();
  const filteredRows = searchPredicate && term ? rows.filter((row) => searchPredicate(row, term)) : rows;
  const pagedRows = filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(0);
  }

  return (
    <Stack spacing={2}>
      {searchPredicate && (
        <TextField
          size="small"
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          sx={{ maxWidth: 360 }}
        />
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
              {columns.map((col) => (
                <TableCell key={col.key} align={col.align}>
                  {col.header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {pagedRows.map((row) => (
              <TableRow
                key={getRowId(row)}
                hover
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                sx={{
                  cursor: onRowClick ? "pointer" : "default",
                  transition: "background-color 0.15s ease",
                }}
              >
                {columns.map((col) => (
                  <TableCell key={col.key} align={col.align}>
                    {col.render(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {filteredRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length}>
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
          count={filteredRows.length}
          page={page}
          onPageChange={(_e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(Number(e.target.value));
            setPage(0);
          }}
          rowsPerPageOptions={rowsPerPageOptions}
        />
      </Paper>
    </Stack>
  );
}
