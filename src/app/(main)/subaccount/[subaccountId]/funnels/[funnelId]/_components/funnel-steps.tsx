"use client";
import CreateFunnelPage from "@/components/forms/funnel-page";
import CustomModal from "@/components/global/custom-modal";
import FunnelPagePlaceholder from "@/components/icons/funnel-page-placeholder";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { upsertFunnelPage } from "@/lib/queries";
import { FunnelsForSubAccount } from "@/lib/types";
import { useModal } from "@/providers/modal-provider";
import { FunnelPage } from "@prisma/client";
import {
  Check,
  ExternalLink,
  LucideEdit,
  Layers,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import {
  DragDropContext,
  DragStart,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import toast from "react-hot-toast";
import FunnelStepCard from "./funnel-step-card";

type Props = {
  funnel: FunnelsForSubAccount;
  subaccountId: string;
  pages: FunnelPage[];
  funnelId: string;
};

const FunnelSteps = ({ funnel, subaccountId, pages, funnelId }: Props) => {
  const [clickedPage, setClickedPage] = useState<FunnelPage | undefined>(
    pages[0]
  );

  const { setOpen } = useModal();
  const [pagesState, setPagesState] = useState(pages);

  const onDragStart = (event: DragStart) => {
    const { draggableId } = event;
    const value = pagesState.find((page) => page.id === draggableId);
  };

  const onDragEnd = (dropResult: DropResult) => {
    const { destination, source } = dropResult;

    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }

    const newPageOrder = [...pagesState]
      .toSpliced(source.index, 1)
      .toSpliced(destination.index, 0, pagesState[source.index])
      .map((page, idx) => {
        return { ...page, order: idx };
      });

    setPagesState(newPageOrder);

    newPageOrder.forEach(async (page, index) => {
      try {
        await upsertFunnelPage(
          subaccountId,
          {
            id: page.id,
            order: index,
            name: page.name,
          },
          funnelId
        );
      } catch (error) {
        console.log(error);
        toast.error("Failed, Could not save page order");
        return;
      }
    });

    toast.success("Saved page order");
  };

  return (
    <AlertDialog>
      {/* Main Container with Gradient Background */}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
        {/* Header Section */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 sticky top-0 z-40">
          <div className="px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Layers className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                    Funnel Builder
                  </h1>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    {pagesState.length}{" "}
                    {pagesState.length === 1 ? "step" : "steps"} • Drag to
                    reorder
                  </p>
                </div>
              </div>

              {/* Desktop Create Button */}
              <div className="hidden sm:block">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2 px-6"
                  onClick={() => {
                    setOpen(
                      <CustomModal
                        title="Create New Funnel Step"
                        subheading="Design the perfect customer journey with beautiful, conversion-focused pages"
                      >
                        <CreateFunnelPage
                          subaccountId={subaccountId}
                          funnelId={funnelId}
                          order={pagesState.length}
                        />
                      </CustomModal>
                    );
                  }}
                >
                  <Sparkles className="w-4 h-4" />
                  Create Step
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-140px)]">
          {/* Left Sidebar - Steps Panel */}
          <aside className="w-full lg:w-80 xl:w-96 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50 lg:sticky lg:top-[140px] lg:h-[calc(100vh-140px)]">
            <div className="p-4 lg:p-6 h-full flex flex-col">
              {/* Steps Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Steps ({pagesState.length})
                  </h2>
                </div>
              </div>

              {/* Steps List */}
              <div className="flex-1 min-h-0 mb-6">
                <ScrollArea className="h-full pr-2">
                  {pagesState.length ? (
                    <DragDropContext
                      onDragEnd={onDragEnd}
                      onDragStart={onDragStart}
                    >
                      <Droppable
                        droppableId="funnels"
                        direction="vertical"
                        key="funnels"
                        isCombineEnabled={false}
                        ignoreContainerClipping={false}
                        isDropDisabled={false}
                      >
                        {(provided, snapshot) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className={`space-y-3 transition-colors duration-200 ${
                              snapshot.isDraggingOver
                                ? "bg-blue-50/50 dark:bg-blue-900/10 rounded-lg p-2"
                                : ""
                            }`}
                          >
                            {pagesState.map((page, idx) => (
                              <div
                                className="relative transform transition-all duration-200 hover:scale-[1.02]"
                                key={page.id}
                                onClick={() => setClickedPage(page)}
                              >
                                <FunnelStepCard
                                  funnelPage={page}
                                  index={idx}
                                  key={page.id}
                                  activePage={page.id === clickedPage?.id}
                                />
                              </div>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                        <Layers className="w-10 h-10 text-slate-400 dark:text-slate-500" />
                      </div>
                      <div className="space-y-3 max-w-xs">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                          No steps yet
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          Create your first funnel step to start building an
                          amazing customer journey
                        </p>
                        <Button
                          size="sm"
                          variant="outline"
                          className="mt-4 border-dashed border-2 border-slate-300 dark:border-slate-600 hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-all duration-200 group"
                          onClick={() => {
                            setOpen(
                              <CustomModal
                                title="Create Your First Step"
                                subheading="Let's build something amazing together"
                              >
                                <CreateFunnelPage
                                  subaccountId={subaccountId}
                                  funnelId={funnelId}
                                  order={pagesState.length}
                                />
                              </CustomModal>
                            );
                          }}
                        >
                          <Sparkles className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-200" />
                          Create First Step
                        </Button>
                      </div>
                    </div>
                  )}
                </ScrollArea>
              </div>

              {/* Bottom Create Button (Desktop) */}
              <div className="hidden lg:block border-t border-slate-200/50 dark:border-slate-700/50 pt-4">
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2 py-4"
                  onClick={() => {
                    setOpen(
                      <CustomModal
                        title="Create New Funnel Step"
                        subheading="Design the perfect customer journey with beautiful, conversion-focused pages"
                      >
                        <CreateFunnelPage
                          subaccountId={subaccountId}
                          funnelId={funnelId}
                          order={pagesState.length}
                        />
                      </CustomModal>
                    );
                  }}
                >
                  <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M12 4v16m8-8H4"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  Add New Step
                </Button>
              </div>
            </div>
          </aside>

          {/* Right Panel - Page Details */}
          <main className="flex-1 relative overflow-hidden">
            {/* Floating Action Button (Mobile) */}
            <div className="lg:hidden fixed bottom-6 right-6 z-50">
              <Button
                size="lg"
                className="h-16 w-16 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 active:scale-95 flex items-center justify-center"
                onClick={() => {
                  setOpen(
                    <CustomModal
                      title="Create New Step"
                      subheading="Build your next conversion step"
                    >
                      <CreateFunnelPage
                        subaccountId={subaccountId}
                        funnelId={funnelId}
                        order={pagesState.length}
                      />
                    </CustomModal>
                  );
                }}
              >
                <Sparkles className="w-7 h-7 text-white" />
              </Button>
            </div>

            <div className="p-4 lg:p-8 h-full">
              {!!pages.length ? (
                <Card className="h-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50 shadow-2xl shadow-slate-200/20 dark:shadow-slate-900/20 overflow-hidden">
                  <CardHeader className="pb-6 bg-gradient-to-r from-slate-50/50 to-white/50 dark:from-slate-800/50 dark:to-slate-700/50 border-b border-slate-200/50 dark:border-slate-700/50">
                    <div className="space-y-6">
                      {/* Page Header */}
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            Step {(clickedPage?.order || 0) + 1}
                          </div>
                          <CardTitle className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                            {clickedPage?.name}
                          </CardTitle>
                        </div>
                      </div>

                      {/* Page Content */}
                      <CardDescription className="space-y-8">
                        {/* Preview Section */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                              Page Preview
                            </h3>
                            <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent dark:from-slate-600"></div>
                          </div>

                          <div className="group relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                            <div className="relative bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200/50 dark:border-slate-700/50 shadow-xl max-w-sm mx-auto lg:mx-0">
                              <Link
                                href={`/subaccount/${subaccountId}/funnels/${funnelId}/editor/${clickedPage?.id}`}
                                className="relative block group/preview"
                              >
                                <div className="cursor-pointer group-hover/preview:opacity-30 transition-all duration-300">
                                  <FunnelPagePlaceholder />
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/preview:opacity-100 transition-all duration-300 bg-black/10 backdrop-blur-sm">
                                  <div className="bg-white/90 dark:bg-slate-800/90 p-3 rounded-full shadow-lg transform scale-90 group-hover/preview:scale-100 transition-transform duration-200">
                                    <LucideEdit className="w-6 h-6 text-slate-700 dark:text-slate-300" />
                                  </div>
                                </div>
                              </Link>
                            </div>
                          </div>
                        </div>

                        {/* URL Section */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                              Live URL
                            </h3>
                            <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent dark:from-slate-600"></div>
                          </div>

                          <Link
                            target="_blank"
                            href={`${process.env.NEXT_PUBLIC_SCHEME}${funnel.subDomainName}.${process.env.NEXT_PUBLIC_DOMAIN}/${clickedPage?.pathName}`}
                            className="group flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-800 dark:to-slate-700/50 border border-slate-200/50 dark:border-slate-600/50 hover:shadow-lg hover:shadow-slate-200/20 dark:hover:shadow-slate-900/20 transition-all duration-300 hover:scale-[1.01]"
                          >
                            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-800/40 transition-colors duration-200">
                              <ExternalLink className="w-4 h-4 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                                Visit Live Page
                              </div>
                              <div className="text-xs text-slate-600 dark:text-slate-400 truncate">
                                {process.env.NEXT_PUBLIC_SCHEME}
                                {funnel.subDomainName}.
                                {process.env.NEXT_PUBLIC_DOMAIN}/
                                {clickedPage?.pathName}
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 group-hover:translate-x-1 transition-all duration-200" />
                          </Link>
                        </div>

                        {/* Settings Section */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                              Page Settings
                            </h3>
                            <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent dark:from-slate-600"></div>
                          </div>

                          <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/50">
                            <CreateFunnelPage
                              subaccountId={subaccountId}
                              defaultData={clickedPage}
                              funnelId={funnelId}
                              order={clickedPage?.order || 0}
                            />
                          </div>
                        </div>
                      </CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center space-y-8 max-w-md mx-auto">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-20"></div>
                      <div className="relative w-32 h-32 mx-auto bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-3xl flex items-center justify-center shadow-2xl">
                        <Layers className="w-16 h-16 text-slate-400 dark:text-slate-500" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Ready to build?
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        Create your first funnel step and start designing an
                        amazing customer experience that converts visitors into
                        customers.
                      </p>
                      <div className="pt-4">
                        <Button
                          size="lg"
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 px-8 py-4"
                          onClick={() => {
                            setOpen(
                              <CustomModal
                                title="Create Your First Step"
                                subheading="Let's build something amazing together"
                              >
                                <CreateFunnelPage
                                  subaccountId={subaccountId}
                                  funnelId={funnelId}
                                  order={pagesState.length}
                                />
                              </CustomModal>
                            );
                          }}
                        >
                          <Sparkles className="w-5 h-5 mr-2" />
                          Get Started
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </AlertDialog>
  );
};

export default FunnelSteps;
