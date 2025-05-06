"use client";
import { deleteMedia, saveActivityLogsNotification } from "@/lib/queries";
import { Media } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import toast from "react-hot-toast";
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
} from "../ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Image from "next/image";
import { Copy, Loader2, MoreHorizontal, Trash } from "lucide-react";

type Props = { file: Media };

const MediaCard = ({ file }: Props) => {
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();

  const handleDelete = useCallback(async () => {
    setLoading(true);
    try {
      const response = await deleteMedia(file.id);
      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Deleted a media file | ${response?.name}`,
        subaccountId: response.subAccountId,
      });
      toast.success("File deleted successfully.");
      router.refresh();
      setDialogOpen(false);
    } catch (error) {
      toast.error("Failed to delete file");
    } finally {
      setLoading(false);
    }
  }, [file.id, router]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(file.link);
    toast.success("Copied To Clipboard");
  }, [file.link]);

  return (
    <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DropdownMenu>
        <article className="border w-full rounded-lg bg-slate-900">
          <div className="relative w-full h-40">
            <Image
              src={file.link}
              alt={file.name}
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <p className="opacity-0 h-0 w-0">{file.name}</p>
          <div className="p-4 relative">
            <p className="text-muted-foreground">
              {file.createdAt.toDateString()}
            </p>
            <p>{file.name}</p>
            <div className="absolute top-4 right-4 p-[1px] cursor-pointer ">
              <DropdownMenuTrigger>
                <MoreHorizontal />
              </DropdownMenuTrigger>
            </div>
          </div>

          <DropdownMenuContent>
            <DropdownMenuLabel>Menu</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex gap-2" onClick={handleCopy}>
              <Copy size={15} /> Copy Image Link
            </DropdownMenuItem>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem className="flex gap-2">
                <Trash size={15} /> Delete File
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </article>
      </DropdownMenu>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-left">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            Are you sure you want to delete this file? All subaccount using this
            file will no longer have access to it!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex items-center">
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            className="bg-destructive hover:bg-destructive relative"
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
          >
            <span
              className={`flex items-center gap-2 transition ${
                loading ? "opacity-0" : "opacity-100"
              }`}
            >
              Delete
            </span>
            <span
              className={`absolute inset-0 flex items-center justify-center gap-2 transition ${
                loading ? "opacity-100" : "opacity-0"
              }`}
            >
              <Loader2 className="h-4 w-4 animate-spin" />
            </span>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default MediaCard;
