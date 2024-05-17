import { Bird, CornerDownLeft, Paperclip, Pen, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { AnswerMode } from "./answer_mode";
import { DraftMode } from "./draft_mode";

interface AIMessage {
  text: string;
  references: {
    name: string;
    section: string;
    url: string;
  }[];
}

export function Dashboard() {
  const [questionType, setQuestionType] = useState("answer");

  return (
    <div className="grid h-screen w-full">
      <div className="flex flex-col">
        <main className="grid flex-1 gap-4 overflow-auto md:grid-cols-2 lg:grid-cols-5">
          <div className="relative flex h-full min-h-[50vh] flex-col bg-muted/50 p-4 lg:col-span-4 max-h-screen px-36">
            <Badge variant="outline" className="absolute right-3 top-3">
              Output
            </Badge>

            {questionType == "answer" ? (
              <AnswerMode/>
            ) : (
              <DraftMode/>
            )}
          </div>
          <div
            className="relative hidden flex-col items-start gap-8 md:flex pt-4"
            x-chunk="dashboard-03-chunk-0"
          >
            <fieldset className="grid w-full items-start gap-6">
              <legend className="-ml-1 px-1 text-lg font-bold pb-4">
                Settings
              </legend>
              <Separator />
              <div className="grid gap-3 pr-4">
                <Label htmlFor="model">Goal</Label>
                <Select
                  onValueChange={(e) => {
                    setQuestionType(e);
                  }}
                  defaultValue="answer"
                >
                  <SelectTrigger
                    id="Goal"
                    className="items-start [&_[data-description]]:hidden"
                  >
                    <SelectValue placeholder="Select a Goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="answer">
                      <div className="flex items-start gap-3 text-muted-foreground">
                        <Search className="size-5" />
                        <div className="grid gap-0.5">
                          <p className="font-medium text-foreground">Answer</p>
                          <p className="text-xs" data-description>
                            Answer any question with references.
                          </p>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="draft">
                      <div className="flex items-start gap-3 text-muted-foreground">
                        <Pen className="size-5" />
                        <div className="grid gap-0.5">
                          <p className="font-medium text-foreground">Draft</p>
                          <p className="text-xs" data-description>
                            Draft legal documents.
                          </p>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </fieldset>
          </div>
        </main>
      </div>
    </div>
  );
}
