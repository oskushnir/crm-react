import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Alert,
  AlertTitle,
} from "@/components/ui/alert"
import { AlertCircleIcon, Search, SortAscIcon, SortDescIcon } from "lucide-react"
import { tableTitles } from "@/utils/tableTitles";
import { PaginationClients } from "./Pagination";
import { Selector } from "./Selector";
import type { Patient } from "@/types/Patients";
import { Spinner } from "./Spinner";
import Inputs from "./Inputs";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getAllPatients } from "@/api/patients";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import debounce from "lodash.debounce";
import { CalendarOfBirth } from "./Calendar";
import { Button } from "./ui/button";
import { parseUkDate } from "@/utils/parseUkDate";
import { CreatePatientDialog } from "./CreatePatientDialog";

export function TablePatients() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterQuery, setFilterQuery] = useState<string | null>(searchParams.get("search"));
  const [appliedFilterQuery, setAppliedFilterQuery] = useState<string | null>(searchParams.get("search"));

  const [birthdayFrom, setBirthdayFrom] = useState<Date | undefined>(() =>
    parseUkDate(searchParams.get("birthdayFrom"))
  );
  const [birthdayTo, setBirthdayTo] = useState<Date | undefined>(() =>
    parseUkDate(searchParams.get("birthdayTo"))
  );

  const initSortBy = searchParams.get('sortBy') || undefined;
  const initSortOrder = (searchParams.get('sortOrder') as "ASC" | "DESC");

  const [sortBy, setSortBy] = useState<string | undefined>(initSortBy);
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">(initSortOrder);

  const navigate = useNavigate();

  const currentPage = Number(searchParams.get("page")) || 1;
  const limit = searchParams.get("limit") || '10';

  const birthdayFromISO = birthdayFrom?.toISOString();
  const birthdayToISO = birthdayTo?.toISOString();

  const { isPending, error, data: arrayPatients } = useQuery({
    queryKey: ['patients', currentPage, limit, appliedFilterQuery, birthdayFrom, birthdayTo, sortBy, sortOrder],
    queryFn: () => getAllPatients(currentPage, +limit, appliedFilterQuery || undefined, birthdayFromISO, birthdayToISO, sortBy, sortOrder),
  });

  const updatePage = (newPage: number) => {
    searchParams.set("page", newPage.toString());
    setSearchParams(searchParams);
  }

  const updateLimit = (newLimit: string) => {
    searchParams.set("limit", newLimit.toString());
    setSearchParams(searchParams);
  }

  const updateBirthdayFrom = (date: Date | undefined) => {
    setBirthdayFrom(date);

    if (!date) {
      searchParams.delete('birthdayFrom');
    } else {
      searchParams.set('birthdayFrom', date ? date.toLocaleDateString("uk-UA") : '');
    }

    setSearchParams(searchParams);
  }

  const updateBirthdayTo = (date: Date | undefined) => {
    setBirthdayTo(date);

    if (!date) {
      searchParams.delete('birthdayTo');
    } else {
      searchParams.set('birthdayTo', date ? date.toLocaleDateString("uk-UA") : '');
    }

    setSearchParams(searchParams);
  }

  const applyQuery = useCallback(                              // eslint-disable-line react-hooks/exhaustive-deps
    debounce((q: string) => setAppliedFilterQuery(q), 500),
    []
  );

  const handleQueryChange = (query: string) => {
    setFilterQuery(query);
    applyQuery(query);

    if (query.trim() === "") {
      searchParams.delete("search");
    } else {
      searchParams.set("search", query);
    }
    setSearchParams(searchParams);
  }

  const handleSort = (columnId: string) => {
    const isSame = sortBy === columnId;
    const nextOrder: "ASC" | "DESC" = isSame
      ? (sortOrder === "ASC" ? "DESC" : "ASC")
      : "ASC";

    setSortBy(columnId);
    setSortOrder(nextOrder);

    searchParams.set("sortBy", columnId);
    searchParams.set("sortOrder", nextOrder);
    setSearchParams(searchParams);
  };

  const handleClearBirthday = () => {
    setBirthdayFrom(undefined);
    setBirthdayTo(undefined);

    updateBirthdayFrom(undefined);
    updateBirthdayTo(undefined);
  }

  useEffect(() => () => applyQuery.cancel(), [applyQuery]);

  useEffect(() => {
    searchParams.set("page", "1");
  }, [filterQuery, birthdayFrom, birthdayTo, limit, sortBy, sortOrder]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const page = searchParams.get('page');
    const limit = searchParams.get('limit');

    if (!page || !limit) {
      const newSearchParams = new URLSearchParams(searchParams);

      if (!page) {
        newSearchParams.set('page', '1');
      }

      if (!limit) {
        newSearchParams.set('limit', '10');
      }

      setSearchParams(newSearchParams, { replace: true })
    }
  }, [searchParams, setSearchParams]);

  return (
    <div className="gap-6 flex flex-col border p-6 rounded-2xl min-h-[830px]">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-bold text-2xl">Patients</h1>
            <p>Here you can view detailed information about each patient</p>
          </div>

          {<CreatePatientDialog />}
        </div>

        <div className="flex items-center gap-[50%]">
          <Inputs query={filterQuery} handleQueryChange={handleQueryChange} placeholder="Search" startIcon={<Search className="h-5 w-5" />} name="search" />

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <CalendarOfBirth
                birthday={birthdayFrom}
                setBirthday={updateBirthdayFrom}
                label="Birthday from"
              />
              <CalendarOfBirth
                birthday={birthdayTo}
                setBirthday={updateBirthdayTo}
                label="Birthday to"
              />
            </div>

            <Button
              variant={'destructive'}
              onClick={() => handleClearBirthday()}
              className="text-sm"
            >
              Clear birthday
            </Button>
          </div>
        </div>
      </div>

      <div className="h-[502px] overflow-auto">
        <Table>
          <TableHeader className="rounded-4xl">
            <TableRow className="bg-[var(--primary-foreground)] hover:bg-[var(--primary-foreground)]">
              {tableTitles.map((title) => (
                <TableHead
                  key={title.id}
                  onClick={() => handleSort(title.id)}
                  className="sticky top-0 z-10 p-4 first:rounded-l-lg last:rounded-r-lg bg-[var(--primary-foreground)]"
                >
                  <div className="flex items-center justify-between">
                    {title.title}

                    {title.id === sortBy ? (
                      sortOrder === "ASC" ? (
                        <SortAscIcon className="h-5 w-5" />
                      ) : (
                        <SortDescIcon className="h-5 w-5" />
                      )
                    ) : (
                      <span className="h-5 w-5 opacity-0"> </span>
                    )}
                  </div>
                </TableHead>

              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {isPending ? (
              <TableRow className="hover:bg-[var(--sidebar)]">
                <TableCell colSpan={5}>
                  <div className="flex justify-center items-center h-[400px] cursor-default">
                    <Spinner size={25} />
                  </div>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow className="hover:bg-[var(--sidebar)]">
                <TableCell colSpan={5}>
                  <div className="flex justify-center items-center h-[400px] cursor-default">
                    <Alert className="flex border-none justify-center items-center text-lg bg-transparent" variant="destructive">
                      <AlertCircleIcon />
                      <AlertTitle className="font-bold text-2xl">Unable to load patients.</AlertTitle>
                    </Alert>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              arrayPatients?.data.map((patient: Patient) => (
                <TableRow onClick={() => navigate(`/patients/${patient.id}`)} key={patient.id}>
                  <TableCell className="p-3">{patient.id}</TableCell>
                  <TableCell>{`${patient.firstName} ${patient.lastName}`}</TableCell>
                  <TableCell>
                    {patient.birthday
                      ? new Date(patient.birthday).toLocaleDateString("en-GB")
                      : "No birthday"}
                  </TableCell>
                  <TableCell>{patient.phoneNumber}</TableCell>
                  <TableCell>{patient.email}</TableCell>
                </TableRow>
              ))
            )}

            {!isPending && !error && arrayPatients?.data.length === 0 && (
              <TableRow className="hover:bg-[var(--sidebar)]">
                <TableCell colSpan={5}>
                  <div className="flex justify-center items-center h-[400px] cursor-default">
                    <Alert className="flex border-none justify-center items-center text-lg bg-transparent" variant="destructive">
                      <AlertCircleIcon />
                      <AlertTitle className="text-2xl">There is no such patient</AlertTitle>
                    </Alert>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {!isPending && !error && arrayPatients?.data.length !== 0 &&
        <div className="flex flex-col xl:flex-row items-center justify-between gap-5 mt-2 bg-[var(--primary-foreground)] rounded-lg p-3">
          <Selector
            limit={limit}
            updateLimit={updateLimit}
          />

          <div>
            <PaginationClients
              currentPage={currentPage}
              updatePage={updatePage}
              totalPages={arrayPatients.totalPages}
            />
          </div>
        </div>
      }
    </div>
  );
}
