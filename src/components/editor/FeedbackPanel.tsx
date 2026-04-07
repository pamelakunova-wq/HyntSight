"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useEditorStore } from "@/stores/editorStore";
import { Sparkles, RefreshCw, Loader2, BoxSelect } from "lucide-react";

interface FeedbackPanelProps {
  designId: string;
  currentVersionId?: string;
  hasGeneratedImage: boolean;
  onGenerate?: (prompt: string) => Promise<void>;
  onIterate?: (feedback: string) => Promise<void>;
}

export default function FeedbackPanel({
  designId,
  currentVersionId,
  hasGeneratedImage,
  onGenerate,
  onIterate,
}: FeedbackPanelProps) {
  const { selectedFeedbackArea, setActiveTool } = useEditorStore();
  const [prompt, setPrompt] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isIterating, setIsIterating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim() || !onGenerate) return;
    setIsGenerating(true);
    try {
      await onGenerate(prompt);
      setPrompt("");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleIterate = async () => {
    if (!feedback.trim() || !onIterate) return;
    setIsIterating(true);
    try {
      await onIterate(feedback);
      setFeedback("");
    } finally {
      setIsIterating(false);
    }
  };

  if (!hasGeneratedImage) {
    return (
      <div className="flex flex-col gap-4 p-3">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-purple-500" />
          <h4 className="text-sm font-medium">AI Generation</h4>
        </div>
        <p className="text-xs text-muted-foreground">
          Describe the garment design you want to create. The AI will generate a
          schematic based on your description and any drawings on the canvas.
        </p>
        <div>
          <Label className="text-xs">Prompt</Label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your garment design..."
            className="mt-1 min-h-24 text-sm"
          />
        </div>
        <Button
          onClick={handleGenerate}
          disabled={!prompt.trim() || isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="size-4" />
              Generate Design
            </>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-3">
      <div className="flex items-center gap-2">
        <RefreshCw className="size-4 text-purple-500" />
        <h4 className="text-sm font-medium">Iterate Design</h4>
      </div>

      {selectedFeedbackArea && (
        <div className="rounded-md border bg-muted/50 p-2">
          <p className="text-xs font-medium text-muted-foreground">
            Selected Area
          </p>
          <p className="mt-1 text-xs tabular-nums">
            {Math.round(selectedFeedbackArea.x)}, {Math.round(selectedFeedbackArea.y)}
            {" — "}
            {Math.round(selectedFeedbackArea.width)} x{" "}
            {Math.round(selectedFeedbackArea.height)}
          </p>
        </div>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={() => setActiveTool("area-select")}
        className="w-full"
      >
        <BoxSelect className="size-4" />
        {selectedFeedbackArea ? "Reselect Area" : "Select Area for Feedback"}
      </Button>

      <div>
        <Label className="text-xs">Feedback</Label>
        <Textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Describe what to change..."
          className="mt-1 min-h-20 text-sm"
        />
      </div>

      <div className="flex gap-2">
        <Button
          onClick={handleIterate}
          disabled={!feedback.trim() || isIterating}
          className="flex-1"
        >
          {isIterating ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Updating...
            </>
          ) : (
            <>
              <RefreshCw className="size-4" />
              {selectedFeedbackArea ? "Update Selection" : "Regenerate"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
