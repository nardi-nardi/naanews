"use client";
import { useState } from "react";

/**
 * Shared state and save handler for admin tab components.
 * Handles the create/edit/cancel form flow and the fetch to
 * the backing API endpoint.
 */
export function useAdminTab<T extends { id: number }>(
  endpoint: string,
  successMessage: string,
  flash: (msg: string) => void,
  onRefresh: () => void
) {
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleSave = async (formData: unknown) => {
    const res = await fetch(
      editingItem ? `${endpoint}/${editingItem.id}` : endpoint,
      {
        method: editingItem ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }
    );
    if (res.ok) {
      flash(successMessage);
      setShowForm(false);
      setEditingItem(null);
      onRefresh();
    } else {
      flash("❌ Gagal simpan");
    }
  };

  const startEdit = (item: T) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const startCreate = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  return { editingItem, showForm, handleSave, startEdit, startCreate, cancelForm };
}
