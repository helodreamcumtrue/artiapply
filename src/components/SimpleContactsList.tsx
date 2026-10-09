'use client';

import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Pencil,
  Trash2,
  Mail,
  Building,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  Clock,
  X,
  Check,
} from 'lucide-react';
import { Contact } from '@/types/database';
import { formatDate } from '@/lib/utils/formatDate';

interface SimpleContactsListProps {
  contacts: Contact[];
  onUpdateContact: (updated: Contact) => void;
  onDeleteContact: (contactId: string) => void;
  onAddContact?: (newContact: Contact) => void;
  onNewCampaign?: () => void;
}

export const SimpleContactsList: React.FC<SimpleContactsListProps> = ({
  contacts,
  onUpdateContact,
  onDeleteContact,
  onAddContact,
  onNewCampaign,
}) => {
  const [search, setSearch] = useState('');
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Contact Form State
  const [newEmail, setNewEmail] = useState('');
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newRole, setNewRole] = useState('');

  // Filtered contacts based on search query
  const filteredContacts = contacts.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.email.toLowerCase().includes(q) ||
      (c.first_name || '').toLowerCase().includes(q) ||
      (c.last_name || '').toLowerCase().includes(q) ||
      (c.company || '').toLowerCase().includes(q) ||
      (c.role || '').toLowerCase().includes(q)
    );
  });

  // Handle Save Edit
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingContact) return;
    onUpdateContact(editingContact);
    setEditingContact(null);
  };

  // Handle Add Contact
  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) {
      alert('Email is required');
      return;
    }

    const created: Contact = {
      id: `manual-${Date.now()}`,
      campaign_id: 'default',
      user_id: 'user-1',
      email: newEmail.trim().toLowerCase(),
      first_name: newFirstName.trim() || undefined,
      last_name: newLastName.trim() || undefined,
      company: newCompany.trim() || undefined,
      role: newRole.trim() || undefined,
      status: 'pending',
      sent_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (onAddContact) {
      onAddContact(created);
    }

    setNewEmail('');
    setNewFirstName('');
    setNewLastName('');
    setNewCompany('');
    setNewRole('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-16 pt-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-poppins">Contacts</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200">
              {contacts.length} total
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            All contacts added till now on the platform. You can modify details or delete them anytime.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Contact</span>
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-sm flex items-center space-x-3">
        <Search className="w-4 h-4 text-slate-400 shrink-0 ml-1.5" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, company, or role..."
          className="w-full text-xs sm:text-sm text-slate-900 placeholder-slate-400 bg-transparent outline-none"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1"
          >
            Clear
          </button>
        )}
      </div>

      {/* Contacts Table View */}
      <div className="bg-white rounded-[24px] border border-slate-200/90 shadow-sm overflow-hidden">
        {filteredContacts.length === 0 ? (
          <div className="py-16 text-center text-slate-400 space-y-3">
            <Users className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-sm font-semibold text-slate-800">
              {contacts.length === 0 ? 'No contacts added yet' : 'No contacts matched your search'}
            </p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {contacts.length === 0
                ? 'Click "Add Contact" above or import a list when creating a new campaign.'
                : 'Try clearing your search query to see all contacts.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200/80">
                <tr>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Company & Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredContacts.map((c) => {
                  const statusColors: Record<string, string> = {
                    sent: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                    sending: 'bg-sky-50 text-sky-700 border-sky-200 animate-pulse',
                    failed: 'bg-rose-50 text-rose-700 border-rose-200',
                    pending: 'bg-slate-100 text-slate-600 border-slate-200',
                  };

                  return (
                    <tr key={c.id} className="hover:bg-slate-50/60 transition group">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-[11px] shrink-0">
                            {(c.first_name?.[0] || c.email[0]).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 text-xs">
                              {c.first_name || c.last_name
                                ? `${c.first_name || ''} ${c.last_name || ''}`.trim()
                                : 'Unnamed'}
                            </p>
                            <p className="text-[10px] text-slate-400">ID: {c.id.slice(0, 8)}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-800">
                        {c.email}
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-medium text-slate-900 text-xs">{c.company || '—'}</p>
                        <p className="text-[11px] text-slate-400">{c.role || '—'}</p>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                            statusColors[c.status] || statusColors.pending
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center space-x-1">
                          <button
                            type="button"
                            onClick={() => setEditingContact(c)}
                            title="Modify Contact Details"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete contact "${c.email}"?`)) {
                                onDeleteContact(c.id);
                              }
                            }}
                            title="Delete Contact"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* EDIT CONTACT MODAL */}
      {editingContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-[24px] max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 font-poppins">Modify Contact</h2>
              <button
                onClick={() => setEditingContact(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={editingContact.first_name || ''}
                    onChange={(e) =>
                      setEditingContact({ ...editingContact, first_name: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-900 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={editingContact.last_name || ''}
                    onChange={(e) =>
                      setEditingContact({ ...editingContact, last_name: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-900 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={editingContact.email}
                  onChange={(e) =>
                    setEditingContact({ ...editingContact, email: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 font-mono focus:outline-none focus:border-slate-900 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Company</label>
                  <input
                    type="text"
                    value={editingContact.company || ''}
                    onChange={(e) =>
                      setEditingContact({ ...editingContact, company: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-900 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Role / Job Title</label>
                  <input
                    type="text"
                    value={editingContact.role || ''}
                    onChange={(e) =>
                      setEditingContact({ ...editingContact, role: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-900 text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingContact(null)}
                  className="px-4 py-2 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD CONTACT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-[24px] max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 font-poppins">Add Contact</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateContact} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">First Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Alex"
                    value={newFirstName}
                    onChange={(e) => setNewFirstName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-900 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Rivers"
                    value={newLastName}
                    onChange={(e) => setNewLastName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-900 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="alex.rivers@company.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 font-mono focus:outline-none focus:border-slate-900 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Company</label>
                  <input
                    type="text"
                    placeholder="TechScale"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-900 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Role / Job Title</label>
                  <input
                    type="text"
                    placeholder="Head of Growth"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-900 text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-sm"
                >
                  Add Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
