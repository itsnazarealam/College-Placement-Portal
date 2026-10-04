import { useState, useEffect } from 'react'
import {
  fetchAllCompanies,
  deleteCompany as apiDeleteCompany,
  updateCompany,
} from '../../services/api'
import { Button } from '../../components/ui/Button'
import { Card, CardHeader } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Table, Td, Th } from '../../components/ui/Table'
import { validateEmail, validateRequired } from '../../utils/validation'

export function AdminCompanies() {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', contact: '', industry: '' })
  const [errors, setFormErrors] = useState({})
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [actionError, setActionError] = useState('')

  useEffect(() => {
    fetchAllCompanies()
      .then((data) => setCompanies(data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  function setField(name, value) {
    setForm((f) => ({ ...f, [name]: value }))
    setFormErrors((e) => ({ ...e, [name]: '' }))
  }

  function validate() {
    const e = {}
    e.name = validateRequired(form.name, 'Name')
    e.email = validateEmail(form.email)
    setFormErrors(e)
    return !Object.values(e).some(Boolean)
  }

  function startEdit(c) {
    setEditingId(c.companyId)
    setForm({
      name: c.companyName ?? '',
      email: c.companyMail ?? '',
      contact: c.contact ?? '',
      industry: c.industry ?? '',
    })
    setActionError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelEdit() {
    setEditingId(null)
    setForm({ name: '', email: '', contact: '', industry: '' })
    setFormErrors({})
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    if (!validate()) return
    setSaving(true)
    setActionError('')
    try {
      const updated = await updateCompany(editingId, form)
      setCompanies((prev) =>
        prev.map((c) => (c.companyId === editingId ? updated : c))
      )
      cancelEdit()
    } catch (err) {
      setActionError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(c) {
    setActionError('')
    try {
      await apiDeleteCompany(c.companyId)
      setCompanies((prev) => prev.filter((x) => x.companyId !== c.companyId))
    } catch (err) {
      setActionError(err.message)
    }
  }

  return (
    <div className="space-y-8">
      {actionError && <p className="text-sm text-red-600">{actionError}</p>}

      {editingId && (
        <Card>
          <CardHeader
            title="Edit company"
            subtitle="Update the company details below."
          />
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Company name"
              name="name"
              value={form.name}
              onChange={(e) => setField('name', e.target.value)}
              error={errors.name}
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={(e) => setField('email', e.target.value)}
              error={errors.email}
            />
            <Input
              label="Contact"
              name="contact"
              value={form.contact}
              onChange={(e) => setField('contact', e.target.value)}
            />
            <Input
              label="Industry"
              name="industry"
              value={form.industry}
              onChange={(e) => setField('industry', e.target.value)}
            />
            <div className="flex flex-wrap gap-2 sm:col-span-2">
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving…' : 'Save changes'}
              </Button>
              <Button type="button" variant="secondary" onClick={cancelEdit}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card>
        <CardHeader
          title="Companies list"
          subtitle="All companies registered in the system."
        />

        {loading && <p className="text-sm text-slate-500">Loading companies…</p>}
        {!loading && error && (
          <p className="text-sm text-red-600">Error: {error}</p>
        )}
        {!loading && !error && companies.length === 0 && (
          <p className="text-sm text-slate-500">No companies found.</p>
        )}

        {!loading && !error && companies.length > 0 && (
          <Table>
            <thead>
              <tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Role</Th>
                <Th>Package</Th>
                <Th>Status</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {companies.map((c) => (
                <tr
                  key={c.companyId}
                  className={editingId === c.companyId ? 'bg-brand-50' : ''}
                >
                  <Td className="font-medium">{c.companyName ?? '—'}</Td>
                  <Td>{c.companyMail ?? '—'}</Td>
                  <Td>{c.role ?? '—'}</Td>
                  <Td>{c.packageOffered ?? '—'}</Td>
                  <Td>
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        c.approved
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {c.approved ? 'Approved' : 'Pending'}
                    </span>
                  </Td>
                  <Td className="text-right">
                    <button
                      type="button"
                      className="text-sm font-medium text-brand-700 hover:underline"
                      onClick={() => startEdit(c)}
                    >
                      Edit
                    </button>
                    <span className="mx-2 text-slate-300">|</span>
                    <button
                      type="button"
                      className="text-sm font-medium text-red-600 hover:underline"
                      onClick={() => handleDelete(c)}
                    >
                      Remove
                    </button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  )
}
