import { useMemo, useState } from 'react'
import { FiEdit2, FiHome, FiMapPin, FiPlus, FiTrash2 } from 'react-icons/fi'
import { savedAddresses } from '../data/userFeatures'
import './Home.css'
import './UserFeatures.css'

const emptyAddress = {
  label: 'Home',
  name: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  pincode: '',
  isDefault: false,
}

function FeatureNav() {
  return (
    <header className="feature-nav">
      <a className="brand" href="/">
        <span className="brand-mark">QC</span>
        QuickCart
      </a>
      <nav className="feature-nav-links" aria-label="User feature navigation">
        <a href="/products">Products</a>
        <a href="/wishlist">Wishlist</a>
        <a href="/cart">Cart</a>
      </nav>
    </header>
  )
}

function AddressCard({ address, onDelete, onEdit, onSetDefault }) {
  return (
    <article className="address-card">
      <div className="address-card-header">
        <span className="address-label">
          <FiMapPin />
          {address.label}
        </span>
        {address.isDefault ? <span className="default-pill">Default</span> : null}
      </div>
      <div>
        <h2>{address.name}</h2>
        <p>{address.phone}</p>
      </div>
      <p>
        {address.line1}, {address.line2}, {address.city}, {address.state} -{' '}
        {address.pincode}
      </p>
      <div className="address-actions">
        <button className="soft-button" type="button" onClick={() => onEdit(address)}>
          <FiEdit2 /> Edit
        </button>
        <button className="light-button" type="button" onClick={() => onSetDefault(address.id)}>
          Set Default
        </button>
        <button className="danger-button" type="button" onClick={() => onDelete(address.id)}>
          <FiTrash2 /> Delete
        </button>
      </div>
    </article>
  )
}

function AddressForm({ editingAddress, onCancel, onSubmit }) {
  const initialForm = useMemo(() => editingAddress ?? emptyAddress, [editingAddress])
  const [form, setForm] = useState(initialForm)

  function updateField(event) {
    const { name, type, checked, value } = event.target
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  function submitForm(event) {
    event.preventDefault()
    onSubmit(form)
    setForm(emptyAddress)
  }

  return (
    <form className="address-form" onSubmit={submitForm}>
      <div className="address-card-header">
        <h2>{editingAddress ? 'Edit address' : 'Add address'}</h2>
        {editingAddress ? (
          <button className="light-button" type="button" onClick={onCancel}>
            Cancel
          </button>
        ) : null}
      </div>
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="label">Label</label>
          <select id="label" name="label" value={form.label} onChange={updateField}>
            <option>Home</option>
            <option>Office</option>
            <option>Hostel</option>
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" value={form.name} onChange={updateField} required />
        </div>
        <div className="form-field">
          <label htmlFor="phone">Phone</label>
          <input id="phone" name="phone" value={form.phone} onChange={updateField} required />
        </div>
        <div className="form-field">
          <label htmlFor="pincode">Pincode</label>
          <input
            id="pincode"
            name="pincode"
            value={form.pincode}
            onChange={updateField}
            required
          />
        </div>
        <div className="form-field full">
          <label htmlFor="line1">Address line 1</label>
          <input id="line1" name="line1" value={form.line1} onChange={updateField} required />
        </div>
        <div className="form-field full">
          <label htmlFor="line2">Address line 2</label>
          <input id="line2" name="line2" value={form.line2} onChange={updateField} required />
        </div>
        <div className="form-field">
          <label htmlFor="city">City</label>
          <input id="city" name="city" value={form.city} onChange={updateField} required />
        </div>
        <div className="form-field">
          <label htmlFor="state">State</label>
          <input id="state" name="state" value={form.state} onChange={updateField} required />
        </div>
      </div>
      <label className="checkbox-field">
        <input
          name="isDefault"
          type="checkbox"
          checked={form.isDefault}
          onChange={updateField}
        />
        Make this the default address
      </label>
      <button className="feature-button" type="submit">
        <FiPlus />
        {editingAddress ? 'Save Address' : 'Add Address'}
      </button>
    </form>
  )
}

function Addresses() {
  const [addresses, setAddresses] = useState(savedAddresses)
  const [editingAddress, setEditingAddress] = useState(null)

  function saveAddress(address) {
    setAddresses((current) => {
      const nextAddress = {
        ...address,
        id: address.id ?? `addr-${Date.now()}`,
      }
      const nextAddresses = address.id
        ? current.map((item) => (item.id === address.id ? nextAddress : item))
        : [nextAddress, ...current]

      if (!nextAddress.isDefault) return nextAddresses

      return nextAddresses.map((item) => ({
        ...item,
        isDefault: item.id === nextAddress.id,
      }))
    })
    setEditingAddress(null)
  }

  function deleteAddress(addressId) {
    setAddresses((current) => current.filter((address) => address.id !== addressId))
  }

  function setDefaultAddress(addressId) {
    setAddresses((current) =>
      current.map((address) => ({
        ...address,
        isDefault: address.id === addressId,
      })),
    )
  }

  return (
    <div className="feature-shell">
      <FeatureNav />
      <section className="feature-hero">
        <div>
          <p className="eyebrow">
            <FiHome />
            Address management
          </p>
          <h1>Manage delivery addresses for quick checkout.</h1>
          <p>
            Add home, office, or hostel addresses and keep one default location ready
            for future order APIs.
          </p>
        </div>
        <span className="feature-hero-badge">{addresses.length} saved addresses</span>
      </section>

      <main className="feature-section address-layout">
        <div className="address-grid">
          {addresses.map((address) => (
            <AddressCard
              address={address}
              key={address.id}
              onDelete={deleteAddress}
              onEdit={setEditingAddress}
              onSetDefault={setDefaultAddress}
            />
          ))}
        </div>
        <AddressForm
          editingAddress={editingAddress}
          key={editingAddress?.id ?? 'new-address'}
          onCancel={() => setEditingAddress(null)}
          onSubmit={saveAddress}
        />
      </main>
    </div>
  )
}

export default Addresses
