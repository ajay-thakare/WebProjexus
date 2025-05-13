import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { db } from "@/lib/db";
import {
  getLanesWithTicketAndTags,
  getPipeLineDetails,
  updateLanesOrder,
  updateTicketsOrder,
} from "@/lib/queries";
import { LaneDetail } from "@/lib/types";
import { redirect } from "next/navigation";
import React from "react";
import PipelineInfobar from "../_components/pipeline-infobar";
import PipelineSettings from "../_components/pipeline-settings";
import PipelineView from "../_components/pipeline-view";
import { serializePrismaData } from "@/lib/serialization";

type Props = {
  params: Promise<{
    subaccountId: string;
    pipelineId: string;
  }>;
};

const PipelinePageId = async ({ params }: Props) => {
  const { subaccountId, pipelineId } = await params;

  const pipelineDetails = await getPipeLineDetails(pipelineId);

  if (!pipelineDetails) {
    return redirect(`/subaccount/${subaccountId}/pipelines`);
  }

  const pipelines = await db.pipeline.findMany({
    where: { subAccountId: subaccountId },
  });

  const lanes = (await getLanesWithTicketAndTags(pipelineId)) as LaneDetail[];

  // Serialize all data before passing to client components
  const serializedPipelineDetails = serializePrismaData(pipelineDetails);
  const serializedPipelines = serializePrismaData(pipelines);
  const serializedLanes = serializePrismaData(lanes);

  return (
    <Tabs defaultValue="view" className="w-full">
      <TabsList className="bg-transparent border-b-2 h-16 w-full justify-between mb-4">
        <PipelineInfobar
          pipelineId={pipelineId}
          subAccountId={subaccountId}
          pipelines={serializedPipelines}
        />
        <div>
          <TabsTrigger value="view">Pipeline View</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </div>
      </TabsList>
      {/* pipeline view */}
      <TabsContent value="view">
        <PipelineView
          lanes={serializedLanes}
          pipelineId={pipelineId}
          subaccountId={subaccountId}
          pipelineDetails={serializedPipelineDetails}
          updateLanesOrder={updateLanesOrder}
          updateTicketOrder={updateTicketsOrder}
        />
      </TabsContent>
      <TabsContent value="settings">
        <PipelineSettings
          pipelineId={pipelineId}
          subaccountId={subaccountId}
          pipelines={serializedPipelines}
        />
      </TabsContent>
    </Tabs>
  );
};

export default PipelinePageId;
