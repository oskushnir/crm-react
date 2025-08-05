import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useState, type ReactNode } from "react";

interface TabsFormProps {
  defaultValue: string;
  tabs: { label: string; value: string }[];
  children: ReactNode;
}

export function TabsForm({ defaultValue, tabs, children }: TabsFormProps) {
  const [currentValue, setCurrentValue] = useState(defaultValue);

  return (
    <div className="flex w-full flex-col gap-6">
      <Tabs value={currentValue} onValueChange={setCurrentValue}>
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {children}
      </Tabs>
    </div>
  );
}
