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
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface Source {
  name: string;
  section: string;
  url: string;
}

interface AIMessage {
  text: string;
  references: Source[];
}

interface Chat {
  user: string;
  msg: string;
  sources: Source[]
}

export function Dashboard() {
  
  const [currentUserMsg, setCurrentUserMsg] = useState("hello");
  const [currentAIMsg, setCurrentAIMsg] = useState<AIMessage>({text: "Hello, how may i help you today?", references: []});
  const [questionType, setQuestionType] = useState("answer");
  const [references, setReferences] = useState("answer");
  const [chatHistory, setChatHistory] = useState<Chat[]>([
    {user:"ai", msg: "Hello, how can I help you?", sources:[]},
    {user:"human", msg: "Hello, how can I help you?", sources:[]},
  ]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const askAI = async (e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      console.log("questionType", questionType);
      console.log("questionType", questionType);
      console.log("currentUserMsg", currentUserMsg);
      
      const response = await fetch(`http://localhost:8080/${questionType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ input: currentUserMsg })
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const responseData = await response.json();
      console.log(responseData)
      setReferences(responseData.references)
      setCurrentAIMsg({text: responseData.text, references: responseData.references });
      setChatHistory([...chatHistory, {user:"ai", msg: responseData.text, sources:[]}]);
    } catch (error) {
      setError(error);
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
            
          {/* <div className="flex-1" /> */}
            
            <ScrollArea className="h-screen pt-8">
              <div className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0 leading-loose" 
                // style={{backgroundColor:"#9abcde"}}
              >
                {currentAIMsg && currentAIMsg.text}
              </div>
              {/* {chatHistory &&
                chatHistory.map((chat, index) => {
                  return chat.user == "ai" ? (
                    <div
                      key={chat + index.toString()}
                      className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
                    >
                      {chat.msg}
                    </div>
                  ) : (
                    <div
                      key={chat + index.toString()}
                      className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0 content-end"
                    >
                      {chat.msg}
                    </div>
                  );
                })} */}
            </ScrollArea>
            
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
                onChange={(e) => setCurrentUserMsg(e.target.value)}
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
                  size="sm" className="ml-auto gap-1.5"
                  onClick={e=>askAI(e)}  
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
            {/* <form className="grid w-full items-start gap-6"> */}
              <fieldset className="grid w-full items-start gap-6">
                <legend className="-ml-1 px-1 text-lg font-bold pb-4">
                  Settings
                </legend>
                <Separator />
                <div className="grid gap-3 pt-4 pr-4">
                  <Label htmlFor="model">Goal</Label>
                  <Select onValueChange={(e)=>setQuestionType(e)} defaultValue="answer">
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
                <Separator />

                <div className="grid gap-3 pr-4">
                  <legend className="-ml-1 px-1 text-lg font-bold pb-4">
                    Sources
                  </legend>
                  <ScrollArea>
                    {currentAIMsg && currentAIMsg.references.length > 0 && currentAIMsg.references.map((source, index) => {
                      return (<>
                        <div style={{
                          // backgroundColor:"#9abcde",
                          padding:"10px",
                          margin:"0px 10px 10px 0px",
                          borderRadius:"10px",
                          border:"1px solid #999",
                          // maxWidth:"inherit",
                        }}>
                          {source.name}
                          <br/>
                          Section: {source.section}
                          <br/>
                          Url: {source.url}
                        </div>
                        {/* <Card className="inline-block w-auto">
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
                        </Card> */}
                      </>
                    )})}
                  </ScrollArea>
                </div>

                {/* {[0,1,2].map((source, index) => {
                return (<>
                  <div style={{
                    // backgroundColor:"#9abcde",
                    padding:"10px",
                    margin:"0px 20px 0px 0px",
                    borderRadius:"10px",
                    border:"1px solid #333"
                  }}>{source}</div>
                </>)
              })} */}
              </fieldset>
            {/* </form> */}

            
          </div>
        </main>
      </div>
    </div>
  );
}
