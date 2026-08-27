import React, { useState } from "react";
import { SaveFilterFormProps } from "./SaveFilterForm.type";
import { useAddSavedFilter } from "@/hooks/useSavedFilters";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export function SaveFilterForm({ isOpen, onClose, filters }: SaveFilterFormProps) {
  const [newPresetName, setNewPresetName] = useState("");
  const addSavedFilterMutation = useAddSavedFilter();

  const handleSave = async () => {
    if (!newPresetName.trim()) return;
    await addSavedFilterMutation.mutateAsync({
      name: newPresetName.trim(),
      isPinned: false,
      filters,
    });
    setNewPresetName("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] sm:max-w-md bg-card border-border text-card-foreground rounded-2xl p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>Save Filter Combination</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <label className="text-xs font-medium text-foreground">Filter Preset Name</label>
          <Input
            type="text"
            placeholder="e.g. Q3 Tech Prospect Leads"
            value={newPresetName}
            onChange={(e) => setNewPresetName(e.target.value)}
            className="bg-background border-input text-foreground text-xs"
          />
        </div>
        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-0">
          <Button
            variant="ghost"
            onClick={onClose}
            className="w-full sm:w-auto text-muted-foreground text-xs"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!newPresetName.trim() || addSavedFilterMutation.isPending}
            className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 text-xs"
          >
            Save Preset
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
