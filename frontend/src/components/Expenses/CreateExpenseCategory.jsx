import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { axiosInstance } from "../../config/axios";
import { useBusinessStore } from "../../store/businessStore";
import { queryClient } from "../../main";
import toast from "react-hot-toast";

const CreateExpenseCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const [expenseType, setExpenseType] = useState("direct_expense");
  const { business } = useBusinessStore();

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post(
        `/expense/category/?businessId=${business?._id}`,
        { categoryName, expenseType }
      );
      return res.data?.expenseCategory;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["expenseCategory"] });
      toast.success("Expense category created");
      document.getElementById("expense_category_modal").close();
      setCategoryName("");
    },
  });

  return (
    <>
      <dialog id="expense_category_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Create Expense Category</h3>

          <div className="mt-2">
            <label
              htmlFor="category_name"
              className="text-zinc-600 text-xs mb-1"
            >
              Category Name
            </label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Enter Category Name"
              className="input input-sm w-full"
            />
          </div>

          <div className="mt-2">
            <label
              htmlFor="category_name"
              className="text-zinc-600 text-xs mb-1"
            >
              Expense Type
            </label>
            <select
              value={expenseType}
              onChange={(e) => setExpenseType(e.target.value)}
              className="select select-sm w-full"
            >
              <option value="direct_expense">Direct Expense</option>
              <option value="indirect_expense">Indirect Expense</option>
            </select>
          </div>

          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-sm">Close</button>
            </form>
            <button
              onClick={() => mutation.mutate()}
              className="btn btn-sm bg-[var(--primary-btn)]"
            >
              Save
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default CreateExpenseCategory;
