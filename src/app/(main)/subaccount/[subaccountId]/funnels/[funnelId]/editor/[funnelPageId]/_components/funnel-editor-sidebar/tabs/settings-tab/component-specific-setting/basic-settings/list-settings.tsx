"use client";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { useCustomValuesUpdater } from "../../utils";

type Props = {};

const ListSettings = (props: Props) => {
  const { handleChangeCustomValues, state } = useCustomValuesUpdater();

  if (
    state.editor.selectedElement.type !== "list" ||
    Array.isArray(state.editor.selectedElement.content)
  ) {
    return null;
  }

  const handleSelectChange = (field: string, value: string) => {
    const event = {
      target: {
        id: field,
        value: value,
      },
    } as React.ChangeEvent<HTMLInputElement>;
    handleChangeCustomValues(event);
  };

  const content = state.editor.selectedElement.content as {
    items?: string[];
    listType?: "unordered" | "ordered" | "none";
  };

  const handleAddItem = () => {
    const currentItems = content.items || [];
    const newItems = [...currentItems, `List item ${currentItems.length + 1}`];
    const event = {
      target: {
        id: "items",
        value: newItems,
      },
    } as any;
    handleChangeCustomValues(event);
  };

  const handleRemoveItem = (index: number) => {
    const currentItems = content.items || [];
    const newItems = currentItems.filter((_, i) => i !== index);

    const event = {
      target: {
        id: "items",
        value: newItems.length > 0 ? newItems : ["List item 1"],
      },
    } as any;
    handleChangeCustomValues(event);
  };

  const handleItemChange = (index: number, value: string) => {
    const currentItems = content.items || [];
    const newItems = [...currentItems];
    newItems[index] = value;

    const event = {
      target: {
        id: "items",
        value: newItems,
      },
    } as any;
    handleChangeCustomValues(event);
  };

  const listItems = content.items || ["List item 1"];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="listType" className="text-muted-foreground">
          List Type
        </Label>
        <Select
          value={content.listType || "unordered"}
          onValueChange={(value) => handleSelectChange("listType", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select list type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None (No Markers)</SelectItem>
            <SelectItem value="unordered">Unordered (Bullets)</SelectItem>
            <SelectItem value="ordered">Ordered (Numbers)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Label className="text-muted-foreground">List Items</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddItem}
            className="h-8 w-8 p-0"
          >
            <Plus size={14} />
          </Button>
        </div>

        <div className="space-y-2 max-h-48 overflow-y-auto">
          {listItems.map((item: string, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={item}
                onChange={(e) => handleItemChange(index, e.target.value)}
                placeholder={`List item ${index + 1}`}
                className="flex-1"
              />
              {listItems.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveItem(index)}
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                >
                  <Trash2 size={14} />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListSettings;
