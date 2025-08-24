"use client";
import { useState } from "react";
import NewTicketForm from "./NewTicketForm";

export default function NewTicketButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="btn" onClick={() => setOpen(true)}>+ New Ticket</button>
      {open && <NewTicketForm onClose={() => setOpen(false)} />}
    </>
  );
}