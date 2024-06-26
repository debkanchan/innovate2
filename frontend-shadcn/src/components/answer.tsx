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

interface AnswerProps {
  message: string
  text: string;
  references: {
    name: string;
    section: string;
    url: string;
  }[];
}

export const Answer: React.FC<AnswerProps> = (props) => {
  const { message, text, references } = props;

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
      {references.length > 0 ? (
        <h1 className="text-2xl font-bold mb-3 mt-8 underline decoration-emerald-600">Sources</h1>
      ) : (
        <div></div>
      )}
      {references.length > 0 &&
        references.map((source, index) => {
          return (
            <React.Fragment key={source.name + index}>
              {/* <div
                            style={{
                              // backgroundColor:"#9abcde",
                              padding: "10px",
                              margin: "0px 10px 10px 0px",
                              borderRadius: "10px",
                              border: "1px solid #999",
                              // maxWidth:"inherit",
                            }}
                            className="text-wrap"
                          >
                            {source.name}
                            <br />
                            Section: {source.section}
                            <br />
                            Url: {source.url}
                          </div> */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-md">{source.name}</CardTitle>
                    <CardDescription>{source.section}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{source.name}</p>
                  </CardContent>
                  <CardFooter>
                    <p>{source.url}</p>
                  </CardFooter>
                </Card>
              </div>
              <div className="pb-2"></div>
            </React.Fragment>
          );
        })}
    </ScrollArea>
  );
};
