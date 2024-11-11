import React from "react";
import { Link } from "react-router-dom";
import Page from "../components/Page";
import Card from "../components/Card";

const Welcome = () => {
  return (
    <Page title="RSVP" background="/images/Levi-13-3.jpg">
      <Card title={<span className="gold">Log in or Register</span>}>
        <div className="flex gap-4 flex-col">
          <div className="grow flex flex-col gap-1">
            <div>Existing user</div>
            <Link to="/login">
              <button className="btn-secondary">Log in</button>
            </Link>
          </div>
          <div className="order-1 flex flex-col gap-1">
            <div>New user</div>
            <Link to="/signup">
              <button className="btn-primary">Create account</button>
            </Link>
          </div>
        </div>
        <div className="mt-2">
          If this is your first time, you'll need to create an account.
        </div>
      </Card>
    </Page>
  );
};

export default Welcome;
