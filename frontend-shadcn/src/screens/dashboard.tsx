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
import { Answer } from "@/components/answer";

interface AIMessage {
  text: string;
  references: {
    name: string;
    section: string;
    url: string;
  }[];
}

export function Dashboard() {
  const [currentUserMsgOnTextArea, setCurrentUserMsgOnTextArea] = useState("");
  const [currentUserMsg, setCurrentUserMsg] = useState("");
  const [currentAIMsg, setCurrentAIMsg] = useState<AIMessage | null>(null);
  const [questionType, setQuestionType] = useState("answer");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const askAI = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setCurrentUserMsgOnTextArea("");
    setIsLoading(true);
    try {
      console.log("questionType", questionType);

      const response = await fetch(`http://localhost:8080/${questionType}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: currentUserMsg }),
      });
      if (!response.ok) {
        console.log("error");
        setErrorMsg("Oops! Something went wrong. Please try again")
        setCurrentAIMsg({text:"", references: []});
        throw new Error("Network response was not ok");
      }
      const responseData = await response.json();

      setCurrentAIMsg({
        text: responseData.text,
        references: responseData.references,
      });
    } catch (error) {
      setError(error);
      setErrorMsg("Oops! Something went wrong. Please try again")
      setCurrentAIMsg({text:"", references: []});
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid h-screen w-full">
      <div className="flex flex-col">
        <main className="grid flex-1 gap-4 overflow-auto md:grid-cols-2 lg:grid-cols-5">
          <div className="relative flex h-full min-h-[50vh] flex-col bg-muted/50 p-4 lg:col-span-4 max-h-screen px-36">
            <Badge variant="outline" className="absolute right-3 top-3">
              Output
            </Badge>

            {isLoading ? (
              <div className="h-screen self-center content-center text-6xl text-slate-300">
                Trying to answer your query as fast as possible...
              </div>
            ) : currentAIMsg != null && currentAIMsg.text.length>0  ? (
              <>
                <h1 className="text-2xl font-bold mb-3 ml-3">Question</h1>
                <div
                  className="min-h-12 resize-none border-0 shadow-none focus-visible:ring-0 py-2.5 px-4 ml-3"
                  style={{ backgroundColor: "#def", borderRadius: 5 }}
                >
                  {currentUserMsg.length>0 && currentUserMsg}
                </div>
                
                <Answer
                  text={currentAIMsg.text}
                  references={currentAIMsg.references}
                ></Answer>
              </>
            ) : (
              <div className="h-screen self-center content-center text-6xl">
                <p>Hello! 👋</p>
                <br />
                <p>
                  I am <span className="text-emerald-500">LeagleEagle 🦅</span>,
                  your personal lawyer
                </p>
                <br />
                <p>How may i help you today?</p>
                {errorMsg && errorMsg.length > 0 ? (
                  <>
                    <div
                      className="min-h-12 resize-none border-0 shadow-none focus-visible:ring-0 leading-loose mt-16"
                      style={{ color: "#f55", borderRadius: 5 }}
                    >
                      {errorMsg}
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </div>
            )}

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
                onChange={(e) => {
                  setCurrentUserMsgOnTextArea(e.target.value);
                  setCurrentUserMsg(e.target.value);
                }}
                value={currentUserMsgOnTextArea}
                disabled={isLoading}
              />
              <div className="flex items-center p-3 pb-10 pt-0">
                {/* <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Paperclip className="size-4" />
                        <span className="sr-only">Attach file</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Attach File</TooltipContent>
                  </Tooltip>
                </TooltipProvider> */}
                <Button
                  // type="submit"
                  size="sm"
                  className="ml-auto gap-1.5"
                  onClick={(e) => askAI(e)}
                  disabled={isLoading}
                >
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
                    setCurrentAIMsg(null);
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
