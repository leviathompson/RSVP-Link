import React from "react";
import { useAuth } from "../context/AuthProvider";
import Page from "../components/Page";
import Card from "../components/Card";

const Party = () => {
  return (
    <Page title="Profile">
      <Card title="Party Name">
        <div className="flex flex-col gap-4">
          <div className="bg-cream-100 p-4 rounded-3xl">test</div>
          <div className="bg-cream-100 p-4 rounded-3xl">test</div>
          <div className="bg-cream-100 p-4 rounded-3xl">test</div>
        </div>
      </Card>
    </Page>
  );
};

export default Party;
