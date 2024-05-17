import React, { useState } from "react";

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

import { Answer } from "@/components/answer";

interface AIMessage {
  text: string;
  references: {
    name: string;
    section: string;
    url: string;
  }[];
}

export const AnswerMode = () => {
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
          "Content-Type": "text/plain",
        },
        body: currentUserMsg,
      });
      if (!response.ok) {
        console.log("error");
        setErrorMsg("Oops! Something went wrong. Please try again");
        setCurrentAIMsg({ text: "", references: [] });
        throw new Error("Network response was not ok");
      }
      const responseData = await response.json();

      setCurrentAIMsg({
        text: responseData.text,
        references: responseData.references,
      });
    } catch (error) {
      setError(error);
      setErrorMsg("Oops! Something went wrong. Please try again");
      setCurrentAIMsg({ text: "", references: [] });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="h-screen self-center content-center text-6xl text-slate-300">
          Trying to answer your query as fast as possible...
        </div>
      ) : currentAIMsg != null && currentAIMsg.text.length > 0 ? (
        <Answer
          message={currentUserMsg}
          text={currentAIMsg.text}
          references={currentAIMsg.references}
        ></Answer>
      ) : (
        <div className="h-screen self-center content-center text-6xl">
          <p>Hello! 👋</p>
          <br />
          <p>
            I am <span className="text-emerald-500">LeagleEagle 🦅</span>, your
            personal lawyer
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
    </>
  );
};
