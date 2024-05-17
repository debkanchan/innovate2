import React from "react";
import { ScrollArea } from "./ui/scroll-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Markdown from "react-markdown";
import { Separator } from "./ui/separator";

interface DraftProps {
  message: string
  text: string;
}

export const Draft: React.FC<DraftProps> = (props) => {
  const { message, text } = props;

  return (
    <ScrollArea className="h-screen pt-8 p-3">
      {/* <h1 className="text-2xl font-bold mb-3">Question</h1> */}
      <div
        className="mb-3"
      >
        <h1 className="text-2xl underline decoration-emerald-600 font-bold mb-3">Question</h1>
        <p className="text-xl">{message}</p>
      </div>
      <h1 className="text-2xl font-bold mb-3 mt-8 underline decoration-emerald-600">Answer</h1>
      <div
        className="min-h-12 resize-none border-0 shadow-none focus-visible:ring-0 leading-loose"
        // style={{backgroundColor:"#9abcde"}}
      >
        <Markdown>{text}</Markdown>
      </div>
    </ScrollArea>
  );
};
