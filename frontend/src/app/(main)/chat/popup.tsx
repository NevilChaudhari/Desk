'use client'

import { useState } from "react";

type CreateGroupData = {
  name: string;
};
type JoinGroupData = {
  id: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (group: CreateGroupData) => void;
  onJoin: (group: JoinGroupData) => void;
};

export default function CreateGroupModal({
  open,
  onClose,
  onCreate,
  onJoin,
}: Props) {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [joinGrp, setJoinGrp] = useState<boolean>(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleCreate = () => {
    if (joinGrp) {
      if (!id.trim()) {
        setError("Please enter a group id.");
        return;
      }
    } else {
      if (!name.trim()) {
        setError("Please enter a group name.");
        return;
      }
    }

    if (joinGrp) {
      onJoin({
        id: id.trim()
      });
    } else {
      onCreate({
        name: name.trim()
      });
    }

    onClose();
  };
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl text-foreground bg-background p-6 shadow-2xl"
      >
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 id="modal-title" className="text-xl font-bold">
              {joinGrp ? 'Join a Group' : 'Create a Group'}
            </h2>
            <p className="mt-1 text-sm">
              Bring people together to get things done.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Group Name */}
        <div className="mb-4 flex place-content-around">
          <label onClick={() => setJoinGrp(false)} htmlFor="group-name" className={`mb-2 text-xl cursor-pointer ${!joinGrp ? 'text-primary/80 border-b' : 'hover:text-primary/80'} hover:border-b w-full flex items-center justify-center text-sm font-medium text-gray-700`}>Create</label>
          <label onClick={() => setJoinGrp(true)} htmlFor="group-name" className={`mb-2 text-xl cursor-pointer ${joinGrp ? 'text-primary/80 border-b' : 'hover:text-primary/80'} hover:border-b w-full flex items-center justify-center text-sm font-medium text-gray-700`}>Join</label>
        </div>

        {!joinGrp && (<div className="mb-4">
          <label htmlFor="group-name" className="mb-2 block text-sm font-medium text-gray-700">
            Group name <span className="text-red-500">*</span>
          </label>
          <input
            id="group-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Final Year Project"
            maxLength={60}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>)}

        {error && (
          <p role="alert" className="mb-3 text-sm text-red-600">{error}</p>
        )}

        {/* Group Name */}
        {joinGrp && (<div className="mb-4">
          <label htmlFor="group-name" className="mb-2 block text-sm font-medium text-gray-700">
            Group Id <span className="text-red-500">*</span>
          </label>
          <input
            id="group-name"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="e.g. 9df0ada3-a0e6-41f6-93e2-4ba122043c15"
            maxLength={36}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>)}

        {/* Footer */}
        <div className="flex justify-end gap-3 border-gray-100 pt-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.98]"
          >
            {joinGrp ? 'Join Group' : 'Create Group'}
          </button>
        </div>
      </div>
    </div>
  );
}