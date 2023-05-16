import HomeHeader from "../components/HomeHeader";
import { Divider } from "@mui/material";
import CatalogueSection from "../components/CatalogueSection";

export default function Home(): JSX.Element {
  return (
    <div className="flex flex-col flex-1">
      <Divider className="text-gray bg-gray" />
      <HomeHeader />
      <CatalogueSection />
    </div>
  );
}
