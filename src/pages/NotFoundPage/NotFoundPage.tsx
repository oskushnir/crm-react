import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircleIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/')
  }

  return (
    <div className="flex flex-col gap-4 h-full items-center justify-center col-span-full">
      <Alert className="flex border-none justify-center items-center text-lg" variant="destructive">
        <AlertCircleIcon />
        <AlertTitle>Page not found or you unfortunatle don't have access to this page.</AlertTitle>
      </Alert>

      <img src="../../img/page_not_found.png" alt="Page Not Found" />

      <Button className="text-white" onClick={handleGoHome} variant='default'>Go to Home</Button>
    </div>
  );
}