/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useState, useEffect, useCallback, useReducer } from "react";
import { ProductSale } from "../types/productSale";
import { CircularProgress } from "@mui/material";
import { Button, Typography } from "@material-tailwind/react";
import { TrashIcon } from "@heroicons/react/20/solid";
import axios from "axios";
import { useAppContext } from "../context/appContext";
import { apiBaseUrl } from "../config";

type FormSaleData = Partial<{
  [key in keyof ProductSale]: string;
}>;

type FormReducerAction = {
  type: "fill" | "reset";
  name?: keyof FormSaleData;
  payload?: FormSaleData;
};

function formReducer(
  prev: FormSaleData,
  action: FormReducerAction
): FormSaleData {
  switch (action.type) {
    case "fill":
      return {
        ...prev,
        [action.name!]: action.payload![action.name!]
      };
    case "reset":
      return {
        name: "",
        rate: "",
        expireDate: "",
        expired: ""
      };
    default:
      return prev;
  }
}

export default function AdminSalesPage() {
  const { makeNotification, enableWaiting, disableWaiting } = useAppContext();
  const [sales, setSales] = useState<ProductSale[] | undefined>(undefined);
  useEffect(() => {
    (async () => {
      const response = await axios.get(apiBaseUrl + "sale");
      setSales(response.data);
    })();
  }, []);
  const [pendingToDelete, setPendingToDelete] = useState<ProductSale | null>(
    null
  );

  const [isAdding, setIsAdding] = useState(false);
  const [newSale, dispatchSale] = useReducer(formReducer, {
    name: "",
    rate: "",
    expireDate: "",
    expired: ""
  });
  const [isEditing, setIsEditing] = useState<ProductSale | null>(null);

  const deleteType = useCallback(
    async (id: number) => {
      try {
        enableWaiting();
        await axios.delete(`/api/sale/${id}`);
        setSales((prev) => prev && prev.filter((type) => type.id !== id));
        setPendingToDelete(null);
      } catch (e) {
        makeNotification({
          type: "error",
          message: "Error deleting Sale"
        });
      } finally {
        disableWaiting();
      }
    },
    [setSales, setPendingToDelete]
  );

  const handleAddSale = useCallback(async () => {
    try {
      enableWaiting();
      if (newSale.name!.trim() === "") {
        return;
      }
      const response = await axios.post(apiBaseUrl + "sale", {
        name: newSale.name,
        rate: newSale.rate,
        expireDate: newSale.expireDate,
        expired: newSale.expired === "0" ? false : true
      });
      setSales((prev) => prev && [...prev, response.data]);
      setIsAdding(false);
      dispatchSale({
        type: "reset"
      });
    } catch (e) {
      makeNotification({
        type: "error",
        message: "Error adding type"
      });
    } finally {
      disableWaiting();
    }
  }, [newSale, setSales, setIsAdding, dispatchSale]);

  const handleEditSale = useCallback(
    async (
      sale: ProductSale,
      newData: Partial<{
        [key in keyof ProductSale]: any;
      }>
    ) => {
      try {
        enableWaiting();
        const res = await axios.put(`/api/sale/${sale?.id}`, {
          ...sale,
          ...newData
        });
        setSales((prev) => {
          const edited = prev?.findIndex((e) => e.id === isEditing?.id);
          if (prev && edited !== undefined && edited !== -1) {
            prev[edited] = {
              ...prev[edited],
              ...res.data
            };
          }
          return prev;
        });
        dispatchSale({
          type: "reset"
        });
        setIsEditing(null);
        makeNotification({
          type: "success",
          message: "Category Edited Successfully"
        });
      } catch (e) {
        makeNotification({
          type: "error",
          message: "There was an error when editing"
        });
      } finally {
        disableWaiting();
      }
    },
    [newSale, isEditing, setIsEditing, dispatchSale, setSales]
  );

  if (sales === undefined) {
    return (
      <CircularProgress
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)"
        }}
      />
    );
  } else {
    return (
      <>
        <div className="flex flex-col items-center gap-4 pt-8 w-fit mx-auto">
          {isAdding ? (
            <div className="flex flex-col gap-4">
              <Typography className="text-2xl font-bold">Add Sale</Typography>
              <div className="flex flex-col gap-4">
                <input
                  className="border border-gray-400 rounded-md p-2"
                  placeholder="Type Name"
                  value={newSale.name}
                  onChange={(e) =>
                    dispatchSale({
                      type: "fill",
                      name: "name",
                      payload: {
                        name: e.target.value
                      }
                    })
                  }
                />
                <input
                  className="border border-gray-400 rounded-md p-2"
                  placeholder="Rate"
                  type="number"
                  value={newSale.rate}
                  onChange={(e) =>
                    dispatchSale({
                      type: "fill",
                      name: "rate",
                      payload: {
                        rate: e.target.value
                      }
                    })
                  }
                />
                <input
                  className="border border-gray-400 rounded-md p-2"
                  placeholder="Expiry Date"
                  type="datetime-local"
                  value={newSale.expireDate}
                  onChange={(e) =>
                    dispatchSale({
                      type: "fill",
                      name: "expireDate",
                      payload: {
                        expireDate: e.target.value
                      }
                    })
                  }
                />
                <select
                  className="border border-gray-400 rounded-md p-2"
                  value={newSale.expired}
                  onChange={(e) =>
                    dispatchSale({
                      type: "fill",
                      name: "expired",
                      payload: {
                        expired: e.target.value
                      }
                    })
                  }
                >
                  <option value={"0"}>Active</option>
                  <option value={"1"}>Expired</option>
                </select>

                <div className="flex gap-4">
                  <Button
                    onClick={() => {
                      setIsAdding(false);
                      dispatchSale({
                        type: "reset"
                      });
                    }}
                    className="bg-gray"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddSale}
                    color="green"
                    disabled={newSale.name === ""}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex w-full">
              <Button className="bg-primary" onClick={() => setIsAdding(true)}>
                Add Sale
              </Button>
            </div>
          )}
          <div className="relative flex flex-col w-max gap-8 max-h-[70vh] md:max-h-[70vh] shadow-lg rounded-md md:px-20 py-8 overflow-y-auto">
            {sales.length > 0 ? (
              sales
                .sort((a, b) => {
                  const isExpiredA =
                    Date.now() > new Date(a.expireDate as string).getTime();
                  const isExpiredB =
                    Date.now() > new Date(b.expireDate as string).getTime();
                  if (isExpiredA && !isExpiredB) {
                    return 1;
                  } else if (!isExpiredA && isExpiredB) {
                    return -1;
                  } else {
                    return 0;
                  }
                })
                .map((sale, idx) => (
                  <SaleItem
                    key={idx}
                    sale={sale}
                    onDelete={() => {
                      setPendingToDelete(sale);
                    }}
                    onEdit={(sale, newData) => {
                      handleEditSale(sale, newData);
                    }}
                  />
                ))
            ) : (
              <div className="flex flex-col items-center gap-4">
                <Typography className="text-2xl font-bold">No Sales</Typography>
              </div>
            )}
          </div>
        </div>
        {pendingToDelete && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
            <div className="flex flex-col gap-4 p-4 bg-white rounded-md">
              <Typography variant="h5">
                Are you sure you want to delete this Sale?
              </Typography>
              <div className="flex gap-4">
                <button
                  className="px-4 py-2 bg-green-500 rounded-md text-white"
                  onClick={() => {
                    setPendingToDelete(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-primary rounded-md text-white"
                  onClick={() => {
                    deleteType(pendingToDelete.id).finally(() => {
                      setPendingToDelete(null);
                      disableWaiting();
                    });
                  }}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
}

function SaleItem({
  sale,
  onDelete,
  onEdit
}: {
  sale: ProductSale;
  onDelete: (sale: ProductSale) => void;
  onEdit: (
    sale: ProductSale,
    newData: Partial<{
      [key in keyof ProductSale]: any;
    }>
  ) => void | Promise<unknown>;
}) {
  const [editedFields, setEditedFields] = useState<
    Partial<{
      [key in keyof ProductSale]: any;
    }>
  >({});

  const handleEditSale = (name: keyof ProductSale, value: any) => {
    if (sale[name] !== value) {
      setEditedFields((prev) => ({
        ...prev,
        [name]: value
      }));
    } else {
      setEditedFields((prev) => {
        const newPrev = { ...prev };
        delete newPrev[name];
        return newPrev;
      });
    }
  };

  const handleReset = () => {
    setEditedFields({});
  };

  return (
    <div
      className="flex gap-4 flex-col w-full relative"
      style={{
        opacity:
          Date.now() > new Date(sale.expireDate as string).getTime() ? 0.5 : 1
      }}
    >
      <div className="flex gap-2 w-full justify-center">
        <Typography className="text-md text-center font-medium">
          Sale Name:
        </Typography>
        <Typography className="text-md text-center font-semibold">
          {editedFields.name ?? sale.name}
        </Typography>
      </div>
      <div className="flex gap-2 w-full justify-center">
        <Typography className="text-2md text-center font-medium ">
          Rate
        </Typography>
        <Typography className="text-2md text-center font-semibold">
          {(editedFields.rate ?? sale.rate) * 100}% off
        </Typography>
      </div>
      <div className="flex gap-2 justify-center flex-wrap">
        <Typography className="text-2md w-full text-center font-medium">
          Auto Expire at:
        </Typography>
        <Typography className="text-2md w-full text-center font-semibold">
          {sale.expireDate
            ? Date.now() < new Date(sale.expireDate).getTime()
              ? new Date(sale.expireDate).toLocaleDateString() +
                " on " +
                new Date(sale.expireDate).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit"
                })
              : "Expired"
            : "N/A"}
        </Typography>
      </div>
      {Date.now() < new Date(sale.expireDate as string).getTime() && (
        <div className="flex items-center gap-2 justify-center">
          <Typography
            variant="lead"
            className="text-2md text-center font-medium"
          >
            Currently Active:
          </Typography>
          <select
            className="border border-gray-400 rounded-md p-2"
            value={
              editedFields["expired"] !== null &&
              editedFields["expired"] !== undefined
                ? editedFields["expired"]
                  ? "1"
                  : "0"
                : sale.expired
                ? "1"
                : "0"
            }
            onChange={(e) =>
              handleEditSale("expired", e.target.value === "0" ? false : true)
            }
          >
            <option value={"0"}>Active</option>
            <option value={"1"}>Expired</option>
          </select>
        </div>
      )}
      <div className="flex gap-4 justify-center">
        <Button
          className="bg-cyan-700"
          onClick={() => onEdit(sale, editedFields)}
          disabled={Object.keys(editedFields).length === 0}
        >
          Save
        </Button>
        <Button
          className="bg-gray"
          onClick={handleReset}
          disabled={Object.keys(editedFields).length === 0}
        >
          Reset
        </Button>
      </div>
      <div className="flex gap-2 absolute right-1 top-1">
        <button onClick={() => onDelete(sale)}>
          <TrashIcon className="w-6 h-6 text-red-500" />
        </button>
      </div>
    </div>
  );
}
