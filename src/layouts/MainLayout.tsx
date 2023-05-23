import { useOutlet } from "react-router-dom";
import Navtop from "../components/Navtop";
import Footer from "../components/Footer";

export default function MainLayout(): JSX.Element {
  const outlet = useOutlet();
  return (
    <div className="flex flex-col flex-1">
      <Navtop />
      {outlet}
      <Footer />
    </div>
  );
}
