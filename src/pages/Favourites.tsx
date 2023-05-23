import ItemCard from "../components/ItemCard";
import { useAppContext } from "../context/appContext";

export default function Favourites(): JSX.Element {
  const { favorites } = useAppContext();

  return (
    <div className="py-24 px-8 lg:px-0 flex flex-col gap-8 items-center w-full lg:w-[80%] max-w-[900px] mx-auto">
      <div className="flex flex-col w-full">
        <h1 className="text-4xl font-bold">Favourites</h1>
        <h1 className="text-2xl font-medium">
          Check out your favourite products
        </h1>
      </div>
      <div className="flex flex-wrap justify-center xs:justify-start w-full gap-x-16 gap-y-8 max-h-3/4">
        {favorites.map((fav, idx) => (
          <ItemCard product={fav.product} key={idx} />
        ))}
      </div>
    </div>
  );
}
