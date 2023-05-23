import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="flex flex-col flex-1 mt-4 py-4 justify-center items-center h-16 bg-primary text-white">
      <p className="text-center">
        &copy; 2023 <span className="font-bold">E-Commerce</span>
      </p>
      <Link to={"/admin"}>
        <span className="text-sm underline underline-offset-1">
          Visit Admin Page
        </span>
      </Link>
    </footer>
  );
}
