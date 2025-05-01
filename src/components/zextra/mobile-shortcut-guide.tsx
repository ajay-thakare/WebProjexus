"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Share, MoreVertical, Plus, Menu } from "lucide-react";

const MobileShortcutGuide = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Start</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add to Home Screen</DialogTitle>
            <DialogDescription>
              Follow these steps to save this website as a shortcut on your
              mobile device
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="android" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="android">Android</TabsTrigger>
              <TabsTrigger value="ios">iOS</TabsTrigger>
            </TabsList>

            <TabsContent value="android" className="space-y-4">
              <div className="space-y-4 p-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <span className="font-bold">1</span>
                  </div>
                  <p>
                    Tap the <MoreVertical className="inline h-5 w-5" /> menu
                    icon in Chrome
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <span className="font-bold">2</span>
                  </div>
                  <p>Select "Add to Home screen"</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <span className="font-bold">3</span>
                  </div>
                  <p>Tap "Add" when prompted</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="ios" className="space-y-4">
              <div className="space-y-4 p-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <span className="font-bold">1</span>
                  </div>
                  <p>
                    Tap the <Share className="inline h-5 w-5" /> Share icon in
                    Safari
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <span className="font-bold">2</span>
                  </div>
                  <p>Scroll down and tap "Add to Home Screen"</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <span className="font-bold">3</span>
                  </div>
                  <p>Tap "Add" in the top-right corner</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button onClick={() => setOpen(false)}>Got it!</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MobileShortcutGuide;
