import { useState, useEffect, useCallback } from "react";
import { ProductType } from "../types/productType";
import { CircularProgress } from "@mui/material";
import { Button, Typography } from "@material-tailwind/react";
import React from "react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/20/solid";
import axios, { AxiosError } from "axios";
import { useAppContext } from "../context/appContext";
import { apiBaseUrl } from "../config";

export default function AdminTypesPage() {
  const { makeNotification, enableWaiting, disableWaiting } = useAppContext();
  const [types, setTypes] = useState<ProductType[] | undefined>(undefined);
  useEffect(() => {
    (async () => {
      const response = await axios.get(apiBaseUrl + "type");
      setTypes(response.data);
    })();
  }, []);
  const [pendingToDelete, setPendingToDelete] = useState<ProductType | null>(
    null
  );

  const [isAdding, setIsAdding] = useState(false);
  const [newType, setNewType] = useState("");
  const [isEditing, setIsEditing] = useState<ProductType | null>(null);

  const deleteType = useCallback(
    async (id: number) => {
      try {
        enableWaiting();
        await axios.delete(`/api/type/${id}`);
        setTypes((prev) => prev && prev.filter((type) => type.id !== id));
        setPendingToDelete(null);
      } catch (e) {
        if (
          e instanceof AxiosError &&
          e.response?.status === 400 &&
          e.response.data?.error === "ForeignKeyConstraintViolationException"
        ) {
          makeNotification({
            type: "error",
            message:
              "Cannot delete Category because it is used by some products"
          });
        } else {
          makeNotification({
            type: "error",
            message: "Error deleting Category"
          });
        }
      } finally {
        disableWaiting();
      }
    },
    [setTypes, setPendingToDelete]
  );

  const handleAddType = useCallback(async () => {
    try {
      enableWaiting();
      if (newType.trim() === "") {
        return;
      }
      const response = await axios.post(apiBaseUrl + "type", {
        name: newType
      });
      setTypes((prev) => prev && [...prev, response.data]);
      setIsAdding(false);
      setNewType("");
    } catch (e) {
      makeNotification({
        type: "error",
        message: "Error adding type"
      });
    } finally {
      disableWaiting();
    }
  }, [newType, setTypes, setIsAdding, setNewType]);

  const handleEditType = useCallback(async () => {
    try {
      enableWaiting();
      const res = await axios.put(`/api/type/${isEditing?.id}`, {
        name: newType
      });
      setTypes((prev) => {
        const edited = prev?.findIndex((e) => e.id === isEditing?.id);
        if (prev && edited !== undefined && edited !== -1) {
          prev[edited] = {
            ...prev[edited],
            ...res.data
          };
        }
        return prev;
      });
      setNewType("");
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
  }, [newType, isEditing, setIsEditing, setNewType, setTypes]);

  if (types === undefined) {
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
        {isEditing && (
          <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex justify-center items-center">
            <div className="flex flex-col gap-4 p-4 bg-white rounded-md">
              <Typography variant="h5">Edit Category</Typography>
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  value={newType}
                  onChange={(e) => {
                    setNewType(e.target.value);
                  }}
                  className="border border-gray-300 rounded-md p-2"
                />
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={() => {
                      setIsEditing(null);
                      setNewType("");
                    }}
                    className="bg-gray"
                  >
                    Cancel
                  </Button>
                  <Button className="bg-cyan-700" onClick={handleEditType}>
                    Confirm
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        {pendingToDelete && (
          <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex justify-center items-center">
            <div className="flex flex-col gap-4 p-4 bg-white rounded-md">
              <Typography variant="h5">
                Are you sure you want to delete this Category?
              </Typography>
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => setPendingToDelete(null)}
                  className="bg-gray"
                >
                  Cancel
                </Button>
                <Button
                  color="red"
                  onClick={() => {
                    deleteType(pendingToDelete.id);
                  }}
                >
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        )}
        <div className="flex flex-col items-center gap-4 md:pt-8 w-fit mx-auto">
          {isAdding ? (
            <div className="flex flex-col gap-4">
              <Typography className="text-2xl font-bold">
                Add Category
              </Typography>
              <div className="flex flex-col gap-4">
                <input
                  className="border border-gray-400 rounded-md p-2"
                  placeholder="Type Name"
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                />
                <div className="flex gap-4">
                  <Button
                    onClick={() => {
                      setIsAdding(false);
                      setNewType("");
                    }}
                    className="bg-gray"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddType}
                    color="green"
                    disabled={newType === ""}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex w-full">
              <Button className="bg-primary" onClick={() => setIsAdding(true)}>
                Add Category
              </Button>
            </div>
          )}
          <div className="flex flex-col w-max gap-8 max-h-[70vh] md:max-h-[70vh] shadow-lg rounded-md md:px-24 py-12 overflow-y-auto">
            {types.length > 0 ? (
              types.map((type) => (
                <React.Fragment key={type.id}>
                  <div className="flex gap-4">
                    <Typography className="text-2xl w-full text-center font-semibold p-2 px-4 bg-cyan-700 text-white rounded-xl shadow-lg">
                      {type.name}
                    </Typography>
                    <div className="flex gap-2">
                      <button onClick={() => setPendingToDelete(type)}>
                        <TrashIcon className="w-6 h-6 text-red-500" />
                      </button>
                      <button onClick={() => setIsEditing(type)}>
                        <PencilSquareIcon className="w-6 h-6 text-cyan-700" />
                      </button>
                    </div>
                  </div>
                </React.Fragment>
              ))
            ) : (
              <div className="flex flex-col items-center gap-4">
                <Typography className="text-2xl font-bold">No Types</Typography>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }
}
