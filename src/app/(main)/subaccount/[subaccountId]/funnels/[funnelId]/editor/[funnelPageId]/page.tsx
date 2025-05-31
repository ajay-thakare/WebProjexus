import { db } from "@/lib/db";
import EditorProvider from "@/providers/editor/editor-provider";
import { redirect } from "next/navigation";
import React from "react";
import FunnelEditorNavigation from "./_components/funnel-editor-navigation";
import FunnelEditorModal from "./_components/funnel-editor-modal";
import FunnelEditorSidebar from "./_components/funnel-editor-sidebar";
import FunnelEditor from "./_components/funnel-editor";

type Props = {
  params: Promise<{
    subaccountId: string;
    funnelId: string;
    funnelPageId: string;
  }>;
};

const page = async ({ params }: Props) => {
  const { subaccountId, funnelId, funnelPageId } = await params;

  const funnelPageDetails = await db.funnelPage.findFirst({
    where: { id: funnelPageId },
  });

  if (!funnelPageDetails) {
    console.log("Funnel Page Details Not Found!!!");
    return redirect(`/subaccount/${subaccountId}/funnels/${funnelId}`);
  }

  return (
    <FunnelEditorModal>
      <EditorProvider
        subaccountId={subaccountId}
        funnelId={funnelId}
        pageDetails={funnelPageDetails}
      >
        <FunnelEditorNavigation
          funnelId={funnelId}
          funnelPageDetails={funnelPageDetails}
          subaccountId={subaccountId}
        />

        <div className="h-full flex justify-center">
          <FunnelEditor funnelPageId={funnelPageId} />
        </div>

        <FunnelEditorSidebar subaccountId={subaccountId} />
      </EditorProvider>
    </FunnelEditorModal>
  );
};

export default page;
