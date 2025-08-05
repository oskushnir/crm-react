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
import { AlertCircleIcon } from "lucide-react"
import { tableTitles } from "@/utils/tableTitles";
import { DialogForAddClient } from "./Dialog";
import { PaginationClients } from "./Pagination";
import { useEffect } from "react";
import { Selector } from "./Selector";
import { getAllPatients } from "@/api/patients";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import type { Patient } from "@/types/Patients";
import { Spinner } from "./Spinner";

export function TableClients() {
  const [searchParams, setSearchParams] = useSearchParams();

  const navigate = useNavigate();

  const currentPage = Number(searchParams.get("page")) || 1;
  const limit = searchParams.get("limit") || '10';

  const { isPending, error, data: arrayPatients } = useQuery({
    queryKey: ['patients', currentPage, limit],
    queryFn: () => getAllPatients(currentPage, +limit),
  });

  const updatePage = (newPage: number) => {
    searchParams.set("page", newPage.toString());
    setSearchParams(searchParams);
  }

  const updateLimit = (newLimit: string) => {
    searchParams.set("limit", newLimit.toString());
    searchParams.set("page", "1");
    setSearchParams(searchParams);
  }

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
    <div className="gap-6 flex flex-col border p-6 rounded-2xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-bold text-2xl">Patients</h1>
          <p>Here you can view detailed information about each patient</p>
        </div>

        {!isPending && !error && <DialogForAddClient />}
      </div>

      <div className="h-[502px] overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-[var(--primary-foreground)] cursor-default">
              {tableTitles.map((title) => (
                <TableHead
                  key={title}
                  className="sticky top-0 z-10 p-4 bg-[var(--primary-foreground)]"
                >
                  {title}
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
                    <Alert className="flex border-none justify-center items-center text-lg" variant="destructive">
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
          </TableBody>
        </Table>
      </div>

      {!isPending && !error &&
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
