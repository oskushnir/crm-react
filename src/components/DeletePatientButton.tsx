import { Button } from "@/components/ui/button";
import { Spinner } from "./Spinner";
import type React from "react";

type Props = {
  isLoading: boolean;
  handleDelete: () => void;
}

export const DeletePatientButton: React.FC<Props> = ({ isLoading, handleDelete }) => {


  return (
    <Button
      variant="destructive"
      disabled={isLoading}
      onClick={handleDelete}
    >
      {isLoading ? (
        <Spinner size={15} />
      ) : (
        "Delete Patient"
      )}
    </Button>
  );
};
