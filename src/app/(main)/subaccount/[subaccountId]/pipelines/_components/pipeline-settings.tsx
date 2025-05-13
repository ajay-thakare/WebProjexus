"use client";
import CreatePipelineForm from "@/components/forms/create-pipeline-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deletePipeline } from "@/lib/queries";
import { Pipeline } from "@prisma/client";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

type Props = {
  pipelineId: string;
  pipelines: Pipeline[];
  subaccountId: string;
};

const PipelineSettings = ({ pipelineId, pipelines, subaccountId }: Props) => {
  const router = useRouter();
  const currentPipeline = pipelines.find((p) => p.id === pipelineId);

  const deleteHandler = async () => {
    try {
      await deletePipeline(pipelineId);

      // todo - Activity log

      toast.success("Pipeline is deleted");
      router.replace(`/subaccount/${subaccountId}/pipelines`);
    } catch (error) {
      toast.error("Oopse!, Could not delete Pipeline");
    }
  };

  return (
    <AlertDialog>
      <div>
        <div className="flex items-center justify-between mb-4">
          <AlertDialogTrigger asChild>
            <Button variant={"destructive"}>Delete Pipeline</Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="items-center">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={deleteHandler} className="bg-red-700">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </div>

        <CreatePipelineForm
          subAccountId={subaccountId}
          defaultData={currentPipeline}
        />
      </div>
    </AlertDialog>
  );
};

export default PipelineSettings;
