import {
  Bird,
  CornerDownLeft,
  Paperclip,
  Pen,
  Search
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

export function Dashboard() {
  return (
    <div className="grid h-screen w-full">
      <div className="flex flex-col">
        <main className="grid flex-1 gap-4 overflow-auto md:grid-cols-2 lg:grid-cols-5">
          <div className="relative flex h-full min-h-[50vh] flex-col bg-muted/50 p-4 lg:col-span-4">
            <Badge variant="outline" className="absolute right-3 top-3">
              Output
            </Badge>
            <div className="flex-1" />
            <form
              className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
              x-chunk="dashboard-03-chunk-1"
            >
              <Label htmlFor="message" className="sr-only">
                Message
              </Label>
              <Textarea
                id="message"
                placeholder="Type your message here..."
                className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
              />
              <div className="flex items-center p-3 pt-0">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Paperclip className="size-4" />
                        <span className="sr-only">Attach file</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Attach File</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Button type="submit" size="sm" className="ml-auto gap-1.5">
                  Send Message
                  <CornerDownLeft className="size-3.5" />
                </Button>
              </div>
            </form>
          </div>
          <div
            className="relative hidden flex-col items-start gap-8 md:flex pt-4"
            x-chunk="dashboard-03-chunk-0"
          >
            <form className="grid w-full items-start gap-6">
              <fieldset className="grid">
                <legend className="-ml-1 px-1 text-lg font-bold pb-4">
                  Settings
                </legend>
                <Separator />
                <div className="grid gap-3 pt-4 pr-4">
                  <Label htmlFor="model">Goal</Label>
                  <Select>
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
                            <p className="font-medium text-foreground">
                              Answer
                            </p>
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
                            <p className="font-medium text-foreground">
                              Draft
                            </p>
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
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
