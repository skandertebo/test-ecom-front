import { Select, Option } from "@material-tailwind/react";
import { products } from "../assets/fakeData";
import ItemCard from "./ItemCard";
import React from "react";
export default function CatalogueSection(): JSX.Element {
  return (
    <div
      id="catalogueSection"
      className="py-24 px-8 lg:px-0 flex flex-col gap-8 items-center w-full lg:w-[80%] max-w-[900px] mx-auto"
    >
      <div className="flex flex-col w-full">
        <h1 className="text-4xl font-bold">Catalogue</h1>
        <h1 className="text-2xl font-medium">Check out our latest products</h1>
      </div>
      <div className="flex p-2 border rounded-lg w-full border-blue-gray-600">
        <div className="">
          <Select label="Category">
            <Option value="all">All</Option>
          </Select>
        </div>
      </div>
      <div className="flex flex-wrap justify-center xs:justify-start w-full gap-x-16 gap-y-8">
        {products.map((product, idx) => (
          <ItemCard product={product} key={idx} />
        ))}
      </div>
    </div>
  );
}
