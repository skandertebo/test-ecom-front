import { useOutlet } from "react-router-dom";
import React from "react";
import Navtop from "../components/Navtop";

export default function MainLayout(): JSX.Element {
  const outlet = useOutlet();
  return (
    <div className="flex flex-col flex-1">
      <Navtop />
      {outlet}
      <h1>Footer</h1>
    </div>
  );
}
